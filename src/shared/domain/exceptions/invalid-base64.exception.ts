import { HttpException } from "@nestjs/common";

export class InvalidBase64Exception extends HttpException {
  constructor() {
    super("Invalid Base64", 400);
  }
}
