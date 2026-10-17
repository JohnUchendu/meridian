export type TickerItem = { symbol: string; name: string; price: number; change: number };
export const ticker: TickerItem[] = [
  { symbol: "EUR/USD", name: "Euro / US Dollar", price: 1.0864, change: 0.24 },
  { symbol: "GBP/USD", name: "Pound / US Dollar", price: 1.2712, change: -0.13 },
  { symbol: "USD/JPY", name: "US Dollar / Yen", price: 156.42, change: 0.31 },
  { symbol: "AUD/USD", name: "Aussie / US Dollar", price: 0.6614, change: -0.08 },
  { symbol: "USD/CAD", name: "US Dollar / CAD", price: 1.3671, change: 0.11 },
  { symbol: "XAU/USD", name: "Gold Spot", price: 2384.12, change: 0.72 },
  { symbol: "XAG/USD", name: "Silver Spot", price: 30.44, change: 1.42 },
  { symbol: "BTC/USD", name: "Bitcoin", price: 68421.5, change: 2.14 },
  { symbol: "ETH/USD", name: "Ethereum", price: 3814.22, change: 1.62 },
  { symbol: "NAS100", name: "NASDAQ 100", price: 19842.4, change: 0.44 },
  { symbol: "SPX500", name: "S&P 500", price: 5487.11, change: 0.18 },
  { symbol: "US30", name: "Dow Jones", price: 39218.6, change: -0.09 },
  { symbol: "WTI", name: "Crude Oil", price: 82.17, change: -0.62 },
];
export const equityCurve = Array.from({ length: 40 }, (_, i) => {
  const base = 10000;
  const drift = i * 220;
  const noise = Math.sin(i / 3) * 900 + Math.cos(i / 5) * 500;
  return { day: `D${i + 1}`, value: Math.round(base + drift + noise) };
});
export const allocation = [
  { name: "Stocks", value: 38 },
  { name: "Crypto", value: 24 },
  { name: "Commodities", value: 18 },
  { name: "Indices", value: 12 },
  { name: "ETFs", value: 8 },
];
export const revenueSeries = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  revenue: 400000 + i * 42000 + (i % 3) * 30000,
  volume: 12000000 + i * 900000,
}));
