"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

interface VolumeChartProps {
  data: Array<{
    time: number;
    volume: number;
  }>;
  symbol: string;
}

export function VolumeChart({ data, symbol }: VolumeChartProps) {
  const formatXAxis = (time: number) => {
    if (data.length > 0) {
      if (time === data[0].time || time === data[data.length - 1].time) {
        return format(time, "HH:mm:ss");
      }
    }
    return "";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{symbol} Volume</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="time"
              tickFormatter={formatXAxis}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(value) => value.toFixed(2)}
              interval="preserveStartEnd"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium">Time:</span>
                        <span>{format(payload[0].payload.time, "HH:mm:ss")}</span>
                        <span className="font-medium">Volume:</span>
                        <span>{typeof payload[0].value === 'number' ? payload[0].value.toFixed(4) : payload[0].value}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="volume"
              fill="hsl(var(--primary))"
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}