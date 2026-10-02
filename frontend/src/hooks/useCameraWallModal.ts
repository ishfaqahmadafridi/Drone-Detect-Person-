import { useState } from "react";
import { UseCameraWallModalProps, UseCameraWallModalReturn } from "@/types";

export const useCameraWallModal = ({
  onSetLayout,
  onClose,
  onConnectRtsp,
}: UseCameraWallModalProps): UseCameraWallModalReturn => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleLaunchSplit = (mode: "dual" | "quad") => {
    if (onSetLayout) onSetLayout(mode);
    onClose();
  };

  const handleConnectWizard = (url: string) => {
    setIsWizardOpen(false);
    if (onConnectRtsp) onConnectRtsp(url);
  };

  return {
    isWizardOpen,
    setIsWizardOpen,
    handleLaunchSplit,
    handleConnectWizard,
  };
};

export default useCameraWallModal;
