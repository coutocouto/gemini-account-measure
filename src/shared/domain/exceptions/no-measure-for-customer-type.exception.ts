import { HttpException } from "@nestjs/common";

export class NoMeasuresForThisCustomerOrTypeException extends HttpException {
  constructor() {
    super("No measures for this customer", 404);
  }
}
