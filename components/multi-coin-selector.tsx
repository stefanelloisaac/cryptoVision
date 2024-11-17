"use client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

const TRADING_PAIRS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "XRPUSDT",
  "AVAXUSDT",
  "DOTUSDT",
  "MATICUSDT",
];

interface MultiCoinSelectorProps {
  selectedCoins: string[];
  onChange: (coins: string[]) => void;
  disabled?: boolean;
}

export function MultiCoinSelector({ selectedCoins, onChange, disabled }: MultiCoinSelectorProps) {
  const toggleCoin = (coin: string) => {
    if (selectedCoins.includes(coin)) {
      onChange(selectedCoins.filter((c) => c !== coin));
    } else {
      onChange([...selectedCoins, coin]);
    }
  };

  const removeCoin = (coin: string) => {
    onChange(selectedCoins.filter((c) => c !== coin));
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className={cn(
              "w-[200px] justify-between",
              !selectedCoins.length && "text-muted-foreground"
            )}
          >
            Select coins
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search coin..." />
            <CommandEmpty>No coin found.</CommandEmpty>
            <CommandGroup>
              {TRADING_PAIRS.map((pair) => (
                <CommandItem
                  key={pair}
                  onSelect={() => toggleCoin(pair)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCoins.includes(pair)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {pair}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedCoins.map((coin) => (
          <Badge key={coin} variant="secondary">
            {coin}
            <button
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => removeCoin(coin)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}