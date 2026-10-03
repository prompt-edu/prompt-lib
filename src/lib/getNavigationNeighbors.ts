export interface NavigationNeighbors {
  previousId?: string
  nextId?: string
  /** 1-based position of `currentId` in `order`. */
  position?: number
}

export interface NavigationNeighborsOptions {
  /** Continue from the last entry to the first and vice versa. Defaults to `false`. */
  wrapAround?: boolean
}

/**
 * Resolves the ids before and after `currentId` in `order`. Without `wrapAround` the first entry
 * has no previous and the last no next id. Returns nothing when the id is not part of the order.
 */
export const getNavigationNeighbors = (
  order: string[],
  currentId: string | undefined,
  { wrapAround = false }: NavigationNeighborsOptions = {},
): NavigationNeighbors => {
  const currentIndex = currentId ? order.indexOf(currentId) : -1
  if (currentIndex === -1) {
    return {}
  }

  const position = currentIndex + 1
  if (order.length === 1) {
    return { position }
  }

  if (wrapAround) {
    return {
      previousId: order[(currentIndex - 1 + order.length) % order.length],
      nextId: order[(currentIndex + 1) % order.length],
      position,
    }
  }

  return {
    previousId: order[currentIndex - 1],
    nextId: order[currentIndex + 1],
    position,
  }
}
