import { Measure } from "../../domain/measure.entity";
import { IMeasureRepository } from "../../domain/measure.repository.interface";
import { MeasureModelMapper } from "./measure-model.mapper";
import { MeasureModel } from "./measure.model";

export class MeasureRepository implements IMeasureRepository {
  constructor(private readonly measureModel: typeof MeasureModel) {}

  async findByID(id: string): Promise<Measure> {
    const model = await this.measureModel.findByPk(id);
    return model ? MeasureModelMapper.toEntity(model) : null;
  }

  async save(measure: Measure): Promise<void> {
    const model = MeasureModelMapper.toModel(measure);
    await this.measureModel.create(model.toJSON());
  }

  async update(measure: Measure) {
    const model = MeasureModelMapper.toModel(measure);
    await this.measureModel.update(model.toJSON(), {
      where: { measureId: model.measureId },
    });
  }

  async findByCustomerCode(customerCode: string): Promise<Measure[]> {
    const models = await this.measureModel.findAll({
      where: { customerCode },
    });
    return models.map((model) => MeasureModelMapper.toEntity(model));
  }

  async listByCustomerAndMeasureType(
    customerCode: string,
    measureType?: string,
  ): Promise<Measure[]> {
    const models = await this.measureModel.findAll({
      where: {
        customerCode,
        ...(measureType && { measureType }),
      },
    });

    return models.length
      ? models.map((model) => MeasureModelMapper.toEntity(model))
      : null;
  }

  async checkIfExistAMeasureInThisMonthForThisCustomerAndType(
    customerCode: string,
    measureType: string,
  ): Promise<boolean> {
    const measure = await this.measureModel.findAll({
      where: {
        customerCode,
        measureType,
      },
    });

    measure.filter((m) => {
      const now = new Date();
      const startOfMonth = now.getMonth();

      const measureDate = new Date(m.measureDateTime);
      const measureMonth = measureDate.getMonth();

      return startOfMonth === measureMonth;
    });

    return measure.length !== 0;
  }
}
