import { Field } from "./field.model";

export interface Crop {
  id?: number;
  name: string;
  season: string;
  plantingDate: string;
  expectedYield: number;
  field?: Field | null;
}
