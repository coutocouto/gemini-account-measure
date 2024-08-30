export class UploadMeasureOutput {
  measure_id: string;
  image_url: string;
  measure_value: number;
  customer_code: string;
  measure_datetime: Date;
  measure_type: "WATER" | "GAS";

  constructor(
    measure_id: string,
    image_url: string,
    measure_value: number,
    customer_code: string,
    measure_datetime: Date,
    measure_type: "WATER" | "GAS",
  ) {
    this.measure_id = measure_id;
    this.image_url = image_url;
    this.measure_value = measure_value;
    this.customer_code = customer_code;
    this.measure_datetime = measure_datetime;
    this.measure_type = measure_type;
  }
}
