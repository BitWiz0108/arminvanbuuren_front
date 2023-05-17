import { DEFAULT_CURRENCY, ICurrency } from "@/interfaces/ICurrency";
import { PLACEHOLDER_IMAGE } from "@/libs/constants";

export interface IPlan {
  id: number | null;
  coverImage: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  currencyId: number | null;
  currency: ICurrency;
}

export const DEFAULT_PLAN = {
  id: null,
  coverImage: PLACEHOLDER_IMAGE,
  name: "",
  description: "",
  price: 0,
  duration: 0,
  currencyId: null,
  currency: DEFAULT_CURRENCY,
} as IPlan;
