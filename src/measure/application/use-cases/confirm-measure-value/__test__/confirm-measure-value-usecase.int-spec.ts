import { setupSequelize } from "../../../../../shared/infra/tests-helper/setup-sequelize";
import { Measure } from "../../../../domain/measure.entity";
import { MeasureModel } from "../../../../infra/db/measure.model";
import { MeasureRepository } from "../../../../infra/db/measure.repository";
import { ConfirmMeasureValueUseCase } from "../confirm-measure-value.usecase";

describe("ConfirmMeasureValueUseCase Integration Test", () => {
  setupSequelize({ models: [MeasureModel] });
  let useCase: ConfirmMeasureValueUseCase;
  let repo: MeasureRepository;

  beforeEach(() => {
    repo = new MeasureRepository(MeasureModel);
    useCase = new ConfirmMeasureValueUseCase(repo);
  });

  it("should be confirm measure value", async () => {
    const measure = Measure.fake().aMeasure().build();
    await repo.save(measure);

    await useCase.execute({
      measure_id: measure.measureId,
      confirmed_value: 10,
    });

    const updatedMeasure = await repo.findByID(measure.measureId);

    expect(updatedMeasure.hasConfirmed).toBe(true);
    expect(updatedMeasure.measureValue).toBe(10);
  });

  it("should be throw MeasureNotFoundException when measure not found", async () => {
    await expect(
      useCase.execute({ measure_id: "1", confirmed_value: 10 }),
    ).rejects.toThrow("Measure not found");
  });

  it("should be throw MeasureAlreadyConfirmed when measure already confirmed", async () => {
    const measure = Measure.fake().aMeasure().withHasConfirmed().build();
    await repo.save(measure);

    await expect(
      useCase.execute({ measure_id: measure.measureId, confirmed_value: 10 }),
    ).rejects.toThrow("Measure already confirmed");
  });
});
