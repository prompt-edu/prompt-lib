import { axiosInstance } from '@tumaet/prompt-shared-state'
import type {
  ProfilePictureLookupRequest,
  ProfilePictureLookupResponse,
} from '@/lib/profilePictureBatcher'

/** The logged-in user's own picture. */
export interface OwnProfilePicture {
  url: string
  updatedAt: string
}

interface PresignedProfilePictureUpload {
  uploadUrl: string
  storageKey: string
}

const basePath = '/api/profile-pictures'
const ownPath = `${basePath}/me`
const NOT_FOUND = 404

// axios is only a dependency of prompt-shared-state, so its errors are recognized by shape
const hasStatus = (error: unknown, status: number): boolean =>
  (error as { response?: { status?: number } } | null)?.response?.status === status

/** The profile picture endpoints of core, shared by every phase through the lib. */
export const profilePictureApi = {
  lookup: async (request: ProfilePictureLookupRequest): Promise<ProfilePictureLookupResponse> =>
    (await axiosInstance.post<ProfilePictureLookupResponse>(`${basePath}/lookup`, request)).data,

  // Having no picture is the normal case, so the 404 answers null instead of failing
  own: async (): Promise<OwnProfilePicture | null> => {
    try {
      return (await axiosInstance.get<OwnProfilePicture>(ownPath)).data
    } catch (error) {
      if (hasStatus(error, NOT_FOUND)) {
        return null
      }
      throw error
    }
  },

  presignUpload: async (): Promise<PresignedProfilePictureUpload> =>
    (await axiosInstance.post<PresignedProfilePictureUpload>(`${ownPath}/presign`)).data,

  // The presigned URL points at the object storage, not at core, so it must not carry the
  // Keycloak token the shared axios instance adds
  uploadToStorage: async (uploadUrl: string, picture: Blob): Promise<void> => {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: picture,
      headers: { 'Content-Type': 'image/jpeg' },
    })
    if (!response.ok) {
      throw new Error(`Uploading the picture failed with status ${response.status}`)
    }
  },

  completeUpload: async (storageKey: string): Promise<OwnProfilePicture> =>
    (await axiosInstance.post<OwnProfilePicture>(`${ownPath}/complete`, { storageKey })).data,

  removeOwn: async (): Promise<void> => {
    await axiosInstance.delete(ownPath)
  },
}
