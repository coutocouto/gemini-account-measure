import { NoMeasuresForThisCustomerOrTypeException } from "../../../../shared/domain/exceptions/no-measure-for-customer-type.exception";
import { Measure } from "../../../domain/measure.entity";
import { MeasureRepository } from "../../../infra/db/measure.repository";
import { ListMeasureByCustomerInput } from "./list-measure-by-customer.input";
import { ListMeasureByCustomerOutput } from "./list-measure-by-customer.output";

export class ListMeasureByCustomer {
  constructor(private readonly measureRepository: MeasureRepository) {}

  async execute(
    customerCode: ListMeasureByCustomerInput,
  ): Promise<ListMeasureByCustomerOutput[]> {
    const measures = await this.measureRepository.listByCustomerAndMeasureType(
      customerCode.customerCode,
      customerCode.measureType,
    );

    if (!measures) {
      throw new NoMeasuresForThisCustomerOrTypeException();
    }

    return measures.map((measure: Measure) => {
      return new ListMeasureByCustomerOutput(
        measure.measureId,
        measure.measureDateTime,
        measure.measureValue,
        measure.measureType,
        measure.hasConfirmed,
        measure.imageUri,
      );
    });
  }
}
