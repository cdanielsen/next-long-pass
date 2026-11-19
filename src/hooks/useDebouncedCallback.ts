import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Delay calling `fn` until `delay` ms have passed without another `run`.
 * Each `run` replaces the pending arguments, so only the last call fires.
 * `isPending` is true while a call is waiting. Unmounting cancels it.
 */
export const useDebouncedCallback = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
) => {
  const fnRef = useRef(fn);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const cancel = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPending(false);
  }, []);

  const run = useCallback(
    (...args: Args) => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      setIsPending(true);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        setIsPending(false);
        fnRef.current(...args);
      }, delay);
    },
    [delay],
  );

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    },
    [],
  );

  return { run, cancel, isPending };
};
