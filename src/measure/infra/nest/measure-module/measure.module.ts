import { Module } from "@nestjs/common";
import { MeasureModel } from "../../db/measure.model";
import { MeasureController } from "./measure.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { MEASURE_PROVIDERS } from "./measure.providers";

@Module({
  imports: [SequelizeModule.forFeature([MeasureModel])],
  controllers: [MeasureController],
  providers: [
    ...Object.values(MEASURE_PROVIDERS.USE_CASES),
    ...Object.values(MEASURE_PROVIDERS.REPOSITORIES),
    ...Object.values(MEASURE_PROVIDERS.SERVICES),
  ],
})
export class MeasureModule {}
