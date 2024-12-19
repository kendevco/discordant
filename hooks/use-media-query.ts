"use client";

import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    
    return () => media.removeEventListener("change", listener);
  }, [query]); // Only re-run if query changes

  return matches;
}

