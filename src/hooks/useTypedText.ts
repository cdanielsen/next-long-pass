import { useEffect, useState } from "react";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Reveals `text` one character every `delay` ms ("typewriter" effect).
 * Shows the full text immediately when the user prefers reduced motion.
 *
 * The animation runs once per mount: render the consumer with `key={text}`
 * to restart it when the text changes.
 */
export const useTypedText = (text: string, delay = 40): string => {
  const [count, setCount] = useState(() =>
    prefersReducedMotion() ? text.length : 0,
  );

  useEffect(() => {
    if (count >= text.length) return;
    const timeout = setTimeout(() => {
      setCount((c) => c + 1);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [count, text.length, delay]);

  return text.slice(0, count);
};
