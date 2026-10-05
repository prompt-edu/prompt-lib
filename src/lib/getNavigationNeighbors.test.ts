import { describe, expect, it } from 'vitest'
import { getNavigationNeighbors } from './getNavigationNeighbors'

describe('getNavigationNeighbors', () => {
  const a = { courseParticipationID: 'a' }
  const b = { courseParticipationID: 'b' }
  const c = { courseParticipationID: 'c' }
  const participants = [a, b, c]

  it('returns the adjacent participants in the middle of the order', () => {
    expect(getNavigationNeighbors(participants, 'b')).toEqual({
      previous: a,
      next: c,
      position: 2,
    })
  })

  it('stops at both ends', () => {
    expect(getNavigationNeighbors(participants, 'a')).toEqual({
      previous: undefined,
      next: b,
      position: 1,
    })
    expect(getNavigationNeighbors(participants, 'c')).toEqual({
      previous: b,
      next: undefined,
      position: 3,
    })
  })

  it('returns nothing for an unknown or missing id', () => {
    expect(getNavigationNeighbors(participants, 'x')).toEqual({})
    expect(getNavigationNeighbors(participants, undefined)).toEqual({})
  })
})
