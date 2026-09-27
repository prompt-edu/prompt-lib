import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { PROFILE_PICTURE_URL_CACHE_MS, profilePictureQueryKeys } from '@/hooks/useProfilePictureUrl'
import { profilePictureApi } from '@/lib/profilePictureApi'

/** The logged-in user's own picture, or null if they have none. */
export const useOwnProfilePicture = () =>
  useQuery({
    queryKey: profilePictureQueryKeys.own,
    queryFn: profilePictureApi.own,
    staleTime: PROFILE_PICTURE_URL_CACHE_MS,
  })

// The user also appears in lists through the batched lookup, so every cached picture of theirs
// is refreshed along with the own one
const useInvalidateProfilePictures = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: profilePictureQueryKeys.all })
}

/** Uploads a cropped JPEG as the logged-in user's picture, replacing the previous one. */
export const useUploadProfilePicture = () => {
  const { toast } = useToast()
  const invalidate = useInvalidateProfilePictures()

  return useMutation({
    mutationFn: async (picture: Blob) => {
      const { uploadUrl, storageKey } = await profilePictureApi.presignUpload()
      await profilePictureApi.uploadToStorage(uploadUrl, picture)
      return profilePictureApi.completeUpload(storageKey)
    },
    onSuccess: () => {
      invalidate()
      toast({ title: 'Profile picture saved' })
    },
    onError: () => {
      toast({
        title: 'Failed to save profile picture',
        description: 'Please try again later',
        variant: 'destructive',
      })
    },
  })
}

/** Removes the logged-in user's picture. */
export const useDeleteProfilePicture = () => {
  const { toast } = useToast()
  const invalidate = useInvalidateProfilePictures()

  return useMutation({
    mutationFn: profilePictureApi.removeOwn,
    onSuccess: () => {
      invalidate()
      toast({ title: 'Profile picture removed' })
    },
    onError: () => {
      toast({
        title: 'Failed to remove profile picture',
        description: 'Please try again later',
        variant: 'destructive',
      })
    },
  })
}
