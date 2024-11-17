"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface MarketStatsProps {
  symbol: string;
}

interface Stats {
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
  high: string;
  low: string;
}

export function MarketStats({ symbol }: MarketStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
        );
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (!stats) return <div>Loading...</div>;

  const isPositive = parseFloat(stats.priceChange) >= 0;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Market Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Price"
          value={`$${parseFloat(stats.lastPrice).toLocaleString()}`}
          subtitle={
            <span className={isPositive ? "text-green-500" : "text-red-500"}>
              {isPositive ? <ArrowUpIcon className="inline h-4 w-4" /> : <ArrowDownIcon className="inline h-4 w-4" />}
              ${Math.abs(parseFloat(stats.priceChange)).toLocaleString()} ({stats.priceChangePercent}%)
            </span>
          }
        />
        <StatCard
          title="24h Volume"
          value={parseFloat(stats.volume).toLocaleString()}
        />
        <StatCard
          title="24h Range"
          value={`$${parseFloat(stats.low).toLocaleString()} - $${parseFloat(stats.high).toLocaleString()}`}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle?: React.ReactNode }) {
  return (
    <Card className="p-4 space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-sm">{subtitle}</p>}
    </Card>
  );
}