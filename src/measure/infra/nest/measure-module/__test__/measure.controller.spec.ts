import { FileDto } from "../../../../application/use-cases/upload-measure/file-props.dto";
import { ConfirmMeasureValueDto } from "../dto/confirm-measure-value.dto";
import { UploadMeasureDto } from "../dto/upload-measure.dto";
import { MeasureController } from "../measure.controller";
import { MeasurePresenter } from "../measure.presenter";

describe("MeasureController Unit Teste", () => {
  let controller: MeasureController;
  let uploadMeasureUseCase: any;
  let confirmMeasureValueUseCase: any;
  let listMeasureByCustomer: any;

  beforeAll(() => {
    uploadMeasureUseCase = {
      execute: jest.fn(),
    };
    confirmMeasureValueUseCase = {
      execute: jest.fn(),
    };
    listMeasureByCustomer = {
      execute: jest.fn(),
    };

    controller = new MeasureController(
      uploadMeasureUseCase,
      confirmMeasureValueUseCase,
      listMeasureByCustomer,
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("uploadFile", () => {
    it("should upload a file", async () => {
      const file = {
        originalname: "image.png",
        mimetype: "image/png",
        buffer: Buffer.from("image"),
      } as FileDto;

      const customerCode = "28602b4e-f2a4-4b17-b2e0-93c7115fc0bb";
      const measureDateTime = new Date().toISOString();
      const measureType = "WATER";

      const uploadMeasureDto = new UploadMeasureDto(
        file,
        customerCode,
        measureDateTime,
        measureType,
      );

      jest
        .spyOn(uploadMeasureUseCase, "execute")
        .mockResolvedValueOnce(undefined);

      const result = await controller.uploadFile(
        file,
        customerCode,
        measureDateTime,
        measureType,
      );

      expect(result).toEqual(undefined);
      expect(uploadMeasureUseCase.execute).toHaveBeenCalledWith(
        uploadMeasureDto,
      );
    });

    it("should throw an error when the file is not provided", async () => {
      const customerCode = "28602b4e-f2a4-4b17-b2e0-93c7115fc0bb";
      const measureDateTime = new Date().toISOString();
      const measureType = "WATER";

      try {
        await controller.uploadFile(
          undefined,
          customerCode,
          measureDateTime,
          measureType,
        );
      } catch (error) {
        expect(error.message).toEqual("Unprocessable Entity Exception");
      }
    });

    it("should throw an error when the customer code is not provided", async () => {
      const file = {
        originalname: "image.png",
        mimetype: "image/png",
        buffer: Buffer.from("image"),
      } as FileDto;

      const measureDateTime = new Date().toISOString();
      const measureType = "WATER";

      try {
        await controller.uploadFile(
          file,
          undefined,
          measureDateTime,
          measureType,
        );
      } catch (error) {
        expect(error.message).toEqual("Unprocessable Entity Exception");
      }
    });
  });

  describe("confirmMeasureValue", () => {
    it("should confirm a measure value", async () => {
      const confirmMeasureValueDto = new ConfirmMeasureValueDto(
        "measure_id",
        10,
      );

      jest
        .spyOn(confirmMeasureValueUseCase, "execute")
        .mockResolvedValueOnce(undefined);

      const result = await controller.confirmMeasureValue(
        confirmMeasureValueDto,
      );

      expect(result).toEqual(undefined);
      expect(confirmMeasureValueUseCase.execute).toHaveBeenCalledWith(
        confirmMeasureValueDto,
      );
    });
  });

  describe("list", () => {
    it("should list all measures by customer", async () => {
      const customerCode = "28602b4e-f2a4-4b17-b2e0-93c7115fc0bb";
      const measureType = "WATER";

      const listMeasureDto = {
        customerCode,
        measureType,
      };

      const measures = [{ id: "measure_id", value: 10 }];

      jest
        .spyOn(listMeasureByCustomer, "execute")
        .mockResolvedValueOnce(measures);

      const result = await controller.list(customerCode, measureType);

      expect(result).toBeInstanceOf(MeasurePresenter);
      expect(result.customer_code).toEqual(customerCode);
      expect(result.measures).toEqual(measures);
      expect(listMeasureByCustomer.execute).toHaveBeenCalledWith(
        listMeasureDto,
      );
    });
  });
});
