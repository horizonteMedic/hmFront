import { useState, useEffect, useMemo } from "react";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export function useTailwindBreakpoints() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const current = useMemo(() => {
    if (width >= breakpoints["2xl"]) return "2xl";
    if (width >= breakpoints.xl) return "xl";
    if (width >= breakpoints.lg) return "lg";
    if (width >= breakpoints.md) return "md";
    if (width >= breakpoints.sm) return "sm";
    return "none";
  }, [width]);

  const flags = useMemo(() => ({
    isSmUp: width >= breakpoints.sm,
    isMdUp: width >= breakpoints.md,
    isLgUp: width >= breakpoints.lg,
    isXlUp: width >= breakpoints.xl,
    is2xlUp: width >= breakpoints["2xl"],
  }), [width]);

  return { width, current, breakpoints, ...flags };
}
