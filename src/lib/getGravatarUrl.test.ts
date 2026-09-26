import { describe, expect, it } from 'vitest'
import { getGravatarUrl } from './getGravatarUrl'

describe('getGravatarUrl', () => {
  it('returns no URL, so avatars fall back to initials and no email hash leaves PROMPT', () => {
    expect(getGravatarUrl('someone@tum.de')).toBe('')
    expect(getGravatarUrl('someone@tum.de', 64)).toBe('')
  })
})
