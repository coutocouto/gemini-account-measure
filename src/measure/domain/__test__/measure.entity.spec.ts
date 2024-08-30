import { Measure } from "../measure.entity";

describe("MeasureRepository Unit Test", () => {
  it("should create a measure", () => {
    const measure = Measure.create({
      imageUri: "string",
      customerCode: "string",
      measureValue: 1,
      measureType: "GAS",
    });

    expect(measure.measureId).toBeDefined();
    expect(measure.imageUri).toBe("string");
    expect(measure.customerCode).toBe("string");
    expect(measure.measureValue).toBe(1);
    expect(measure.hasConfirmed).toBeFalsy();
    expect(measure.measureType).toBe("GAS");
    expect(measure.measureDateTime).toBeDefined();
  });

  it("should create a measure from props", () => {
    const measure = Measure.from({
      measureId: "string",
      imageUri: "string",
      customerCode: "string",
      measureValue: 1,
      hasConfirmed: false,
      measureType: "GAS",
      measureDateTime: new Date(),
    });

    expect(measure.measureId).toBe("string");
    expect(measure.imageUri).toBe("string");
    expect(measure.customerCode).toBe("string");
    expect(measure.measureValue).toBe(1);
    expect(measure.hasConfirmed).toBeFalsy();
    expect(measure.measureType).toBe("GAS");
    expect(measure.measureDateTime).toBeDefined();
  });

  it("should confirm a measure", () => {
    const measure = Measure.create({
      imageUri: "string",
      customerCode: "string",
      measureValue: 1,
      measureType: "GAS",
    });

    measure.confirm();

    expect(measure.hasConfirmed).toBeTruthy();
  });

  it("should create a fake measure", () => {
    const measure = Measure.fake().aMeasure().build();

    expect(measure.measureId).toBeDefined();
    expect(measure.imageUri).toBeDefined();
    expect(measure.customerCode).toBeDefined();
    expect(measure.measureValue).toBeDefined();
    expect(measure.hasConfirmed).toBeDefined();
    expect(measure.measureType).toBeDefined();
    expect(measure.measureDateTime).toBeDefined();
  });
});
