type StringProp = {
  raw: string | null;
  snippet: string | null;
};

type NumberProp = {
  raw: number | null;
  snippet: number | null;
};

type ArrayStringProp = {
  raw: string[];
  snippet: string | null;
};
type ArrayNumberProp = {
  raw: number[];
  snippet: number | null;
};

type meta = {
  id: string;
  engine: string;
  score: number | null;
};

export interface ParsedLaptopSpesification {
  name: StringProp;
  url: StringProp;
  buy_url: StringProp;
  thumb: StringProp;
  price: StringProp;
  price_list: NumberProp;
  brand: StringProp;
  cpu: StringProp;
  gpu: StringProp;
  display_size: NumberProp;
  display_resolution: StringProp;
  display_name: StringProp;
  panel_type: StringProp;
  panel_code: NumberProp;
  refresh_rate: StringProp;
  storage_ssd: NumberProp;
  storage_hdd: NumberProp;
  ram: NumberProp;
  weight: NumberProp;
  suitable_for: ArrayStringProp;
  pop_searches: ArrayStringProp;
  show_our: ArrayStringProp;
  is_new: StringProp;
  last_upd: StringProp;
  id: StringProp;
  _meta: meta;
}

type OptionalString = string | null;
type OptionalNumber = number | null;

export interface Formatedlaptop {
  id: OptionalString;
  name: OptionalString;
  url: string;
  buy_url: OptionalString;
  thumb: OptionalString;
  price: number;
  brand: OptionalString;
  cpu: OptionalString;
  gpu: OptionalString;
  display_size: OptionalNumber;
  display_resolution: OptionalString;
  display_name: OptionalString;
  panel_type: OptionalString;
  panel_code: OptionalNumber;
  refresh_rate: OptionalNumber;
  storage_ssd: OptionalNumber;
  storage_hdd: OptionalNumber;
  ram: OptionalNumber;
  weight: OptionalNumber;
  suitable_for: OptionalString;
  pop_searches: Array<OptionalString>;
  is_new: boolean;
  last_upd: OptionalString;
}
