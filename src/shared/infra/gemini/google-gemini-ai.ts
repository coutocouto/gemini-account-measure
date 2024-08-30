import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { InternalServerErrorException, Logger } from "@nestjs/common";

export class GoogleGeminiAI {
  private readonly logger = new Logger(GoogleGeminiAI.name);
  constructor(
    private googleGenerativeAI: GoogleGenerativeAI,
    private googleAIFileManager: GoogleAIFileManager,
  ) {}

  async uploadImageInGoogleFileManager(tempFilePath: string, mimetype: string) {
    try {
      return await this.googleAIFileManager.uploadFile(tempFilePath, {
        mimeType: mimetype,
      });
    } catch (error) {
      this.logger.error(`Error uploading file to google fm: ${error.message}`);
      throw new InternalServerErrorException(
        `Error uploading file: ${error.message}`,
      );
    }
  }

  async generateMeasureValueInGeminiAI(mimeType: string, fileUri: string) {
    try {
      const model = this.googleGenerativeAI.getGenerativeModel({
        model: "gemini-1.5-pro",
      });

      return await model.generateContent([
        {
          fileData: {
            mimeType: "image/jpeg",
            fileUri: fileUri,
          },
        },
        { text: "Give me the value that is in this meter, just the number.." },
      ]);
    } catch (error) {
      this.logger.error(`Error generating content: ${error.message}`);
      throw new InternalServerErrorException(
        `Error generating content: ${error.message}`,
      );
    }
  }
}
