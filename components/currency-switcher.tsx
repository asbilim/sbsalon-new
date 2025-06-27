"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currencyOptions, useCurrency } from "@/hooks/use-currency";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const active = currencyOptions.find((c) => c.code === currency)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 px-2 flex items-center gap-1">
          <span>{active.flag}</span>
          <span className="sr-only">Select currency</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencyOptions.map((opt) => (
          <DropdownMenuItem
            key={opt.code}
            onSelect={() => setCurrency(opt.code)}
            className="flex items-center gap-2">
            <span>{opt.flag}</span>
            <span>{opt.code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
