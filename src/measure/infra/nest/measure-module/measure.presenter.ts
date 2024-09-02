import { ListMeasureByCustomerOutput } from "../../../application/use-cases/list-measure-by-customer/list-measure-by-customer.output";

export class MeasurePresenter {
  customer_code: string;
  measures: ListMeasureByCustomerOutput[];

  constructor(customer_code: string, measures: ListMeasureByCustomerOutput[]) {
    this.customer_code = customer_code;
    this.measures = measures;
  }
}
