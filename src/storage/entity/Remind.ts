import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Remind extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  chatId: number;

  @Column()
  date: Date;

  @Column()
  text: string;

  @Column()
  askerName: string;

  @Column()
  askerId: string;
}
