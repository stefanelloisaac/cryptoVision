"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CryptoSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const AVAILABLE_PAIRS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "XRPUSDT",
  "DOTUSDT",
  "LINKUSDT",
];

export function CryptoSelector({ value, onChange }: CryptoSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a crypto pair" />
      </SelectTrigger>
      <SelectContent>
        {AVAILABLE_PAIRS.map((pair) => (
          <SelectItem key={pair} value={pair}>
            {pair}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}