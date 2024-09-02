import { IsIn, IsOptional, IsUUID } from "class-validator";

export class ListMeasureByCustomerInput {
  @IsUUID()
  customerCode: string;
  @IsIn(["WATER", "GAS"])
  @IsOptional()
  measureType?: "WATER" | "GAS";

  constructor(customerCode: string, measureType?: "WATER" | "GAS") {
    this.customerCode = customerCode;
    this.measureType = measureType;
  }
}
