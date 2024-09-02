import { setupSequelize } from "../../../../../shared/infra/tests-helper/setup-sequelize";
import { Measure } from "../../../../domain/measure.entity";
import { MeasureModel } from "../../../../infra/db/measure.model";
import { MeasureRepository } from "../../../../infra/db/measure.repository";
import { ListMeasureByCustomer } from "../list-measure-by-customer.usecase";

describe("ListMeasureByCustomerUseCase Int Test", () => {
  setupSequelize({ models: [MeasureModel] });
  let useCase: ListMeasureByCustomer;
  let repo: MeasureRepository;

  beforeAll(async () => {
    repo = new MeasureRepository(MeasureModel);
    useCase = new ListMeasureByCustomer(repo);
  });

  it("should return a list of measure by customer code", async () => {
    const measure = Measure.fake().aMeasure().build();
    const measure2 = Measure.fake().aMeasure().build();

    await repo.save(measure);
    await repo.save(measure2);

    const measuresFound = await useCase.execute({
      customerCode: measure.customerCode,
      measureType: measure.measureType,
    });

    expect(measuresFound).toBeDefined();
    expect(measuresFound).toHaveLength(1);
    expect(measuresFound[0].measure_id).toBe(measure.measureId);
    expect(measuresFound[0].image_uri).toBe(measure.imageUri);
    expect(measuresFound[0].measure_value).toBe(measure.measureValue);
    expect(measuresFound[0].has_confirmed).toBe(measure.hasConfirmed);
    expect(measuresFound[0].measure_type).toBe(measure.measureType);
    expect(measuresFound[0].measure_datetime).toStrictEqual(
      measure.measureDateTime.toISOString(),
    );
  });

  it("should list measures by customer and measure type", async () => {
    const measure = Measure.fake().aMeasure().build();
    const measure2 = Measure.fake().aMeasure().build();

    await repo.save(measure);
    await repo.save(measure2);

    const measuresFound = await useCase.execute({
      customerCode: measure.customerCode,
      measureType: measure.measureType,
    });

    expect(measuresFound).toBeDefined();
    expect(measuresFound).toHaveLength(1);
    expect(measuresFound[0].measure_id).toBe(measure.measureId);
    expect(measuresFound[0].image_uri).toBe(measure.imageUri);
    expect(measuresFound[0].measure_value).toBe(measure.measureValue);
    expect(measuresFound[0].has_confirmed).toBe(measure.hasConfirmed);
    expect(measuresFound[0].measure_type).toBe(measure.measureType);
    expect(measuresFound[0].measure_datetime).toStrictEqual(
      measure.measureDateTime.toISOString(),
    );
  });

  it("should throw an exception if no measures are found", async () => {
    const measure = Measure.fake().aMeasure().build();
    const measure2 = Measure.fake().aMeasure().build();

    await repo.save(measure);
    await repo.save(measure2);

    const measureCode = "code";
    const measureType = "type";

    try {
      await repo.listByCustomerAndMeasureType(measureCode, measureType);
    } catch (error) {
      expect(error.message).toBe("No measures found for this customer");
    }
  });
});
