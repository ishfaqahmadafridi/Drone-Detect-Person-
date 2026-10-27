import { useState } from "react";

/** Shared local boolean state for atomic controls and visibility. */
export function useToggle(initial = false) {
  return useState(initial);
}
