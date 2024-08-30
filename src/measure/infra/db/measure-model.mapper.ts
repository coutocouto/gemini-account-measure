import { Measure } from "../../domain/measure.entity";
import { MeasureModel } from "./measure.model";

export class MeasureModelMapper {
  static toModel(entity: Measure): MeasureModel {
    return MeasureModel.build({
      measureId: entity.measureId,
      imageUri: entity.imageUri,
      customerCode: entity.customerCode,
      measureValue: entity.measureValue,
      hasConfirmed: entity.hasConfirmed,
      measureType: entity.measureType,
      measureDateTime: entity.measureDateTime,
    });
  }

  static toEntity(model: MeasureModel): Measure {
    return Measure.from({
      measureId: model.measureId,
      imageUri: model.imageUri,
      customerCode: model.customerCode,
      measureValue: model.measureValue,
      hasConfirmed: model.hasConfirmed,
      measureType: model.measureType,
      measureDateTime: model.measureDateTime,
    });
  }
}
