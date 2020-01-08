import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reminder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  chatId: string;

  @Column()
  date: Date;

  @Column()
  text: string;

  @Column()
  askerName: string;

  @Column()
  askerId: string;

  @Column({ default: false })
  notified: boolean;
}
