"use client";

interface OrderBookProps {
  data: {
    bids: Array<{ price: number; quantity: number }>;
    asks: Array<{ price: number; quantity: number }>;
  };
  symbol: string;
}

export function OrderBook({ data, symbol }: OrderBookProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{symbol} Order Book</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-green-500">Bids</h3>
          <div className="space-y-1">
            {data.bids.map((bid, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-green-500"
              >
                <span>{bid.price.toFixed(2)}</span>
                <span>{bid.quantity.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold text-red-500">Asks</h3>
          <div className="space-y-1">
            {data.asks.map((ask, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-red-500"
              >
                <span>{ask.price.toFixed(2)}</span>
                <span>{ask.quantity.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}