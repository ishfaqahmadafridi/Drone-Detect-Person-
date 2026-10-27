import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { QUERY_DEFAULTS } from "@/constants/tactical";

export function useQueryClientInstance() {
  return useState(() => new QueryClient({ defaultOptions: { queries: QUERY_DEFAULTS } }))[0];
}
