import { v4 as uuidv4 } from "uuid";
import { MeasureFakerBuilder } from "./measure-fake.builder";
import { AggregateRoot } from "../../shared/domain/aggregate-root";
import { ConfirmeMeasureValueEvent } from "./domain-events/confirmed-measure-value.event";

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

export class Measure extends AggregateRoot {
  measureId: string;
  imageUri: string;
  customerCode: string;
  measureValue: number;
  hasConfirmed: boolean;
  measureType: "WATER" | "GAS";
  measureDateTime: Date;

  private constructor(props: MeasureProps) {
    super();
    this.measureId = props.measureId;
    this.imageUri = props.imageUri;
    this.customerCode = props.customerCode;
    this.measureValue = props.measureValue;
    this.hasConfirmed = props.hasConfirmed;
    this.measureDateTime = props.measureDateTime;
    this.measureType = props.measureType;
    this.registerHandler(
      ConfirmeMeasureValueEvent.name,
      this.onValueHasConfirmed.bind(this),
    );
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

  onValueHasConfirmed(event: ConfirmeMeasureValueEvent) {
    this.hasConfirmed = true;
    this.measureValue = event.confirmed_value;
  }

  confirmValue(value: number) {
    this.applyEvent(new ConfirmeMeasureValueEvent(this.measureId, value));
  }
}
