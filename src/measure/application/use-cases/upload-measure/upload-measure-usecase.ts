import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import { Measure } from "../../../domain/measure.entity";
import { MeasureRepository } from "../../../infra/db/measure.repository";
import { UploadMeasureDto } from "../../../infra/nest/measure-module/dto/upload-measure.dto";
import { GoogleGeminiAI } from "../../../../shared/infra/gemini/google-gemini-ai";
import { UploadMeasureOutput } from "./upload-measure-output";
import { FileDto } from "./file-props.dto";
import { InvalidBase64Exception } from "../../../../shared/domain/exceptions/invalid-base64.exception";
import { MeasureAlreadyExistsException } from "../../../../shared/domain/exceptions/measure-already-exists.exception";

@Injectable()
export class UploadMeasureUseCase {
  private readonly logger = new Logger(UploadMeasureUseCase.name);

  constructor(
    readonly measureRepository: MeasureRepository,
    readonly genAI: GoogleGeminiAI,
  ) {}

  async execute(
    uploadMeasureDto: UploadMeasureDto,
  ): Promise<UploadMeasureOutput> {
    if (!this.isBase64(uploadMeasureDto.image.buffer.toString("base64"))) {
      throw new InvalidBase64Exception();
    }

    const existsMeasureThisMonth =
      await this.measureRepository.checkIfExistAMeasureInThisMonthForThisCustomerAndType(
        uploadMeasureDto.customer_code,
        uploadMeasureDto.measure_type,
      );

    if (existsMeasureThisMonth) {
      throw new MeasureAlreadyExistsException();
    }

    const tempFilePath = await this.saveFileInTempFolder(
      uploadMeasureDto.image,
    );
    try {
      const uploadImageResponse =
        await this.genAI.uploadImageInGoogleFileManager(
          tempFilePath,
          uploadMeasureDto.image.mimetype,
        );

      const fileUri = uploadImageResponse.file.uri;

      const result = await this.genAI.generateMeasureValueInGeminiAI(
        tempFilePath,
        fileUri,
      );

      const measure = Measure.create({
        imageUri: fileUri,
        customerCode: uploadMeasureDto.customer_code,
        measureValue: Number(result.response.text()),
        measureType: uploadMeasureDto.measure_type,
      });

      await this.measureRepository.save(measure);

      return new UploadMeasureOutput(
        measure.measureId,
        measure.imageUri,
        measure.measureValue,
        measure.customerCode,
        measure.measureDateTime,
        measure.measureType,
      );
    } catch (error) {
      this.logger.error(`Error during the upload process: ${error.message}`);
      throw error;
    } finally {
      if (tempFilePath) {
        await this.removeFileInTempFolder(tempFilePath);
      }
    }
  }

  private async saveFileInTempFolder(file: FileDto): Promise<string> {
    const tempDir = path.join(__dirname, "..", "temp");
    const tempFilePath = path.join(tempDir, file.originalname);

    try {
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
      fs.writeFileSync(tempFilePath, file.buffer);
      this.logger.log(`File saved at: ${tempFilePath}`);
      return tempFilePath;
    } catch (error) {
      this.logger.error(`Failed to save file in temp folder`, error);
      throw new InternalServerErrorException("Failed to save file");
    }
  }

  private async removeFileInTempFolder(tempFilePath: string) {
    try {
      fs.unlinkSync(tempFilePath);
      this.logger.log(`Temporary file removed: ${tempFilePath}`);
    } catch (error) {
      this.logger.error(`Failed to remove temp file: ${tempFilePath}`, error);
    }
  }

  // TODO: Maybe not working as expected
  private isBase64(str: string): boolean {
    try {
      str = str.trim();
      const base64Regex =
        /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

      if (!base64Regex.test(str)) {
        return false;
      }

      Buffer.from(str, "base64").toString("utf-8");
      return true;
    } catch (err) {
      this.logger.error(`Error checking if string is base64: ${err.message}`);
      return false;
    }
  }
}
