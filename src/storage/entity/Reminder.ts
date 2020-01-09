import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { base64Transformer } from '../base64Transformer';

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
