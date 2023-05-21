import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ClassroomEntity } from "./classroom.entity";

@Entity("subject")
export class SubjectEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @Column("varchar", {
    name: "name",
    nullable: false,
  })
  name: string;

  @Column("integer", {
    name: "number_of_credits",
    nullable: true,
  })
  numberOfCredits: number;

  @Column("varchar", {
    name: "description",
    nullable: true,
  })
  description: string;

  @Column({
    name: "is_deleted",
    default: false,
  })
  isDeleted: boolean;

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

  @OneToMany(() => ClassroomEntity, (classroom) => classroom.subject, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  classrooms: ClassroomEntity[];
}
