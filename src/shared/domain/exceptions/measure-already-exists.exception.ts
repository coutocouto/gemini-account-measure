import { HttpException } from "@nestjs/common";

export class MeasureAlreadyExistsException extends HttpException {
  constructor() {
    super("There is already a measure for this month", 409);
  }
}
