import { useQuery } from '@tanstack/react-query'
import { profilePictureApi } from '@/lib/profilePictureApi'
import { createProfilePictureBatcher, type ProfilePictureIdKind } from '@/lib/profilePictureBatcher'

/** Identifies whose picture to show; any id kind core knows the person by works. */
export interface ProfilePictureRef {
  kind: ProfilePictureIdKind
  id: string
}

// Core presigns the URLs for an hour; dropping them earlier keeps every cached URL valid.
export const PROFILE_PICTURE_URL_CACHE_MS = 50 * 60 * 1000

const batcher = createProfilePictureBatcher(profilePictureApi.lookup)

/** Query keys of the cached pictures, e.g. to refetch them after an upload. */
export const profilePictureQueryKeys = {
  all: ['profilePicture'] as const,
  own: ['profilePicture', 'own'] as const,
  of: (ref: ProfilePictureRef) => ['profilePicture', ref.kind, ref.id] as const,
}

/**
 * Resolves the presigned URL of a profile picture, or null if the person has none. Lookups made
 * in the same render are sent as a single request.
 */
export const useProfilePictureUrl = (ref?: ProfilePictureRef): string | null => {
  const { data } = useQuery({
    queryKey: ref ? profilePictureQueryKeys.of(ref) : profilePictureQueryKeys.all,
    queryFn: () => (ref ? batcher.load(ref.kind, ref.id) : Promise.resolve(null)),
    enabled: Boolean(ref?.id),
    staleTime: PROFILE_PICTURE_URL_CACHE_MS,
    gcTime: PROFILE_PICTURE_URL_CACHE_MS,
    // A failed lookup is retried once and not cached, so an outage does not hide pictures for
    // the whole cache time; meanwhile the avatar shows initials
    retry: 1,
  })
  return data ?? null
}
