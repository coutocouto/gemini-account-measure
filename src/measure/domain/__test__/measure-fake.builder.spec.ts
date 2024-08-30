import { MeasureFakerBuilder } from "../measure-fake.builder";
import { Measure } from "../measure.entity";

describe("MeasureFakerBuilder Unit Test", () => {
  it("should create a Measure with default values", () => {
    const measure = MeasureFakerBuilder.aMeasure().build();

    expect(measure).toBeInstanceOf(Measure);
    expect(measure.measureId).toBeDefined();
    expect(measure.imageUri).toMatch(/^https?:\/\/.+/);
    expect(measure.customerCode).toMatch(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    );
    expect(measure.measureValue).toBeGreaterThanOrEqual(0);
    expect(typeof measure.hasConfirmed).toBe("boolean");
    expect(["WATER", "GAS"]).toContain(measure.measureType);
    expect(measure.measureDateTime).toBeInstanceOf(Date);
  });

  it("should create a Measure with custom values", () => {
    const customProps = {
      measureId: "custom-measure-id",
      imageUri: "http://example.com/custom-image.jpg",
      customerCode: "custom-customer-code",
      measureValue: 100.5,
      hasConfirmed: true,
      measureType: "GAS" as const,
      measureDateTime: new Date("2023-08-29T12:00:00Z"),
    };

    const measure = MeasureFakerBuilder.aMeasure()
      .withMeasureId(customProps.measureId)
      .withImageUri(customProps.imageUri)
      .withCustomerCode(customProps.customerCode)
      .withMeasureValue(customProps.measureValue)
      .withHasConfirmed(customProps.hasConfirmed)
      .withMeasureType(customProps.measureType)
      .withMeasureDateTime(customProps.measureDateTime)
      .build();

    expect(measure.measureId).toBe(customProps.measureId);
    expect(measure.imageUri).toBe(customProps.imageUri);
    expect(measure.customerCode).toBe(customProps.customerCode);
    expect(measure.measureValue).toBe(customProps.measureValue);
    expect(measure.hasConfirmed).toBe(customProps.hasConfirmed);
    expect(measure.measureType).toBe(customProps.measureType);
    expect(measure.measureDateTime).toBe(customProps.measureDateTime);
  });

  it("should allow partial customization and use default values for others", () => {
    const customImageUri = "http://example.com/partial-custom-image.jpg";
    const measure = MeasureFakerBuilder.aMeasure()
      .withImageUri(customImageUri)
      .build();

    expect(measure.imageUri).toBe(customImageUri);
    expect(measure.measureId).toBeDefined();
    expect(measure.customerCode).toMatch(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    );
    expect(measure.measureValue).toBeGreaterThanOrEqual(0);
    expect(["WATER", "GAS"]).toContain(measure.measureType);
    expect(measure.measureDateTime).toBeInstanceOf(Date);
  });
});
