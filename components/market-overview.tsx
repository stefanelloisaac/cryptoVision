"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MarketOverviewProps {
  symbol: string;
}

interface MarketData {
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
  high: string;
  low: string;
}

export function MarketOverview({ symbol }: MarketOverviewProps) {
  const [marketData, setMarketData] = useState<MarketData | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
        );
        const data = await response.json();
        setMarketData({
          lastPrice: data.lastPrice,
          priceChange: data.priceChange,
          priceChangePercent: data.priceChangePercent,
          volume: data.volume,
          high: data.highPrice,
          low: data.lowPrice,
        });
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5000);

    return () => clearInterval(interval);
  }, [symbol]);

  if (!marketData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{symbol} Market Overview</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Last Price</TableCell>
            <TableCell>${parseFloat(marketData.lastPrice).toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>24h Change</TableCell>
            <TableCell
              className={
                parseFloat(marketData.priceChange) >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              ${parseFloat(marketData.priceChange).toFixed(2)} (
              {parseFloat(marketData.priceChangePercent).toFixed(2)}%)
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>24h Volume</TableCell>
            <TableCell>{parseFloat(marketData.volume).toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>24h High</TableCell>
            <TableCell>${parseFloat(marketData.high).toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>24h Low</TableCell>
            <TableCell>${parseFloat(marketData.low).toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}