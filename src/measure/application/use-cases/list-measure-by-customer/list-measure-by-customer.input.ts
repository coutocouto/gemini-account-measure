export class ListMeasureByCustomerInput {
  customerCode: string;
  measureType?: "WATER" | "GAS";

  constructor(customerCode: string, measureType?: "WATER" | "GAS") {
    this.customerCode = customerCode;
    this.measureType = measureType;
  }
}
