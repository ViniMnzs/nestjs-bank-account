export type EventType = 'deposit' | 'withdraw' | 'transfer';

export class EventDto {
  type: EventType;
  origin?: string;
  destination?: string;
  amount: number;
}
