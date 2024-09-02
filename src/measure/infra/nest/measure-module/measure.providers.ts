import { ConfigService } from "@nestjs/config";
import { MeasureRepository } from "../../db/measure.repository";
import { UploadMeasureUseCase } from "../../../application/use-cases/upload-measure/upload-measure-usecase";
import { MeasureModel } from "../../db/measure.model";
import { getModelToken } from "@nestjs/sequelize";
import { GoogleGeminiAI } from "../../../../shared/infra/gemini/google-gemini-ai";
import { ConfirmMeasureValueUseCase } from "../../../application/use-cases/confirm-measure-value/confirm-measure-value.usecase";

export const REPOSITORIES = {
  MEASURE_REPOSITORY: {
    provide: "MeasureRepository",
    useExisting: MeasureRepository,
  },
  MEASURE_SEQUELIZE_REPOSITORY: {
    provide: MeasureRepository,
    useFactory: (measureModel: typeof MeasureModel) => {
      return new MeasureRepository(measureModel);
    },
    inject: [getModelToken(MeasureModel)],
  },
};

export const SERVICES = {
  CONFIG_SERVICE: {
    provide: ConfigService,
    useClass: ConfigService,
  },
};

export const USE_CASES = {
  UPLOAD_MEASURE_USE_CASE: {
    provide: UploadMeasureUseCase,
    useFactory: (repo: MeasureRepository, genAi: GoogleGeminiAI) => {
      return new UploadMeasureUseCase(repo, genAi);
    },
    inject: [REPOSITORIES.MEASURE_REPOSITORY.provide, GoogleGeminiAI],
  },
  CONFIRM_MEASURE_VALUE_USE_CASE: {
    provide: ConfirmMeasureValueUseCase,
    useFactory: (measureRepository: MeasureRepository) => {
      return new ConfirmMeasureValueUseCase(measureRepository);
    },
    inject: [REPOSITORIES.MEASURE_REPOSITORY.provide],
  },
};

export const MEASURE_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
  SERVICES,
};
