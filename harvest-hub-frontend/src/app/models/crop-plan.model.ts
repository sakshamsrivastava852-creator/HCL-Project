import { Crop } from "./crop.model";
import { Field } from "./field.model";

export type PlanStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface CropPlan {
  id?: number;
  planName: string;
  season: string;
  startDate: string;
  endDate: string;
  status: PlanStatus;
  field?: Field | null;
  crop?: Crop | null;
}
