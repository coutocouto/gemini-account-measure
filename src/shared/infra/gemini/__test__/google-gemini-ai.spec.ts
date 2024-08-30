import { GoogleGeminiAI } from "../google-gemini-ai";

describe("GoogleGeminiAI Unit Test", () => {
  let googleGeminiAI: GoogleGeminiAI;
  let googleGenerativeAI: any;
  let googleAIFileManager: any;

  beforeEach(() => {
    googleGenerativeAI = {
      getGenerativeModel: jest.fn(),
    };

    googleAIFileManager = {
      uploadFile: jest.fn(),
    };

    googleGeminiAI = new GoogleGeminiAI(
      googleGenerativeAI,
      googleAIFileManager,
    );
  });

  it("should upload an image in google file manager", async () => {
    const tempFilePath = "tempFilePath";
    const mimetype = "image/jpeg";

    googleAIFileManager.uploadFile.mockResolvedValue({
      file: { uri: "http://example.com/test.jpg" },
    });

    const result = await googleGeminiAI.uploadImageInGoogleFileManager(
      tempFilePath,
      mimetype,
    );

    expect(result).toEqual({ file: { uri: "http://example.com/test.jpg" } });
    expect(googleAIFileManager.uploadFile).toHaveBeenCalledWith(tempFilePath, {
      mimeType: mimetype,
    });
  });

  it("should generate a measure value in gemini ai", async () => {
    const mimeType = "image/jpeg";
    const fileUri = "http://example.com/test.jpg";

    const model = {
      generateContent: jest.fn(),
    };

    googleGenerativeAI.getGenerativeModel.mockReturnValue(model);

    model.generateContent.mockResolvedValue({
      response: { text: jest.fn().mockReturnValue("0.5") },
    });

    const result = await googleGeminiAI.generateMeasureValueInGeminiAI(
      mimeType,
      fileUri,
    );

    expect(result.response.text()).toEqual("0.5");
    expect(googleGenerativeAI.getGenerativeModel).toHaveBeenCalledWith({
      model: "gemini-1.5-pro",
    });
    expect(model.generateContent).toHaveBeenCalledWith([
      {
        fileData: {
          mimeType,
          fileUri,
        },
      },
      { text: "Give me the value that is in this meter, just the number.." },
    ]);
  });
});
