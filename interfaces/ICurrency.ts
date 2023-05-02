export interface ICurrency {
  id: number | null;
  name: string;
  code: string;
  symbol: string;
}

export const DEFAULT_CURRENCY = {
  id: null,
  name: "US dollar",
  code: "USD",
  symbol: "$",
} as ICurrency;
