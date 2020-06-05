import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';

export const base64Transformer: ValueTransformer = {
  from: val => Buffer.from(val, 'base64').toString('ascii'),
  to: val => Buffer.from(val).toString('base64'),
};

@Entity()
export class Reminder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  chatId: string;

  @Column()
  date: Date;

  @Column({
    transformer: base64Transformer,
  })
  text: string;

  @Column()
  askerName: string;

  @Column()
  askerId: string;

  @Column({ default: false })
  notified: boolean;
}
