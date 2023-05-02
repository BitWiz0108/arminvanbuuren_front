export interface IState {
  countryId: number | null;
  id: number | null;
  name: string;
}

export const DEFAULT_STATE = {
  countryId: null,
  id: null,
  name: "N/A",
} as IState;
