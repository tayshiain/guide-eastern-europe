const FRANKFURTER_SUPPORTED = new Set(["HUF", "PLN", "CZK"]);

const toIsoDate = (date) => date.toISOString().slice(0, 10);

const fetchFxSeries = async (currencyCode) => {
  if (!FRANKFURTER_SUPPORTED.has(currencyCode)) return null;

  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);

  const url = `https://api.frankfurter.dev/v1/${toIsoDate(start)}..${toIsoDate(end)}?from=EUR&to=${currencyCode}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = await res.json();

  const dates = Object.keys(data.rates || {}).sort();
  const rates = dates
    .map((date) => data.rates[date]?.[currencyCode])
    .filter((rate) => typeof rate === "number");

  if (!rates.length) return null;
  return { dates, rates };
};

const buildSparklinePoints = (rates, width = 220, height = 54, padding = 4) => {
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const range = max - min || 1;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const count = rates.length;

  return rates
    .map((rate, i) => {
      const x = padding + (count > 1 ? (i / (count - 1)) * innerWidth : innerWidth / 2);
      const y = padding + innerHeight - ((rate - min) / range) * innerHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};

const summarizeFxTrend = (rates) => {
  const first = rates[0];
  const last = rates[rates.length - 1];
  const changePct = ((last - first) / first) * 100;
  return {
    last,
    changePct,
    up: changePct >= 0,
  };
};
