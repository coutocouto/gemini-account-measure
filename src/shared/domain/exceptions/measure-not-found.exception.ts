import { HttpException } from "@nestjs/common";

export class MeasureNotFoundException extends HttpException {
  constructor() {
    super("Measure not found", 404);
  }
}
