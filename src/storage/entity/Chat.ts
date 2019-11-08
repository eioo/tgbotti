import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Chat extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({
    type: 'jsonb',
  })
  settings: {
    weather: {
      notifications: boolean;
    };
  };

  constructor(id: number) {
    super();
    this.id = id;
    this.settings = {
      weather: {
        notifications: false,
      },
    };
  }
}
