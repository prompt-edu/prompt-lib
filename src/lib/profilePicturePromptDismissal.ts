type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>

const storageKeyOf = (dismissKey: string) => `prompt.profilePicturePrompt.dismissed.${dismissKey}`

// localStorage can be missing (server rendering, tests) or throw (blocked in private mode); the
// prompt then simply shows again next time
const browserStorage = (): KeyValueStorage | undefined => {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage
  } catch {
    return undefined
  }
}

/** Whether an optional upload prompt was dismissed under this key in this browser. */
export const isProfilePicturePromptDismissed = (
  dismissKey: string,
  storage: KeyValueStorage | undefined = browserStorage(),
): boolean => {
  try {
    return storage?.getItem(storageKeyOf(dismissKey)) === 'true'
  } catch {
    return false
  }
}

/** Remembers in this browser that the optional upload prompt under this key was dismissed. */
export const dismissProfilePicturePrompt = (
  dismissKey: string,
  storage: KeyValueStorage | undefined = browserStorage(),
): void => {
  try {
    storage?.setItem(storageKeyOf(dismissKey), 'true')
  } catch {
    // Not remembered; the prompt shows again on the next visit
  }
}
