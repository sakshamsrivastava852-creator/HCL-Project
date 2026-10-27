import { Farm } from "./farm.model";

export interface Field {
  id?: number;
  name: string;
  area: number;
  soilType: string;
  farm?: Farm | null;
}
