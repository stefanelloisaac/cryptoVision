"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface MultiCoinChartProps {
  data: Array<{
    time: number;
    price: number;
  }>;
  symbol: string;
  isMonitoring: boolean;
}

export function MultiCoinChart({ data, symbol, isMonitoring }: MultiCoinChartProps) {
  const formatXAxis = (time: number) => {
    if (data.length > 0) {
      if (time === data[0].time || time === data[data.length - 1].time) {
        return format(time, "HH:mm:ss");
      }
    }
    return "";
  };

  const formatYAxis = (value: number) => {
    if (data.length > 0) {
      const min = Math.min(...data.map(d => d.price));
      const max = Math.max(...data.map(d => d.price));
      if (value === min || value === max) {
        return `$${value.toLocaleString()}`;
      }
    }
    return "";
  };

  const getPriceStats = () => {
    if (data.length === 0) return null;
    
    const prices = data.map(d => d.price);
    const currentPrice = prices[prices.length - 1];
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);
    const priceChange = currentPrice - prices[0];
    const priceChangePercent = ((priceChange / prices[0]) * 100).toFixed(2);

    return {
      currentPrice,
      lowestPrice,
      highestPrice,
      priceChange,
      priceChangePercent
    };
  };

  const stats = getPriceStats();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{symbol}</h2>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${
            isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`} />
          <span className="text-sm text-muted-foreground">
            {data.length} points
          </span>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-2">
            <p className="text-xs text-muted-foreground">Current Price</p>
            <p className="text-sm font-bold">${stats.currentPrice.toLocaleString()}</p>
            <p className={`text-xs ${Number(stats.priceChangePercent) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Number(stats.priceChangePercent) >= 0 ? (
                <ArrowUp className="inline h-3 w-3" />
              ) : (
                <ArrowDown className="inline h-3 w-3" />
              )}
              {stats.priceChangePercent}%
            </p>
          </Card>
          <Card className="p-2">
            <p className="text-xs text-muted-foreground">Lowest Price</p>
            <p className="text-sm font-bold">${stats.lowestPrice.toLocaleString()}</p>
          </Card>
          <Card className="p-2">
            <p className="text-xs text-muted-foreground">Highest Price</p>
            <p className="text-sm font-bold">${stats.highestPrice.toLocaleString()}</p>
          </Card>
        </div>
      )}

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tickFormatter={formatXAxis}
              interval="preserveStartEnd"
              height={20}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={formatYAxis}
              interval="preserveStartEnd"
              width={60}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium text-xs">Time:</span>
                        <span className="text-xs">{format(payload[0].payload.time, "HH:mm:ss")}</span>
                        <span className="font-medium text-xs">Price:</span>
                        <span className="text-xs">${payload[0].value?.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              fill={`url(#color${symbol})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}