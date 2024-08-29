import { Sequelize, SequelizeOptions } from "sequelize-typescript";

export function setupSequelize(models: SequelizeOptions = {}) {
  let _sequelize: Sequelize;

  beforeAll(async () => {
    _sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      ...models,
    });
  });

  beforeEach(async () => await _sequelize.sync({ force: true }));

  afterAll(async () => await _sequelize.close());

  return {
    get sequelize() {
      return _sequelize;
    },
  };
}
