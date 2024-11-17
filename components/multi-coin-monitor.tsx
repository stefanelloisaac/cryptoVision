"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlayCircle, StopCircle, Trash2 } from "lucide-react";
import { MultiCoinSelector } from "./multi-coin-selector";
import { MultiCoinChart } from "./multi-coin-chart";

export function MultiCoinMonitor() {
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  const [priceData, setPriceData] = useState<Record<string, any[]>>({});
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [wsConnections, setWsConnections] = useState<Record<string, WebSocket>>({});

  const startMonitoring = () => {
    const newConnections: Record<string, WebSocket> = {};
    
    selectedCoins.forEach((symbol) => {
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.e === "trade") {
          setPriceData((prev) => ({
            ...prev,
            [symbol]: [
              ...(prev[symbol] || []),
              {
                time: data.T,
                price: parseFloat(data.p),
              },
            ],
          }));
        }
      };

      newConnections[symbol] = ws;
    });

    setWsConnections(newConnections);
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    Object.values(wsConnections).forEach((ws) => ws.close());
    setWsConnections({});
    setIsMonitoring(false);
  };

  const clearData = () => {
    setPriceData({});
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <MultiCoinSelector
          selectedCoins={selectedCoins}
          onChange={setSelectedCoins}
          disabled={isMonitoring}
        />
        <div className="flex items-center gap-2">
          {!isMonitoring ? (
            <Button
              onClick={startMonitoring}
              className="bg-green-600 hover:bg-green-700"
              disabled={selectedCoins.length === 0}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Monitoring
            </Button>
          ) : (
            <Button onClick={stopMonitoring} variant="destructive">
              <StopCircle className="mr-2 h-4 w-4" />
              Stop Monitoring
            </Button>
          )}
          <Button
            onClick={clearData}
            variant="outline"
            disabled={Object.keys(priceData).length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {selectedCoins.map((symbol) => (
          <Card key={symbol} className="p-4">
            <MultiCoinChart
              symbol={symbol}
              data={priceData[symbol] || []}
              isMonitoring={isMonitoring}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}