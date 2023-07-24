import { PROVIDER, TRANSACTION_TYPE } from "@/libs/constants";

import { IPlan } from "@/interfaces/IPlan";
import { IMusic } from "@/interfaces/IMusic";
import { IStream } from "@/interfaces/IStream";
import { ICurrency } from "@/interfaces/ICurrency";

export interface ITransaction {
  id: number | null;
  userId: number | null;
  buyer: any;
  orderId: number | null;
  amount: number;
  status: string;
  provider: PROVIDER;
  type: TRANSACTION_TYPE;
  planId: number | null;
  plan: IPlan;
  musicId: number | null;
  music: IMusic;
  livestreamId: number | null;
  livestream: IStream;
  currencyId: number | null;
  currency: ICurrency;
  createdAt: string;
}
