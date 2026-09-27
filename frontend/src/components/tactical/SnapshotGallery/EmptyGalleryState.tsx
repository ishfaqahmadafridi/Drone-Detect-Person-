import React from "react";

export const EmptyGalleryState: React.FC = () => {
  return (
    <div className="w-full text-center py-6 text-xs text-slate-500 font-mono-code">
      No incident snapshots recorded yet. Automated frames will appear here upon intrusion or gathering alert.
    </div>
  );
};
