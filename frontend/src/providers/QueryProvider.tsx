"use client";

import React from "react";
import type { ChildrenProps } from "@/types";
import { useQueryClientInstance } from "@/hooks/useQueryClientInstance";
import { QueryClientProvider } from "@tanstack/react-query";

export const QueryProvider: React.FC<ChildrenProps> = ({ children }) => {
  const queryClient = useQueryClientInstance();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
