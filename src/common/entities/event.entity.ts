import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("event")
export class EventEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // @Column({
  //   type: "uuid",
  // })
  // aggregateId: string;

  @Column({
    type: "integer",
  })
  version: number;

  @Column({
    type: "varchar",
    name: "event_type",
  })
  eventType: string;

  @Column("jsonb")
  payload: Record<string, any>;

  @CreateDateColumn({
    type: "timestamp",
    name: "created_date",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: "timestamp",
    name: "updated_date",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedDate: Date;
}
