export interface NavigationNeighbors<T> {
  previous?: T
  next?: T
  /** 1-based position of the current participant in `participants`. */
  position?: number
}

/**
 * Resolves the participants before and after `currentId`. The first participant has no previous
 * and the last no next one. Returns nothing when the id is not part of `participants`.
 */
export const getNavigationNeighbors = <T extends { courseParticipationID: string }>(
  participants: T[],
  currentId: string | undefined,
): NavigationNeighbors<T> => {
  const currentIndex = currentId
    ? participants.findIndex((p) => p.courseParticipationID === currentId)
    : -1
  if (currentIndex === -1) {
    return {}
  }

  return {
    previous: participants[currentIndex - 1],
    next: participants[currentIndex + 1],
    position: currentIndex + 1,
  }
}
