"use client";

import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { CurrencyProvider } from "@/hooks/use-currency";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </CurrencyProvider>
    </SessionProvider>
  );
}
