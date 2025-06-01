
import * as React from "react"

const MOBILE_BREAKPOINT = 768

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

// Enhanced mobile detection for video compatibility
export function useIsRealMobile() {
  const [isRealMobile, setIsRealMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // More comprehensive mobile detection
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    setIsRealMobile(isMobileDevice || (isTouchDevice && window.innerWidth < MOBILE_BREAKPOINT));
  }, [])

  return isRealMobile
}
