import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Chat extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column('jsonb')
  settings: {
    mornings: {
      notifications: boolean;
    };
  };

  constructor() {
    super();
    this.settings = {
      mornings: {
        notifications: false,
      },
    };
  }
}
