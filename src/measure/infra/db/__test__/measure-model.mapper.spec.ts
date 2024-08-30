import { Measure } from "../../../domain/measure.entity";
import { MeasureModelMapper } from "../measure-model.mapper";
import { MeasureModel } from "../measure.model";
import { setupSequelize } from "../../../../shared/infra/tests-helper/setup-sequelize";

describe("MeasureModelMapper Unit Test", () => {
  setupSequelize({ models: [MeasureModel] });

  it("should return a MeasureModel instance when a send a Measure entity", () => {
    const measureEntity = Measure.fake().aMeasure().build();

    const measureModel = MeasureModelMapper.toModel(measureEntity);
    expect(measureModel).toBeInstanceOf(MeasureModel);
    expect(measureModel.measureId).toBe(measureEntity.measureId);
  });

  it("should return a Measure entity when a send a MeasureModel instance", () => {
    const measureModel = MeasureModel.build({
      measureId: "string",
      imageUri: "string",
      customerCode: "string",
      measureValue: 0,
      measureType: "WATER",
    });

    const measureEntity = MeasureModelMapper.toEntity(measureModel);
    expect(measureEntity).toBeInstanceOf(Measure);
    expect(measureEntity.measureId).toBe(measureModel.measureId);
  });
});
