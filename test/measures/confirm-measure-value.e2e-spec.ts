import { INestApplication } from "@nestjs/common";
import { getConnectionToken } from "@nestjs/sequelize";
import { TestingModule, Test } from "@nestjs/testing";
import { Sequelize } from "sequelize";
import { AppModule } from "../../src/app.module";
import { MeasureRepository } from "../../src/measure/infra/db/measure.repository";
import { applyGlobalConfig } from "../../src/shared/global-config";
import request from "supertest";
import { Measure } from "../../src/measure/domain/measure.entity";
import { ConfirmMeasureValueInput } from "../../src/measure/application/use-cases/confirm-measure-value/confirm-measure-value.input";

describe("/confirm (POST)", () => {
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

  it("should return 201 when measure is confirmed", async () => {
    const measure = Measure.fake().aMeasure().build();
    await repo.save(measure);
    const input = new ConfirmMeasureValueInput(measure.measureId, 10);

    const res = await request(app.getHttpServer()).post("/confirm").send(input);

    expect(res.status).toBe(201);

    const updatedMeasure = await repo.findByID(measure.measureId);

    expect(updatedMeasure.hasConfirmed).toBe(true);
    expect(updatedMeasure.measureValue).toBe(10);
  });

  it("should return 404 when measure is not found", async () => {
    const input = new ConfirmMeasureValueInput(
      "404a0d3b-8560-48cb-8937-b312badfd3c9",
      10,
    );

    return request(app.getHttpServer())
      .post("/confirm")
      .send(input)
      .expect(404);
  });

  it("should return 409 when measure is already confirmed", async () => {
    const measure = Measure.fake().aMeasure().build();
    measure.confirmValue(10);
    await repo.save(measure);
    const input = new ConfirmMeasureValueInput(measure.measureId, 10);

    return request(app.getHttpServer())
      .post("/confirm")
      .send(input)
      .expect(409);
  });

  it("should return 422 when measure value is invalid", async () => {
    const measure = Measure.fake().aMeasure().build();
    await repo.save(measure);

    return request(app.getHttpServer())
      .post("/confirm")
      .send({
        measure_id: "123",
        confirmed_value: null,
      })
      .expect(400);
  });
});
