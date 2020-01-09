import { RecurrenceRule } from 'node-schedule';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Chat extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column('jsonb')
  settings: {
    mornings: {
      notifications: boolean;
      notificationRule: RecurrenceRule;
    };
  };

  constructor() {
    super();

    const rule = new RecurrenceRule();
    rule.hour = 7;

    this.settings = {
      mornings: {
        notifications: false,
        notificationRule: rule,
      },
    };
  }
}
