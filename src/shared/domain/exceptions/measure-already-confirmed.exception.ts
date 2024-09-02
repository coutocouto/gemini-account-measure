import { HttpException } from "@nestjs/common";

export class MeasureAlreadyConfirmed extends HttpException {
  constructor() {
    super("Measure already confirmed", 409);
  }
}
