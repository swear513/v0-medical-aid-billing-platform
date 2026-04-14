"use client";

import { useEffect, type ReactNode } from "react";
import { useStore } from "@/lib/store";

export function StoreProvider({ children }: { children: ReactNode }) {
  const initialize = useStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
