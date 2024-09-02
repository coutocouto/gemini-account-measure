import { ConfirmMeasureValueUseCase } from "../confirm-measure-value.usecase";
import { Measure } from "../../../../domain/measure.entity";

describe("ConfirmMeasureValueUseCase Unit Test", () => {
  let useCase: ConfirmMeasureValueUseCase;
  const mockRepo = {
    findByID: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    useCase = new ConfirmMeasureValueUseCase(mockRepo as any);
  });

  it("should be confirm measure value", async () => {
    const measure = Measure.fake().aMeasure().build();
    mockRepo.findByID.mockResolvedValue(measure);

    await useCase.execute({
      measure_id: measure.measureId,
      confirmed_value: 10,
    });

    expect(measure.hasConfirmed).toBe(true);
    expect(measure.measureValue).toBe(10);
    expect(mockRepo.update).toHaveBeenCalledWith(measure);
  });

  it("should be throw MeasureNotFoundException when measure not found", async () => {
    mockRepo.findByID.mockResolvedValue(null);

    await expect(
      useCase.execute({ measure_id: "1", confirmed_value: 10 }),
    ).rejects.toThrow("Measure not found");
  });

  it("should be throw MeasureAlreadyConfirmed when measure already confirmed", async () => {
    const measure = Measure.fake().aMeasure().withHasConfirmed().build();
    mockRepo.findByID.mockResolvedValue(measure);

    await expect(
      useCase.execute({ measure_id: "1", confirmed_value: 10 }),
    ).rejects.toThrow("Measure already confirmed");
  });
});
