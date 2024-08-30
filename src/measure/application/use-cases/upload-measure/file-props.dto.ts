import { IsIn, IsNotEmpty } from "class-validator";

export class FileDto {
  originalname: string;

  @IsIn(["image/jpeg", "image/png", "image/jpg", "image/webp"])
  mimetype: "image/jpeg" | "image/png" | "image/jpg" | "image/webp";

  //@IsBase64()
  @IsNotEmpty()
  buffer: Buffer;
}
