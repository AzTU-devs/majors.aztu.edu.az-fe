"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ApiState<T> {
  data: T;
  loading: boolean;
  /** The last load failed (network/API error) — as opposed to returning nothing. */
  error: boolean;
  retry: () => void;
}

/**
 * What the server already loaded for the first `key`: the data, or the fact
 * that the load failed (the section then starts in its error state, and
 * "try again" loads it in the browser).
 */
export type ApiSeed<T> = { data: T } | { error: true };

/**
 * Client-side data loading for the catalogue sections.
 *
 * `key` must change whenever the inputs of `load` change (e.g. the programme
 * key and the locale). A new key aborts the request still in flight, so a slow
 * response for the previous page or language can never overwrite the current
 * one. Failures surface as `error` instead of collapsing into an empty list.
 *
 * With `seed`, the first render uses the server's answer for the initial key
 * and nothing is requested until the key changes or `retry` is called — the
 * content is in the server-rendered HTML instead of behind a loading state.
 */
export function useApi<T>(
  key: string,
  load: (signal: AbortSignal) => Promise<T>,
  initial: T,
  seed?: ApiSeed<T>
): ApiState<T> {
  // Always call the latest closure without making it an effect dependency.
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  });

  // The key the seed belongs to; cleared once anything else is loaded.
  const seededKey = useRef<string | null>(seed ? key : null);

  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ data: T; loading: boolean; error: boolean }>(() => {
    if (!seed) return { data: initial, loading: true, error: false };
    return "error" in seed
      ? { data: initial, loading: false, error: true }
      : { data: seed.data, loading: false, error: false };
  });

  useEffect(() => {
    if (attempt === 0 && seededKey.current === key) return;
    seededKey.current = null;

    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: false }));
    loadRef.current(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setState({ data, loading: false, error: false });
      },
      () => {
        if (!controller.signal.aborted) setState((s) => ({ ...s, loading: false, error: true }));
      }
    );
    return () => controller.abort();
  }, [key, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
