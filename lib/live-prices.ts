export type LivePrice = {
  key: "gold" | "spx" | "btc";
  label: string;
  symbol: string;
  price: number;
  changePercent: number;
  live: boolean;
};

export type LivePriceSnapshot = {
  prices: LivePrice[];
  updatedAt: string;
  live: boolean;
};

const YAHOO_CHART = "https://query1.finance.yahoo.com/v8/finance/chart/";

const DEFINITIONS: Omit<LivePrice, "price" | "changePercent" | "live">[] = [
  { key: "gold", label: "Gold", symbol: "GC=F" },
  { key: "spx", label: "S&P 500", symbol: "^GSPC" },
  { key: "btc", label: "BTC", symbol: "BTC-USD" },
];

// Last-resort values so the hero never renders blank cards if the market data
// provider is unreachable. They are replaced by live quotes on the next poll.
const FALLBACK: Record<LivePrice["key"], LivePrice> = {
  gold: { key: "gold", label: "Gold", symbol: "GC=F", price: 4181.1, changePercent: 0.26, live: false },
  spx: { key: "spx", label: "S&P 500", symbol: "^GSPC", price: 7659.44, changePercent: -1.09, live: false },
  btc: { key: "btc", label: "BTC", symbol: "BTC-USD", price: 81383.28, changePercent: 0.17, live: false },
};

type YahooMeta = {
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  chartPreviousClose?: number;
  previousClose?: number;
  regularMarketTime?: number;
};

async function fetchQuote(definition: (typeof DEFINITIONS)[number]): Promise<LivePrice> {
  const fallback = FALLBACK[definition.key];

  try {
    const response = await fetch(
      `${YAHOO_CHART}${encodeURIComponent(definition.symbol)}?interval=1m&range=1d`,
      {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; MeridianCapital/1.0)" },
        next: { revalidate: 30 },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!response.ok) return fallback;

    const payload = (await response.json()) as {
      chart?: { result?: { meta?: YahooMeta }[] };
    };
    const meta = payload.chart?.result?.[0]?.meta;
    if (!meta || typeof meta.regularMarketPrice !== "number") return fallback;

    const price = meta.regularMarketPrice;
    const previous = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const changePercent =
      typeof meta.regularMarketChangePercent === "number"
        ? meta.regularMarketChangePercent
        : previous > 0
          ? ((price - previous) / previous) * 100
          : 0;

    return { ...definition, price, changePercent, live: true };
  } catch {
    return fallback;
  }
}

export async function getLivePrices(): Promise<LivePriceSnapshot> {
  const prices = await Promise.all(DEFINITIONS.map(fetchQuote));

  return {
    prices,
    updatedAt: new Date().toISOString(),
    live: prices.some((price) => price.live),
  };
}
