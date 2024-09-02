import { fa, faker } from "@faker-js/faker";
import { Measure, MeasureProps } from "./measure.entity";
import { v4 as uuidv4 } from "uuid";

class MeasureFakerBuilder {
  private measureProps: MeasureProps;

  private constructor() {
    this.measureProps = {
      measureId: uuidv4().toString(),
      imageUri: faker.image.url(),
      customerCode: faker.string.uuid(),
      measureValue: faker.number.float(),
      hasConfirmed: false,
      measureType: faker.helpers.arrayElement(["WATER", "GAS"]),
      measureDateTime: faker.date.recent(),
    };
  }

  static aMeasure(): MeasureFakerBuilder {
    return new MeasureFakerBuilder();
  }

  withMeasureId(measureId: string): MeasureFakerBuilder {
    this.measureProps.measureId = measureId;
    return this;
  }

  withImageUri(imageUri: string): MeasureFakerBuilder {
    this.measureProps.imageUri = imageUri;
    return this;
  }

  withCustomerCode(customerCode: string): MeasureFakerBuilder {
    this.measureProps.customerCode = customerCode;
    return this;
  }

  withMeasureValue(measureValue: number): MeasureFakerBuilder {
    this.measureProps.measureValue = measureValue;
    return this;
  }

  withHasConfirmed(): MeasureFakerBuilder {
    this.measureProps.hasConfirmed = true;
    return this;
  }

  withMeasureType(measureType: "WATER" | "GAS"): MeasureFakerBuilder {
    this.measureProps.measureType = measureType;
    return this;
  }

  withMeasureDateTime(measureDateTime: Date): MeasureFakerBuilder {
    this.measureProps.measureDateTime = measureDateTime;
    return this;
  }

  build(): Measure {
    return Measure.from(this.measureProps);
  }
}

export { MeasureFakerBuilder };
