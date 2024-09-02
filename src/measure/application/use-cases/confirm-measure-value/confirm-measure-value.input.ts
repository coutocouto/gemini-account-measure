import { IsNotEmpty, IsUUID } from "class-validator";

export class ConfirmMeasureValueInput {
  @IsNotEmpty()
  @IsUUID()
  measure_id: string;

  @IsNotEmpty()
  confirmed_value: number;

  constructor(measure_id: string, confirmed_value: number) {
    this.measure_id = measure_id;
    this.confirmed_value = confirmed_value;
  }
}
