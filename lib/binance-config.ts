import { format } from "date-fns";

export interface KlineData {
  time: number;
  price: number;
  volume: number;
}

export interface OrderBookData {
  bids: Array<{ price: number; quantity: number }>;
  asks: Array<{ price: number; quantity: number }>;
}

export type WebSocketMessageHandler = (data: any) => void;

export class BinanceWebSocket {
  private ws: WebSocket | null = null;
  private baseUrl = "wss://stream.binance.com:9443/ws";

  constructor(private onMessage: WebSocketMessageHandler) {}

  connect(symbol: string) {
    if (this.ws) {
      this.ws.close();
    }

    const streams = [
      `${symbol.toLowerCase()}@kline_1m`,
      `${symbol.toLowerCase()}@depth20@100ms`,
    ];
    
    const wsUrl = `${this.baseUrl}/${streams.join("/")}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.onMessage(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}