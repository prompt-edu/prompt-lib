import { describe, expect, it } from 'vitest'
import { getNavigationNeighbors } from './getNavigationNeighbors'

describe('getNavigationNeighbors', () => {
  const order = ['a', 'b', 'c']

  it('returns the adjacent ids in the middle of the order', () => {
    expect(getNavigationNeighbors(order, 'b')).toEqual({
      previousId: 'a',
      nextId: 'c',
      position: 2,
    })
  })

  it('stops at both ends by default', () => {
    expect(getNavigationNeighbors(order, 'a')).toEqual({
      previousId: undefined,
      nextId: 'b',
      position: 1,
    })
    expect(getNavigationNeighbors(order, 'c')).toEqual({
      previousId: 'b',
      nextId: undefined,
      position: 3,
    })
  })

  it('wraps around at both ends when asked to', () => {
    expect(getNavigationNeighbors(order, 'a', { wrapAround: true })).toEqual({
      previousId: 'c',
      nextId: 'b',
      position: 1,
    })
    expect(getNavigationNeighbors(order, 'c', { wrapAround: true })).toEqual({
      previousId: 'b',
      nextId: 'a',
      position: 3,
    })
  })

  it('never points a single entry at itself', () => {
    expect(getNavigationNeighbors(['a'], 'a', { wrapAround: true })).toEqual({ position: 1 })
  })

  it('returns nothing for an unknown or missing id', () => {
    expect(getNavigationNeighbors(order, 'x')).toEqual({})
    expect(getNavigationNeighbors(order, undefined)).toEqual({})
  })
})
