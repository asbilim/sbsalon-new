"use client";
import { useCurrency } from "@/hooks/use-currency";

export function Price({ amount }: { amount: number | string }) {
  const { format } = useCurrency();
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(value)) return <span>{amount}</span>;
  return <span>{format(value)}</span>;
}
