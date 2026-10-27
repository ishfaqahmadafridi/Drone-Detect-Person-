import type { CSSProperties } from "react";
import type { Detection, FrozenSelection } from "@/types";

/** Match overlay coordinates to the same frozen frame used for selection. */
export function suspectBoxStyle(
  person: Detection,
  snapshot: Pick<FrozenSelection, "width" | "height">,
): CSSProperties {
  return {
    left: `${(person.bbox[0] / snapshot.width) * 100}%`,
    top: `${(person.bbox[1] / snapshot.height) * 100}%`,
    width: `${((person.bbox[2] - person.bbox[0]) / snapshot.width) * 100}%`,
    height: `${((person.bbox[3] - person.bbox[1]) / snapshot.height) * 100}%`,
  };
}
