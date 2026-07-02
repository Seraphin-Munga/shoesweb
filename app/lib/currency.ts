const ZAR_RATE = 18.5;

export function getZarRate() {
  return ZAR_RATE;
}

export function toZar(usd: number, rate = ZAR_RATE) {
  return Math.round(usd * rate * 100) / 100;
}

export function fromZar(zar: number, rate = ZAR_RATE) {
  return Math.round((zar / rate) * 100) / 100;
}

export function formatZar(usd: number, rate = ZAR_RATE) {
  const zar = toZar(usd, rate);
  return `R ${zar.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatZarAmount(zar: number) {
  return `R ${zar.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
