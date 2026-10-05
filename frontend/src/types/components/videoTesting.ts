import type { ChangeEvent, RefObject } from "react";

export interface VideoUploadControlsProps {
  inputRef: RefObject<HTMLInputElement | null>;
  pending: boolean;
  progress: number;
  message: string;
  error: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
