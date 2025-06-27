export type CurrencyCode = "EUR" | "USD" | "GBP" | "XAF" | "NGN";

export interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  flag: string;
  name: string;
}

export const currencyOptions: CurrencyOption[] = [
  { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro" },
  { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", name: "British Pound" },
  { code: "XAF", symbol: "FCFA", flag: "🇨🇲", name: "CFA Franc" },
  { code: "NGN", symbol: "₦", flag: "🇳🇬", name: "Nigerian Naira" },
];

import React, { createContext, useContext, useEffect, useState } from "react";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  convert: (amountInEur: number) => number;
  format: (amountInEur: number) => string;
}

const defaultCtx: CurrencyContextValue = {
  currency: "EUR",
  setCurrency: () => {},
  convert: (v) => v,
  format: (v) => `€${v.toFixed(2)}`,
};

const CurrencyContext = createContext<CurrencyContextValue>(defaultCtx);

// Default fallback rates relative to EUR in case fetch fails
const fallbackRates: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 1.1,
  GBP: 0.86,
  XAF: 655.957,
  NGN: 930,
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>("EUR");
  const [rates, setRates] =
    useState<Record<CurrencyCode, number>>(fallbackRates);

  // Load saved currency from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("currency_code") as CurrencyCode | null;
    if (saved && currencyOptions.find((c) => c.code === saved)) {
      setCurrency(saved);
    }
  }, []);

  // Persist selection
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currency_code", currency);
    }
  }, [currency]);

  // Fetch real-time rates once on mount
  useEffect(() => {
    fetch(
      "https://api.exchangerate.host/latest?base=EUR&symbols=USD,GBP,XAF,NGN"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setRates((prev) => ({ ...prev, ...data.rates }));
        }
      })
      .catch(() => {
        // keep fallback rates on error
      });
  }, []);

  const convert = (amountInEur: number, to: CurrencyCode = currency) => {
    const rate = rates[to] ?? 1;
    return amountInEur * rate;
  };

  const format = (amountInEur: number, to: CurrencyCode = currency) => {
    const converted = convert(amountInEur, to);
    const option = currencyOptions.find((c) => c.code === to)!;
    // For XAF the symbol is typically after the amount
    if (to === "XAF") {
      return `${converted.toFixed(0)} ${option.symbol}`;
    }
    return `${option.symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
