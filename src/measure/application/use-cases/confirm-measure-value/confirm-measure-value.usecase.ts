import { MeasureAlreadyConfirmed } from "../../../../shared/domain/exceptions/measure-already-confirmed.exception";
import { MeasureNotFoundException } from "../../../../shared/domain/exceptions/measure-not-found.exception";
import { MeasureRepository } from "../../../infra/db/measure.repository";
import { ConfirmMeasureValueInput } from "./confirm-measure-value.input";

export class ConfirmMeasureValueUseCase {
  constructor(private measureRepository: MeasureRepository) {}

  async execute(input: ConfirmMeasureValueInput): Promise<void> {
    const measure = await this.measureRepository.findByID(input.measure_id);

    if (!measure) {
      throw new MeasureNotFoundException();
    }

    if (measure.hasConfirmed) {
      throw new MeasureAlreadyConfirmed();
    }

    measure.confirmValue(input.confirmed_value);

    await this.measureRepository.update(measure);

    return;
  }
}
