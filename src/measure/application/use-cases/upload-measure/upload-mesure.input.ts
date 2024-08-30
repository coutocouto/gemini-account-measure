import { IsNotEmpty, IsDateString, IsUUID, IsIn } from "class-validator";
import { FileDto } from "./file-props.dto";

export class UploadMeasureInput {
  @IsNotEmpty()
  image: FileDto;

  @IsNotEmpty()
  @IsUUID()
  customer_code: string;

  @IsDateString()
  measure_datetime: string;

  @IsIn(["WATER", "GAS"])
  measure_type: "WATER" | "GAS";

  constructor(
    image: FileDto,
    customer_code: string,
    measure_datetime: string,
    measure_type: "WATER" | "GAS",
  ) {
    this.image = image;
    this.customer_code = customer_code;
    this.measure_datetime = measure_datetime;
    this.measure_type = measure_type;
  }
}
