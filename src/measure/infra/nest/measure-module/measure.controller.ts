import { FileInterceptor } from "@nestjs/platform-express";
import { UploadMeasureUseCase } from "../../../application/use-cases/upload-measure/upload-measure-usecase";
import { UploadMeasureDto } from "./dto/upload-measure.dto";
import { FileDto } from "../../../application/use-cases/upload-measure/file-props.dto";
import { ConfirmMeasureValueDto } from "./dto/confirm-measure-value.dto";
import { ConfirmMeasureValueUseCase } from "../../../application/use-cases/confirm-measure-value/confirm-measure-value.usecase";
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  ValidationPipe,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { ListMeasureByCustomer } from "../../../application/use-cases/list-measure-by-customer/list-measure-by-customer.usecase";
import { ListMeasureByCustomerDto } from "./dto/list-measure-by-customer.dto";
import { MeasurePresenter } from "./measure.presenter";

@Controller("")
export class MeasureController {
  constructor(
    private readonly uploadMeasureUseCase: UploadMeasureUseCase,
    private readonly confirmMeasureValueUseCase: ConfirmMeasureValueUseCase,
    private readonly listMeasureByCustomer: ListMeasureByCustomer,
  ) {}

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

  @Post("confirm")
  async confirmMeasureValue(
    @Body() confirmMeasureValueDto: ConfirmMeasureValueDto,
  ) {
    return await this.confirmMeasureValueUseCase.execute(
      confirmMeasureValueDto,
    );
  }

  @Get("/:customer_code/list")
  async list(
    @Param("customer_code") customerCode: string,
    @Query("measure_type") measureType: "WATER" | "GAS",
  ) {
    const listMeasureDto = await new ValidationPipe({
      errorHttpStatusCode: 422,
    }).transform(new ListMeasureByCustomerDto(customerCode, measureType), {
      type: "body",
      metatype: ListMeasureByCustomerDto,
    });

    const measures = await this.listMeasureByCustomer.execute(listMeasureDto);
    return new MeasurePresenter(customerCode, measures);
  }
}
