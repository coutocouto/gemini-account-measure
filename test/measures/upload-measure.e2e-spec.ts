import { INestApplication } from "@nestjs/common";
import { getConnectionToken } from "@nestjs/sequelize";
import { TestingModule, Test } from "@nestjs/testing";
import { Sequelize } from "sequelize";
import { AppModule } from "../../src/app.module";
import { MeasureRepository } from "../../src/measure/infra/db/measure.repository";
import { applyGlobalConfig } from "../../src/shared/global-config";
import request from "supertest";
import { Measure } from "../../src/measure/domain/measure.entity";

describe("/upload (POST)", () => {
  let app: INestApplication;
  let repo: MeasureRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const sequelize = moduleFixture.get<Sequelize>(getConnectionToken());

    await sequelize.sync({ force: true });

    repo = moduleFixture.get<MeasureRepository>(MeasureRepository);

    app = moduleFixture.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  // TODO: google api dont't work all times
  // it("should upload a measure", async () => {
  //   const customerCode = "123e4567-e89b-12d3-a456-426614174001";
  //   const measureDateTime = "2021-01-01T00:00:00.000Z";
  //   const measureType = "WATER";

  //   const res = await request(app.getHttpServer())
  //     .post("/upload")
  //     .field("customer_code", customerCode)
  //     .field("measure_datetime", measureDateTime)
  //     .field("measure_type", measureType)
  //     .attach("image", Buffer.from("image content"), "image.jpg");
  //   console.log("🚀 ~ it ~ res:", res.body);

  //   expect(res.status).toBe(201);
  // });

  it("should return 422 if the file is not an image", async () => {
    const customerCode = "123e4567-e89b-12d3-a456-426614174001";
    const measureDateTime = "2021-01-01T00:00:00.000Z";
    const measureType = "WATER";

    const res = await request(app.getHttpServer())
      .post("/upload")
      .field("customer_code", customerCode)
      .field("measure_datetime", measureDateTime)
      .field("measure_type", measureType)
      .attach("image", Buffer.from("image content"), "image.txt");

    expect(res.status).toBe(422);
  });

  it("should return 422 other params are invalid", async () => {
    const customerCode = "123e4567-e89b-12d3-a456-426614174001";
    const measureDateTime = "2021-01-01T00:00:00.000Z";

    const res = await request(app.getHttpServer())
      .post("/upload")
      .field("customer_code", customerCode)
      .field("measure_datetime", measureDateTime)
      .field("measure_type", "INVALID")
      .attach("image", Buffer.from("image content"), "image.jpg");

    expect(res.status).toBe(422);
  });

  it("should return 409 if measure already exist for this month and this type", async () => {
    const aMeasure = Measure.fake()
      .aMeasure()
      .withCustomerCode("123e4567-e89b-12d3-a456-426614174001")
      .withMeasureDateTime(new Date("2021-01-01T00:00:00.000Z"))
      .withMeasureType("WATER")
      .build();

    await repo.save(aMeasure);

    const customerCode = "123e4567-e89b-12d3-a456-426614174001";
    const measureDateTime = "2021-01-01T00:00:00.000Z";
    const measureType = "WATER";

    const res = await request(app.getHttpServer())
      .post("/upload")
      .field("customer_code", customerCode)
      .field("measure_datetime", measureDateTime)
      .field("measure_type", measureType)
      .attach("image", Buffer.from("image content"), "image.jpg");

    expect(res.status).toBe(409);
  });
});
