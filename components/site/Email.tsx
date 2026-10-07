"use client";

import { useSyncExternalStore } from "react";
import { EMAIL } from "@/lib/data";

const subscribe = () => () => {};

/**
 * The contact address, joined only in the browser so it never appears whole in the
 * prerendered HTML. Empty on the server and during hydration.
 */
export function useEmail() {
  return useSyncExternalStore(subscribe, () => `${EMAIL.user}@${EMAIL.domain}`, () => "");
}
