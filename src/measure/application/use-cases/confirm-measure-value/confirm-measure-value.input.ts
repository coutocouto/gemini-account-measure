import { IsNotEmpty, IsUUID } from "class-validator";

export class ConfirmMeasureValueInput {
  @IsNotEmpty()
  @IsUUID()
  measure_id: string;

  @IsNotEmpty()
  confirmed_value: number;
}
