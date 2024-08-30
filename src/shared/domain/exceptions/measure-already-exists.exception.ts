import { HttpException } from "@nestjs/common";

export class MeasureAlreadyExistsException extends HttpException {
  constructor() {
    super("There is already a reading for this type in the current month", 409);
  }
}
