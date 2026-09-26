import { describe, expect, it } from 'vitest'
import {
  createProfilePictureBatcher,
  MAX_LOOKUP_IDS,
  type ProfilePictureLookupRequest,
  type ProfilePictureLookupResponse,
} from './profilePictureBatcher'

const emptyResponse = (): ProfilePictureLookupResponse => ({
  users: {},
  students: {},
  courseParticipations: {},
})

// Runs the flush only when the test says so, instead of on a timer.
const manualSchedule = () => {
  const queued: (() => void)[] = []
  return {
    schedule: (flush: () => void) => {
      queued.push(flush)
    },
    run: () => {
      for (const flush of queued.splice(0)) {
        flush()
      }
    },
  }
}

describe('createProfilePictureBatcher', () => {
  it('combines ids requested in the same tick into one lookup', async () => {
    const requests: ProfilePictureLookupRequest[] = []
    const scheduler = manualSchedule()
    const batcher = createProfilePictureBatcher(async (request) => {
      requests.push(request)
      return {
        users: { u1: 'url-u1' },
        students: { s1: 'url-s1' },
        courseParticipations: { c1: 'url-c1' },
      }
    }, scheduler.schedule)

    const results = Promise.all([
      batcher.load('user', 'u1'),
      batcher.load('student', 's1'),
      batcher.load('courseParticipation', 'c1'),
      batcher.load('student', 's2'),
    ])
    scheduler.run()

    expect(await results).toEqual(['url-u1', 'url-s1', 'url-c1', null])
    expect(requests).toEqual([
      { userIds: ['u1'], studentIds: ['s1', 's2'], courseParticipationIds: ['c1'] },
    ])
  })

  it('requests a repeated id once and resolves every caller', async () => {
    const requests: ProfilePictureLookupRequest[] = []
    const scheduler = manualSchedule()
    const batcher = createProfilePictureBatcher(async (request) => {
      requests.push(request)
      return { ...emptyResponse(), students: { s1: 'url-s1' } }
    }, scheduler.schedule)

    const results = Promise.all([batcher.load('student', 's1'), batcher.load('student', 's1')])
    scheduler.run()

    expect(await results).toEqual(['url-s1', 'url-s1'])
    expect(requests[0].studentIds).toEqual(['s1'])
  })

  it('splits large batches at the server limit', async () => {
    const requests: ProfilePictureLookupRequest[] = []
    const scheduler = manualSchedule()
    const batcher = createProfilePictureBatcher(async (request) => {
      requests.push(request)
      return emptyResponse()
    }, scheduler.schedule)

    const results = Promise.all(
      Array.from({ length: MAX_LOOKUP_IDS + 1 }, (_, index) =>
        batcher.load('student', `s${index}`),
      ),
    )
    scheduler.run()
    await results

    expect(requests.map((request) => request.studentIds.length)).toEqual([MAX_LOOKUP_IDS, 1])
  })

  it('resolves to null when the lookup fails', async () => {
    const scheduler = manualSchedule()
    const batcher = createProfilePictureBatcher(async () => {
      throw new Error('endpoint not available')
    }, scheduler.schedule)

    const result = batcher.load('user', 'u1')
    scheduler.run()

    expect(await result).toBeNull()
  })

  it('starts a new batch after a flush', async () => {
    const requests: ProfilePictureLookupRequest[] = []
    const scheduler = manualSchedule()
    const batcher = createProfilePictureBatcher(async (request) => {
      requests.push(request)
      return emptyResponse()
    }, scheduler.schedule)

    const first = batcher.load('user', 'u1')
    scheduler.run()
    await first
    const second = batcher.load('user', 'u2')
    scheduler.run()
    await second

    expect(requests.map((request) => request.userIds)).toEqual([['u1'], ['u2']])
  })
})
