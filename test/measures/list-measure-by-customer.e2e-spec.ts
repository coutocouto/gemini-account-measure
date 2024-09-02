import { INestApplication } from "@nestjs/common";
import { AppModule } from "../../src/app.module";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import { getConnectionToken } from "@nestjs/sequelize";
import { applyGlobalConfig } from "../../src/shared/global-config";
import { MeasureRepository } from "../../src/measure/infra/db/measure.repository";
import request from "supertest";
import { Measure } from "../../src/measure/domain/measure.entity";

describe("/:customer_code/list (GET)", () => {
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

  it("should return 404 when no measures are found", () => {
    return request(app.getHttpServer())
      .get("/404a0d3b-8560-48cb-8937-b312badfd3c9/list")
      .expect(404);
  });

  it("should return 200 when measures are found", async () => {
    const measure = Measure.fake()
      .aMeasure()
      .withCustomerCode("404a0d3b-8560-48cb-8937-b312badfd3c9")
      .build();
    const measure2 = Measure.fake().aMeasure().withCustomerCode("321").build();

    await repo.save(measure);
    await repo.save(measure2);

    const res = await request(app.getHttpServer()).get(
      "/404a0d3b-8560-48cb-8937-b312badfd3c9/list",
    );

    expect(res.status).toBe(200);
    expect(res.body.customer_code).toBe(measure.customerCode);
    expect(res.body.measures.length).toBe(1);
    expect(res.body.measures[0].measure_id).toBe(measure.measureId);
    expect(res.body.measures[0].measure_type).toBe(measure.measureType);
    expect(res.body.measures[0].has_confirmed).toBe(measure.hasConfirmed);
    expect(res.body.measures[0].image_uri).toBe(measure.imageUri);
  });

  it("should return 200 when measures are found with params", async () => {
    const measure = Measure.fake()
      .aMeasure()
      .withCustomerCode("404a0d3b-8560-48cb-8937-b312badfd3c9")
      .withMeasureType("GAS")
      .build();
    const measure2 = Measure.fake()
      .aMeasure()
      .withCustomerCode("404a0d3b-8560-48cb-8937-b312badfd3c9")
      .withMeasureType("WATER")
      .build();

    await repo.save(measure);
    await repo.save(measure2);

    const res = await request(app.getHttpServer()).get(
      "/404a0d3b-8560-48cb-8937-b312badfd3c9/list?measure_type=WATER",
    );

    expect(res.status).toBe(200);
    expect(res.body.customer_code).toBe(measure.customerCode);
    expect(res.body.measures.length).toBe(1);
    expect(res.body.measures[0].measure_id).toBe(measure2.measureId);
    expect(res.body.measures[0].measure_type).toBe(measure2.measureType);
    expect(res.body.measures[0].has_confirmed).toBe(measure2.hasConfirmed);
    expect(res.body.measures[0].image_uri).toBe(measure2.imageUri);
  });

  it("should return 422 when invalid measure type are passed", async () => {
    return request(app.getHttpServer())
      .get("/404a0d3b-8560-48cb-8937-b312badfd3c9/list?measure_type=INVALID")
      .expect(422);
  });

  it("should return 422 when invalid customer code are passed", async () => {
    return request(app.getHttpServer())
      .get("/123/list?measure_type=WATER")
      .expect(422);
  });
});
