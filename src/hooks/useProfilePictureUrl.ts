import { skipToken, useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@tumaet/prompt-shared-state'
import {
  createProfilePictureBatcher,
  type ProfilePictureIdKind,
  type ProfilePictureLookupResponse,
} from '@/lib/profilePictureBatcher'

/** Identifies whose picture to show; any id kind core knows the person by works. */
export interface ProfilePictureRef {
  kind: ProfilePictureIdKind
  id: string
}

// Core presigns the URLs for an hour; dropping them earlier keeps every cached URL valid.
const URL_CACHE_MS = 50 * 60 * 1000

const batcher = createProfilePictureBatcher(async (request) => {
  const response = await axiosInstance.post<ProfilePictureLookupResponse>(
    '/api/profile-pictures/lookup',
    request,
  )
  return response.data
})

/** Query keys of the cached picture URLs, e.g. to refetch them after an upload. */
export const profilePictureQueryKeys = {
  all: ['profilePicture'] as const,
  of: (ref: ProfilePictureRef) => ['profilePicture', ref.kind, ref.id] as const,
}

/**
 * Resolves the presigned URL of a profile picture, or null if the person has none. Lookups made
 * in the same render are sent as a single request.
 */
export const useProfilePictureUrl = (ref?: ProfilePictureRef): string | null => {
  const { data } = useQuery({
    queryKey: ref ? profilePictureQueryKeys.of(ref) : profilePictureQueryKeys.all,
    queryFn: ref ? () => batcher.load(ref.kind, ref.id) : skipToken,
    staleTime: URL_CACHE_MS,
    gcTime: URL_CACHE_MS,
    // A failed lookup is retried once and not cached, so an outage does not hide pictures for
    // the whole cache time; meanwhile the avatar shows initials
    retry: 1,
  })
  return data ?? null
}
