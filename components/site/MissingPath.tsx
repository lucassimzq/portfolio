"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** The URL that missed. Read on the client only, since the 404 page itself is prerendered. */
export default function MissingPath() {
  const path = useSyncExternalStore(
    noop,
    () => window.location.pathname,
    () => "",
  );
  return <>{path}</>;
}
