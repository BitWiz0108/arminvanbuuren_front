export interface ICountry {
  code: string;
  id: number | null;
  iso: string;
  iso3: string;
  name: string;
  numcode: string;
  phonecode: string;
}

export const DEFAULT_COUNTRY = {
  code: "",
  id: null,
  iso: "",
  iso3: "Select",
  name: "",
  numcode: "",
  phonecode: "",
} as ICountry;
