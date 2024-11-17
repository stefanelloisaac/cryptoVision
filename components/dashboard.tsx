"use client";

import { useEffect, useState } from "react";
import { CryptoSelector } from "./crypto-selector";
import { PriceChart } from "./price-chart";
import { VolumeChart } from "./volume-chart";
import { OrderBook } from "./order-book";
import { MarketStats } from "./market-stats";
import { QuickStats } from "./quick-stats";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, StopCircle, Trash2 } from "lucide-react";

const DEFAULT_SYMBOL = "BTCUSDT";

export function Dashboard() {
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
  const [priceData, setPriceData] = useState<any[]>([]);
  const [orderBook, setOrderBook] = useState<any>({ bids: [], asks: [] });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const startMonitoring = () => {
    const newWs = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade/${symbol.toLowerCase()}@depth`);
    
    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.e === "trade") {
        setPriceData((prev) => [...prev, {
          time: data.T,
          price: parseFloat(data.p),
          volume: parseFloat(data.q)
        }]);
      }
      
      if (data.e === "depthUpdate") {
        setOrderBook({
          bids: data.b.slice(0, 10).map(([price, qty]: string[]) => ({
            price: parseFloat(price),
            quantity: parseFloat(qty)
          })),
          asks: data.a.slice(0, 10).map(([price, qty]: string[]) => ({
            price: parseFloat(price),
            quantity: parseFloat(qty)
          }))
        });
      }
    };

    setWs(newWs);
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    if (ws) {
      ws.close();
      setWs(null);
    }
    setIsMonitoring(false);
  };

  const clearData = () => {
    setPriceData([]);
    setOrderBook({ bids: [], asks: [] });
  };

  useEffect(() => {
    if (isMonitoring) {
      stopMonitoring();
      startMonitoring();
    }
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [symbol]);

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <CryptoSelector value={symbol} onChange={setSymbol} />
          <div className="flex items-center gap-2">
            {!isMonitoring ? (
              <Button
                onClick={startMonitoring}
                className="bg-green-600 hover:bg-green-700"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Start Monitoring
              </Button>
            ) : (
              <Button
                onClick={stopMonitoring}
                variant="destructive"
              >
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Monitoring
              </Button>
            )}
            <Button
              onClick={clearData}
              variant="outline"
              disabled={priceData.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Data
            </Button>
          </div>
        </div>
      </div>

      <QuickStats symbol={symbol} priceData={priceData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <PriceChart 
            data={priceData} 
            symbol={symbol} 
            isMonitoring={isMonitoring}
          />
        </Card>
        
        <Card className="p-6">
          <VolumeChart 
            data={priceData} 
            symbol={symbol}
          />
        </Card>

        <Card className="p-6">
          <OrderBook data={orderBook} symbol={symbol} />
        </Card>

        <Card className="p-6">
          <MarketStats symbol={symbol} />
        </Card>
      </div>
    </div>
  );
}