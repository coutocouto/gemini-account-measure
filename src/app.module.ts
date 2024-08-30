import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { MeasureModule } from "./measure/infra/nest/measure-module/measure.module";
import { SharedModule } from "./shared/infra/nest/shared.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    DatabaseModule,
    MeasureModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
