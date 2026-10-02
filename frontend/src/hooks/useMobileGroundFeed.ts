import { useState } from "react";
import { UseMobileGroundFeedProps, UseMobileGroundFeedReturn } from "@/types";

export const useMobileGroundFeed = ({
  onConnectRtsp,
  onSelectFeed,
}: UseMobileGroundFeedProps): UseMobileGroundFeedReturn => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleConnect = (url: string) => {
    setIsModalOpen(false);
    if (onConnectRtsp) {
      onConnectRtsp(url);
    }
  };

  const handlePromote = () => {
    if (onSelectFeed) {
      onSelectFeed("rtsp", "ground");
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    handleConnect,
    handlePromote,
  };
};

export default useMobileGroundFeed;
