import { IDomainEvent } from "./../../../shared/domain/events/domain-event.interface";

export class ConfirmeMeasureValueEvent implements IDomainEvent {
  aggregate_id: string;
  occurred_on: Date;
  readonly confirmed_value: number;

  constructor(aggregate_id: string, confirmed_value: number) {
    this.aggregate_id = aggregate_id;
    this.occurred_on = new Date();
    this.confirmed_value = confirmed_value;
  }
}
