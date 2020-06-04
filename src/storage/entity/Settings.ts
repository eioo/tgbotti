import { RecurrenceRule } from 'node-schedule';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

const defaultMorningsRule = new RecurrenceRule();
defaultMorningsRule.hour = 7;

@Entity()
export class Settings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('jsonb', {
    default: {
      mornings: {
        notifications: false,
        notificationRule: defaultMorningsRule,
      },
    },
  })
  mornings: {
    notifications: boolean;
    notificationRule: RecurrenceRule;
  };
}
