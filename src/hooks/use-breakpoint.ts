"use client"

import * as React from "react"

// ---------------------------------------------------------------------------
// Shared breakpoint constants
// ---------------------------------------------------------------------------
export const MOBILE_BREAKPOINT = 768

type BreakpointMode = "min" | "max"

// ---------------------------------------------------------------------------
// useIsBreakpoint — generic viewport query
// ---------------------------------------------------------------------------
/**
 * Hook to detect whether the current viewport matches a given breakpoint rule.
 * Example:
 *   useIsBreakpoint("max", 768)   // true when width < 768
 *   useIsBreakpoint("min", 1024)  // true when width >= 1024
 */
export function useIsBreakpoint(
  mode: BreakpointMode = "max",
  breakpoint = 768
) {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const query =
      mode === "min"
        ? `(min-width: ${breakpoint}px)`
        : `(max-width: ${breakpoint - 1}px)`

    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)

    // Set initial value
    setMatches(mql.matches)

    // Add listener
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [mode, breakpoint])

  return !!matches
}

// ---------------------------------------------------------------------------
// useIsMobile — convenience wrapper (max-width: 767px)
// ---------------------------------------------------------------------------
/**
 * Returns true when the viewport width is below the mobile breakpoint (768px).
 * Uses the same matchMedia approach as useIsBreakpoint for consistency.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
