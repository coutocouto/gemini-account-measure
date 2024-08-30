import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from "@nestjs/common";
import { UploadMeasureUseCase } from "../../../application/use-cases/upload-measure/upload-measure-usecase";
import { UploadMeasureDto } from "./dto/upload-measure.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileDto } from "../../../application/use-cases/upload-measure/file-props.dto";

@Controller("")
export class MeasureController {
  constructor(private readonly uploadMeasureUseCase: UploadMeasureUseCase) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("image"))
  async uploadFile(
    @UploadedFile() file: FileDto,
    @Body("customer_code") customerCode: string,
    @Body("measure_datetime") measureDateTime: string,
    @Body("measure_type") measureType: "WATER" | "GAS",
  ) {
    const fileDto = await new ValidationPipe({
      errorHttpStatusCode: 422,
    }).transform(file, {
      type: "body",
      metatype: FileDto,
    });

    const uploadMeasureDto = await new ValidationPipe({
      errorHttpStatusCode: 422,
    }).transform(
      new UploadMeasureDto(fileDto, customerCode, measureDateTime, measureType),
      {
        type: "body",
        metatype: UploadMeasureDto,
      },
    );

    return await this.uploadMeasureUseCase.execute(uploadMeasureDto);
  }
}
