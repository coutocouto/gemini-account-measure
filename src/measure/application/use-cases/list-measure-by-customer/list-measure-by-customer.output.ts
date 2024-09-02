import { Transform } from "class-transformer";

export class ListMeasureByCustomerOutput {
  measure_id: string;
  @Transform(({ value }) => value.toISOString())
  measure_datetime: string;
  measure_value: number;
  measure_type: "WATER" | "GAS";
  has_confirmed: boolean;
  image_uri: string;

  constructor(
    measure_id: string,
    measure_datetime: Date,
    measure_value: number,
    measure_type: "WATER" | "GAS",
    has_confirmed: boolean,
    image_uri: string,
  ) {
    this.measure_id = measure_id;
    this.measure_datetime = measure_datetime.toISOString();
    this.measure_value = measure_value;
    this.measure_type = measure_type;
    this.has_confirmed = has_confirmed;
    this.image_uri = image_uri;
  }
}
