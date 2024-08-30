import { HttpException } from "@nestjs/common";

export class InternalServerErrorException extends HttpException {
  constructor(msg: string) {
    super(msg, 500);
  }
}
