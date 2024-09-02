import { ListMeasureByCustomerOutput } from "../../../../application/use-cases/list-measure-by-customer/list-measure-by-customer.output";
import { MeasurePresenter } from "../measure.presenter";

describe("MeasurePresenter Unit Test", () => {
  let presenter: MeasurePresenter;
  let customerCode: string;
  let measures: ListMeasureByCustomerOutput[];

  beforeAll(() => {
    customerCode = "customer_code";
    measures = [
      {
        measure_id: "measure_id",
        image_uri: "image_uri",
        measure_value: 10,
        has_confirmed: false,
        measure_type: "WATER",
        measure_datetime: new Date().toISOString(),
      },
    ];
  });

  beforeEach(() => {
    presenter = new MeasurePresenter(customerCode, measures);
  });

  it("should be defined", () => {
    expect(presenter).toBeDefined();
  });

  it("should have a customer_code property", () => {
    expect(presenter.customer_code).toBe(customerCode);
  });

  it("should have a measures property", () => {
    expect(presenter.measures).toBe(measures);
  });
});
