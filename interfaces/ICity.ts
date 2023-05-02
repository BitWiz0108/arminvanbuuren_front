export interface ICity {
  stateId: number | null;
  id: number | null;
  name: string;
}

export const DEFAULT_CITY = {
  stateId: null,
  id: null,
  name: "N/A",
} as ICity;
