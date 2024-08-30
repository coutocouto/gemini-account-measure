import { v4 as uuidv4 } from "uuid";
import { MeasureFakerBuilder } from "./measure-fake.builder";

export type MeasureProps = {
  measureId: string;
  imageUri: string;
  customerCode: string;
  measureValue: number;
  hasConfirmed: boolean;
  measureType: "WATER" | "GAS";
  measureDateTime: Date;
};

export type MeasureCommand = {
  imageUri: string;
  customerCode: string;
  measureValue: number;
  measureType: "WATER" | "GAS";
};

export class Measure {
  measureId: string;
  imageUri: string;
  customerCode: string;
  measureValue: number;
  hasConfirmed: boolean;
  measureType: "WATER" | "GAS";
  measureDateTime: Date;

  private constructor(props: MeasureProps) {
    this.measureId = props.measureId;
    this.imageUri = props.imageUri;
    this.customerCode = props.customerCode;
    this.measureValue = props.measureValue;
    this.hasConfirmed = props.hasConfirmed;
    this.measureDateTime = props.measureDateTime;
    this.measureType = props.measureType;
  }

  static create(props: MeasureCommand): Measure {
    return new Measure({
      measureId: uuidv4().toString(),
      imageUri: props.imageUri,
      customerCode: props.customerCode,
      measureValue: props.measureValue,
      hasConfirmed: false,
      measureType: props.measureType,
      measureDateTime: new Date(),
    });
  }

  static from(props: MeasureProps): Measure {
    return new Measure(props);
  }

  static fake() {
    return MeasureFakerBuilder;
  }

  confirm() {
    this.hasConfirmed = true;
  }
}
