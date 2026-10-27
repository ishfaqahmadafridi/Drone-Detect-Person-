import type { ChangeEvent, RefObject } from "react";
import type { SuspectFreezeModalProps } from "../videoTesting";

export type FrozenSuspectFrameProps = Pick<
  SuspectFreezeModalProps, "snapshot" | "selectedIds" | "pending" | "onToggle"
>;

export type FrozenSuspectChoicesProps = FrozenSuspectFrameProps;

export type SuspectFreezeActionsProps = Pick<
  SuspectFreezeModalProps, "selectedIds" | "pending" | "onFinish"
>;

export interface VideoUploadControlsProps {
  inputRef: RefObject<HTMLInputElement | null>;
  pending: boolean;
  progress: number;
  message: string;
  error: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
