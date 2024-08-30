import { Measure } from "./measure.entity";

export interface IMeasureRepository {
  save(measure: Measure): Promise<void>;
  findByID(id: string): Promise<Measure>;
  findByCustomerCode(customerCode: string): Promise<Measure[]>;
}
