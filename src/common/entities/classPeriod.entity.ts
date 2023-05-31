import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AddressEntity } from "./address.entity";
import { AttendanceEntity } from "./attendance.entity";
import { ClassPeriodTimeRangeEntity } from "./classPeriodTimeRange.entity";
import { ClassroomEntity } from "./classroom.entity";

@Entity("class_period")
export class ClassPeriodEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @Column("uuid", {
    name: "address_id",
    nullable: false,
  })
  addressId: string;

  @Column("uuid", {
    name: "class_period_time_range_id",
    nullable: false,
  })
  classPeriodTimeRangeId: string;

  @Column("uuid", {
    name: "classroom_id",
    nullable: false,
  })
  classroomId: string;

  @Column({
    name: "date_time",
    nullable: true,
    type: "date",
  })
  dateTime: string;

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

  @ManyToOne(() => ClassroomEntity, (classroom) => classroom.classPeriods, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "classroom_id" })
  classroom: ClassroomEntity[];

  @ManyToOne(() => AddressEntity, (address) => address.classPeriods, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "address_id" })
  address: AddressEntity;

  @ManyToOne(
    () => ClassPeriodTimeRangeEntity,
    (classPeriodTimeRange) => classPeriodTimeRange.classPeriods,
    {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  @JoinColumn({ name: "class_period_time_range_id" })
  classPeriodTimeRange: ClassPeriodTimeRangeEntity;

  @OneToMany(() => AttendanceEntity, (attendance) => attendance.classPeriod, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  attendances: AttendanceEntity[];
}
