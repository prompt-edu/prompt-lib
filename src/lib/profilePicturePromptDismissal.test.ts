import { describe, expect, it } from 'vitest'
import {
  dismissProfilePicturePrompt,
  isProfilePicturePromptDismissed,
} from './profilePicturePromptDismissal'

const memoryStorage = () => {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value)
    },
  }
}

const throwingStorage = {
  getItem: (): string | null => {
    throw new Error('storage blocked')
  },
  setItem: () => {
    throw new Error('storage blocked')
  },
}

describe('profile picture prompt dismissal', () => {
  it('remembers a dismissal per key', () => {
    const storage = memoryStorage()

    dismissProfilePicturePrompt('phase-1', storage)

    expect(isProfilePicturePromptDismissed('phase-1', storage)).toBe(true)
    expect(isProfilePicturePromptDismissed('phase-2', storage)).toBe(false)
  })

  it('treats missing or blocked storage as not dismissed', () => {
    expect(isProfilePicturePromptDismissed('phase-1', undefined)).toBe(false)
    expect(() => dismissProfilePicturePrompt('phase-1', throwingStorage)).not.toThrow()
    expect(isProfilePicturePromptDismissed('phase-1', throwingStorage)).toBe(false)
  })
})
