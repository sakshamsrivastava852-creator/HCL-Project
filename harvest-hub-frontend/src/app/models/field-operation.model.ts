import { CropPlan } from "./crop-plan.model";
import { Field } from "./field.model";

export type OperationStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface FieldOperation {
  id?: number;
  operationType: string;
  operationDate: string;
  description?: string;
  cost: number;
  status: OperationStatus;
  field?: Field | null;
  cropPlan?: CropPlan | null;
}
