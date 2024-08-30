import { config as readEnv } from "dotenv";
import { join } from "path";

export class Config {
  static env: any = null;

  static googleCredentials() {
    Config.readEnv();

    return Config.env.GEMINI_API_KEY;
  }

  static readEnv() {
    if (Config.env) {
      return;
    }

    const { parsed } = readEnv({
      path: join(__dirname, `../../../.env`),
    });

    Config.env = {
      ...parsed,
      ...process.env,
    };
  }
}
