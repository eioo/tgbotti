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
      showTraffic: boolean;
    };
    traffic: {
      cameras: Array<{
        url: string;
        name: string;
      }>;
    };
  };

  constructor() {
    super();

    const rule = new RecurrenceRule();
    rule.hour = 7;
    rule.minute = 0;
    rule.second = 0;

    this.settings = {
      mornings: {
        notifications: false,
        notificationRule: rule,
        showTraffic: true,
      },
      traffic: {
        cameras: [],
      },
    };
  }
}
