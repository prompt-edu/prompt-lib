import { type RefObject, useEffect, useRef, useState } from 'react'

/**
 * Reports whether the element has come within `rootMargin` of the viewport. It stays true once
 * seen, so content loaded for it is not dropped again while scrolling.
 */
export const useIsInView = <T extends Element>(
  rootMargin = '200px',
): [RefObject<T | null>, boolean] => {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || isInView) return
    // Without IntersectionObserver (old browsers, tests) everything counts as visible
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [isInView, rootMargin])

  return [ref, isInView]
}
