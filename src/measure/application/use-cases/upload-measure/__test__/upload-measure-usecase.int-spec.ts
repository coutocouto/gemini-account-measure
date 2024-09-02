import { GoogleGeminiAI } from "../../../../../shared/infra/gemini/google-gemini-ai";
import { MeasureModel } from "../../../../infra/db/measure.model";
import { MeasureRepository } from "../../../../infra/db/measure.repository";
import { UploadMeasureUseCase } from "../upload-measure-usecase";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { UploadMeasureDto } from "../../../../infra/nest/measure-module/dto/upload-measure.dto";
import { UploadMeasureOutput } from "../upload-measure-output";
import { setupSequelize } from "../../../../../shared/infra/tests-helper/setup-sequelize";

describe("UploadMeasureUseCase Int Teste", () => {
  setupSequelize({ models: [MeasureModel] });
  let useCase: UploadMeasureUseCase;
  let repo: MeasureRepository;
  let ai: GoogleGeminiAI;
  let mockGoogleGenerativeAI;
  let mockGoogleAIFileManager;

  beforeEach(() => {
    mockGoogleGenerativeAI = {
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: jest.fn().mockReturnValue("0.5"),
          },
        }),
      }),
    };
    mockGoogleAIFileManager = {
      uploadFile: jest.fn().mockResolvedValue({
        file: {
          uri: "http://example.com/test.jpg",
        },
      }),
    };

    repo = new MeasureRepository(MeasureModel);
    ai = new GoogleGeminiAI(
      mockGoogleGenerativeAI as unknown as GoogleGenerativeAI,
      mockGoogleAIFileManager as unknown as GoogleAIFileManager,
    );
    useCase = new UploadMeasureUseCase(repo, ai);
  });

  it("should upload a measure", async () => {
    const spy = jest.spyOn(ai, "uploadImageInGoogleFileManager");
    const spy2 = jest.spyOn(ai, "generateMeasureValueInGeminiAI");

    const uploadMeasureDto = new UploadMeasureDto(
      {
        originalname: "image.png",
        mimetype: "image/png",
        buffer: Buffer.from("base64"),
      },
      "customer_code",
      "2022-02-01",
      "WATER",
    );

    const result = await useCase.execute(uploadMeasureDto);

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(UploadMeasureOutput);
    expect(result.measure_id).toBeDefined();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    const measure = await repo.findByID(result.measure_id);

    expect(measure).toBeDefined();
    expect(measure.imageUri).toBeDefined();
    expect(measure.customerCode).toBe(uploadMeasureDto.customer_code);
    expect(measure.measureType).toBe(uploadMeasureDto.measure_type);
    expect(measure.measureValue).toBeDefined();
    expect(measure.hasConfirmed).toBe(false);
    expect(measure.measureDateTime).toBeDefined();
  });

  it("should throw an error if the measure already exists", async () => {
    const uploadMeasureDto = new UploadMeasureDto(
      {
        originalname: "image.png",
        mimetype: "image/png",
        buffer: Buffer.from("base64"),
      },
      "customer_code",
      "2022-02-01",
      "WATER",
    );

    await useCase.execute(uploadMeasureDto);

    await expect(useCase.execute(uploadMeasureDto)).rejects.toThrow(
      "There is already a reading for this type in the current month",
    );
  });

  it("should throw an error if the base64 is invalid", async () => {
    useCase["isBase64"] = jest.fn().mockReturnValue(false);

    const uploadMeasureDto = new UploadMeasureDto(
      {
        originalname: "image.png",
        mimetype: "image/png",
        buffer: Buffer.from("invalid_base64"),
      },
      "customer_code",
      "2022-02-01",
      "WATER",
    );

    await expect(useCase.execute(uploadMeasureDto)).rejects.toThrow(
      "Invalid Base64",
    );
  });

  it("should throw an error when google ai file manager throws an error", async () => {
    mockGoogleAIFileManager.uploadFile = jest
      .fn()
      .mockRejectedValue(new Error(`Error upload`));

    const uploadMeasureDto = new UploadMeasureDto(
      {
        originalname: "image.png",
        mimetype: "image/png",
        buffer: Buffer.from("base64"),
      },
      "customer_code",
      "2022-02-01",
      "WATER",
    );

    await expect(useCase.execute(uploadMeasureDto)).rejects.toThrow(
      "Error upload",
    );
  });

  it("should throw an error when google ai generative model throws an error", async () => {
    mockGoogleGenerativeAI.getGenerativeModel = jest.fn().mockReturnValue({
      generateContent: jest.fn().mockRejectedValue(new Error(`Error generate`)),
    });

    const uploadMeasureDto = new UploadMeasureDto(
      {
        originalname: "image.png",
        mimetype: "image/png",
        buffer: Buffer.from("base64"),
      },
      "customer_code",
      "2022-02-01",
      "WATER",
    );

    await expect(useCase.execute(uploadMeasureDto)).rejects.toThrow(
      "Error generate",
    );
  });
});
