"use client";

import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Activity, TrendingUp, Volume2 } from "lucide-react";

interface QuickStatsProps {
  symbol: string;
  priceData: Array<{
    time: number;
    price: number;
    volume: number;
  }>;
}

export function QuickStats({ symbol, priceData }: QuickStatsProps) {
  const getStats = () => {
    if (priceData.length < 2) return null;

    const prices = priceData.map(d => d.price);
    const volumes = priceData.map(d => d.volume);
    
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const priceChange = lastPrice - firstPrice;
    const priceChangePercent = (priceChange / firstPrice) * 100;
    
    const totalVolume = volumes.reduce((sum, vol) => sum + vol, 0);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const volatility = Math.sqrt(
      prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / prices.length
    );

    return {
      currentPrice: lastPrice,
      priceChange,
      priceChangePercent,
      totalVolume,
      volatility
    };
  };

  const stats = getStats();

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current Price</p>
            <h3 className="text-2xl font-bold">${stats.currentPrice.toLocaleString()}</h3>
          </div>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Price Change</p>
            <h3 className={`text-2xl font-bold ${stats.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.priceChange >= 0 ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />}
              {stats.priceChangePercent.toFixed(2)}%
            </h3>
          </div>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
            <h3 className="text-2xl font-bold">{stats.totalVolume.toFixed(2)}</h3>
          </div>
          <Volume2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Volatility</p>
            <h3 className="text-2xl font-bold">${stats.volatility.toFixed(2)}</h3>
          </div>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
      </Card>
    </div>
  );
}