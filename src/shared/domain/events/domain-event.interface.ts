export interface IDomainEvent {
  aggregate_id: string;
  occurred_on: Date;
}

export interface IIntegrationEvent<T = any> {
  event_version: number;
  occurred_on: Date;
  payload: T;
  event_name: string;
}
