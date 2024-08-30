import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGeminiAI } from "../gemini/google-gemini-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

@Global()
@Module({
  providers: [
    {
      provide: GoogleGeminiAI,
      useFactory: (configService: ConfigService) => {
        const googleAIFileManager = new GoogleAIFileManager(
          configService.get("GEMINI_API_KEY"),
        );
        const genAI = new GoogleGenerativeAI(
          configService.get("GEMINI_API_KEY"),
        );
        return new GoogleGeminiAI(genAI, googleAIFileManager);
      },
      inject: [ConfigService],
    },
  ],
  exports: [GoogleGeminiAI],
})
export class SharedModule {}
