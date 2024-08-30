import { MeasureModel } from "../measure.model";
import { MeasureRepository } from "../measure.repository";
import { setupSequelize } from "../../../../shared/infra/tests-helper/setup-sequelize";
import { Measure } from "../../../domain/measure.entity";

describe("MeasureRepository Unit Test", () => {
  setupSequelize({ models: [MeasureModel] });
  let repo: MeasureRepository;

  beforeAll(async () => {
    repo = new MeasureRepository(MeasureModel);
  });

  it("should save a measure", async () => {
    const measure = Measure.fake().aMeasure().build();

    await repo.save(measure);
    const measureFound = await repo.findByID(measure.measureId);

    expect(measureFound).toBeDefined();
    expect(measureFound.measureId).toBe(measure.measureId);
    expect(measureFound.imageUri).toBe(measure.imageUri);
    expect(measureFound.customerCode).toBe(measure.customerCode);
    expect(measureFound.measureValue).toBe(measure.measureValue);
    expect(measureFound.hasConfirmed).toBe(measure.hasConfirmed);
    expect(measureFound.measureType).toBe(measure.measureType);
    expect(measureFound.measureDateTime).toStrictEqual(measure.measureDateTime);
  });

  it("should return a measure by customer code", async () => {
    const measure = Measure.fake().aMeasure().build();
    await repo.save(measure);

    const measuresFound = await repo.findByCustomerCode(measure.customerCode);

    expect(measuresFound).toBeDefined();
    expect(measuresFound).toHaveLength(1);
    expect(measuresFound[0].measureId).toBe(measure.measureId);
    expect(measuresFound[0].imageUri).toBe(measure.imageUri);
    expect(measuresFound[0].customerCode).toBe(measure.customerCode);
    expect(measuresFound[0].measureValue).toBe(measure.measureValue);
    expect(measuresFound[0].hasConfirmed).toBe(measure.hasConfirmed);
    expect(measuresFound[0].measureType).toBe(measure.measureType);
    expect(measuresFound[0].measureDateTime).toStrictEqual(
      measure.measureDateTime,
    );
  });

  it("should return a measure by ID", async () => {
    const measure = Measure.fake().aMeasure().build();
    await repo.save(measure);

    const measureFound = await repo.findByID(measure.measureId);

    expect(measureFound).toBeDefined();
    expect(measureFound.measureId).toBe(measure.measureId);
    expect(measureFound.imageUri).toBe(measure.imageUri);
    expect(measureFound.customerCode).toBe(measure.customerCode);
    expect(measureFound.measureValue).toBe(measure.measureValue);
    expect(measureFound.hasConfirmed).toBe(measure.hasConfirmed);
    expect(measureFound.measureType).toBe(measure.measureType);
    expect(measureFound.measureDateTime).toStrictEqual(measure.measureDateTime);
  });

  it("should return false if there is no measure in this month for this customer and type", async () => {
    const measure = Measure.fake().aMeasure().build();

    const result =
      await repo.checkIfExistAMeasureInThisMonthForThisCustomerAndType(
        measure.customerCode,
        measure.measureType,
      );

    expect(result).toBe(false);
  });

  it("should return true if there is a measure in this month for this customer and type", async () => {
    const measure = Measure.fake().aMeasure().build();
    await repo.save(measure);

    const result =
      await repo.checkIfExistAMeasureInThisMonthForThisCustomerAndType(
        measure.customerCode,
        measure.measureType,
      );

    expect(result).toBe(true);
  });
});
