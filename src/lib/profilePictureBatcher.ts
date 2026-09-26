/** The kind of id a profile picture is looked up by. Core resolves all three to the same person. */
export type ProfilePictureIdKind = 'user' | 'student' | 'courseParticipation'

export interface ProfilePictureLookupRequest {
  userIds: string[]
  studentIds: string[]
  courseParticipationIds: string[]
}

/** Presigned URLs keyed by id. Ids without a picture are missing. */
export interface ProfilePictureLookupResponse {
  users: Record<string, string>
  students: Record<string, string>
  courseParticipations: Record<string, string>
}

export type ProfilePictureLookup = (
  request: ProfilePictureLookupRequest,
) => Promise<ProfilePictureLookupResponse>

/** Matches the server's limit for a single lookup request. */
export const MAX_LOOKUP_IDS = 1000

interface Waiter {
  resolve: (url: string | null) => void
  reject: (error: unknown) => void
}

interface PendingRequest {
  kind: ProfilePictureIdKind
  id: string
  waiters: Waiter[]
}

const requestFields: Record<ProfilePictureIdKind, keyof ProfilePictureLookupRequest> = {
  user: 'userIds',
  student: 'studentIds',
  courseParticipation: 'courseParticipationIds',
}

const responseFields: Record<ProfilePictureIdKind, keyof ProfilePictureLookupResponse> = {
  user: 'users',
  student: 'students',
  courseParticipation: 'courseParticipations',
}

const toRequest = (pending: PendingRequest[]): ProfilePictureLookupRequest => {
  const request: ProfilePictureLookupRequest = {
    userIds: [],
    studentIds: [],
    courseParticipationIds: [],
  }
  for (const { kind, id } of pending) {
    request[requestFields[kind]].push(id)
  }
  return request
}

/**
 * Collects every picture requested in the same tick into one lookup, so a table with hundreds of
 * avatars costs one request instead of hundreds. Resolves to null for ids without a picture.
 * A failed lookup rejects instead, so callers can retry it rather than cache "no picture".
 */
export const createProfilePictureBatcher = (
  lookup: ProfilePictureLookup,
  schedule: (flush: () => void) => void = (flush) => setTimeout(flush, 0),
) => {
  let pending = new Map<string, PendingRequest>()

  const flush = async () => {
    const batch = [...pending.values()]
    pending = new Map()

    for (let start = 0; start < batch.length; start += MAX_LOOKUP_IDS) {
      const chunk = batch.slice(start, start + MAX_LOOKUP_IDS)
      let response: ProfilePictureLookupResponse
      try {
        response = await lookup(toRequest(chunk))
      } catch (error) {
        for (const { waiters } of chunk) {
          for (const { reject } of waiters) {
            reject(error)
          }
        }
        continue
      }
      for (const { kind, id, waiters } of chunk) {
        const url = response[responseFields[kind]]?.[id] ?? null
        for (const { resolve } of waiters) {
          resolve(url)
        }
      }
    }
  }

  return {
    load: (kind: ProfilePictureIdKind, id: string): Promise<string | null> =>
      new Promise((resolve, reject) => {
        if (pending.size === 0) {
          schedule(() => {
            void flush()
          })
        }
        const key = `${kind}:${id}`
        const existing = pending.get(key)
        if (existing) {
          existing.waiters.push({ resolve, reject })
        } else {
          pending.set(key, { kind, id, waiters: [{ resolve, reject }] })
        }
      }),
  }
}
