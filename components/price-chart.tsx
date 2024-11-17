"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

interface PriceChartProps {
  data: Array<{
    time: number;
    price: number;
    volume: number;
  }>;
  symbol: string;
  isMonitoring: boolean;
}

export function PriceChart({ data, symbol, isMonitoring }: PriceChartProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{symbol} Price</h2>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${
            isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`} />
          <span className="text-sm text-muted-foreground">
            {isMonitoring ? 'Monitoring' : 'Monitoring stopped'}
          </span>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {data.length > 0 && (
          <span>
            Collected {data.length} data points
          </span>
        )}
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time"
              tickFormatter={(time) => format(time, "HH:mm:ss")}
            />
            <YAxis 
              domain={["auto", "auto"]}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium">Time:</span>
                        <span>{format(payload[0].payload.time, "HH:mm:ss")}</span>
                        <span className="font-medium">Price:</span>
                        <span>${payload[0].value?.toLocaleString()}</span>
                        <span className="font-medium">Volume:</span>
                        <span>{payload[0].payload.volume.toLocaleString()}</span>
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
              fill="url(#colorPrice)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}