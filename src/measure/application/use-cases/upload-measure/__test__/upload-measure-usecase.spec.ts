import { InternalServerErrorException } from "@nestjs/common";
import { InvalidBase64Exception } from "../../../../../shared/domain/exceptions/invalid-base64.exception";
import { MeasureAlreadyExistsException } from "../../../../../shared/domain/exceptions/measure-already-exists.exception";
import { UploadMeasureDto } from "../../../../infra/nest/measure-module/dto/upload-measure.dto";
import { UploadMeasureOutput } from "../upload-measure-output";
import { UploadMeasureUseCase } from "../upload-measure-usecase";

describe("UploadMeasureUseCase Unit Test", () => {
  let useCase: UploadMeasureUseCase;
  let measureRepository: any;
  let googleGeminiAI: any;

  beforeEach(() => {
    measureRepository = {
      checkIfExistAMeasureInThisMonthForThisCustomerAndType: jest.fn(),
      save: jest.fn(),
    };

    googleGeminiAI = {
      uploadImageInGoogleFileManager: jest.fn(),
      generateMeasureValueInGeminiAI: jest.fn(),
    };

    useCase = new UploadMeasureUseCase(measureRepository, googleGeminiAI);
  });

  it("should save a measure and return UploadMeasureOutput", async () => {
    const uploadMeasureDto = new UploadMeasureDto(
      {
        originalname: "image.png",
        mimetype: "image/png",
        buffer: Buffer.from("valid_base64"),
      },
      "customer_code",
      "2022-02-01",
      "WATER",
    );

    const isBase64Spy = jest
      .spyOn(useCase as any, "isBase64")
      .mockReturnValue(true);
    measureRepository.checkIfExistAMeasureInThisMonthForThisCustomerAndType.mockResolvedValue(
      false,
    );

    googleGeminiAI.uploadImageInGoogleFileManager.mockResolvedValue({
      file: { uri: "http://example.com/test.jpg" },
    });

    googleGeminiAI.generateMeasureValueInGeminiAI.mockResolvedValue({
      response: { text: jest.fn().mockReturnValue("0.5") },
    });

    const result = await useCase.execute(uploadMeasureDto);

    expect(result).toBeInstanceOf(UploadMeasureOutput);
    expect(result.measure_id).toBeDefined();
    expect(result.image_url).toBe("http://example.com/test.jpg");
    expect(result.customer_code).toBe(uploadMeasureDto.customer_code);
    expect(result.measure_type).toBe(uploadMeasureDto.measure_type);
    expect(result.measure_value).toBe(0.5);
    expect(result.measure_datetime).toBeInstanceOf(Date);
    expect(isBase64Spy).toHaveBeenCalled();
    expect(
      measureRepository.checkIfExistAMeasureInThisMonthForThisCustomerAndType,
    ).toHaveBeenCalled();
  });

  it("should throw MeasureAlreadyExistsException if the measure already exists", async () => {
    const uploadMeasureDto = new UploadMeasureDto(
      {
        originalname: "image.png",
        mimetype: "image/png",
        buffer: Buffer.from("valid_base64"),
      },
      "customer_code",
      "2022-02-01",
      "WATER",
    );

    measureRepository.checkIfExistAMeasureInThisMonthForThisCustomerAndType.mockResolvedValue(
      true,
    );

    await expect(useCase.execute(uploadMeasureDto)).rejects.toThrow(
      MeasureAlreadyExistsException,
    );
  });

  it("should throw InvalidBase64Exception if the base64 is invalid", async () => {
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

    jest.spyOn(useCase as any, "isBase64").mockReturnValue(false);

    await expect(useCase.execute(uploadMeasureDto)).rejects.toThrow(
      InvalidBase64Exception,
    );
  });

  it("should throw InternalServerErrorException when saving file fails", async () => {
    const uploadMeasureDto = new UploadMeasureDto(
      {
        originalname: "image.png",
        mimetype: "image/png",
        buffer: Buffer.from("valid_base64"),
      },
      "customer_code",
      "measure_type",
      "WATER",
    );

    jest.spyOn(useCase as any, "isBase64").mockReturnValue(true);
    useCase["saveFileInTempFolder"] = jest.fn().mockImplementation(() => {
      throw new InternalServerErrorException("Failed to save file");
    });

    await expect(useCase.execute(uploadMeasureDto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
