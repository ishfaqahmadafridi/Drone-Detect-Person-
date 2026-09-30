"use client";

import React from "react";
import { AvionicsQuickPillsProps } from "@/types";
import { AerialAvionicsPills, GroundPerimeterPills } from "./pills";

export const AvionicsQuickPills: React.FC<AvionicsQuickPillsProps> = ({
  avionics,
  viewMode = "aerial",
}) => {
  if (viewMode === "ground") {
    return <GroundPerimeterPills />;
  }

  return <AerialAvionicsPills avionics={avionics} />;
};

export default AvionicsQuickPills;
export * from "./pills";
