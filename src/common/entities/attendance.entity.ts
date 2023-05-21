import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { ClassPeriodEntity } from "./classPeriod.entity";

@Entity("attendance")
export class AttendanceEntity {
	@PrimaryGeneratedColumn("uuid", {
		name: "id",
	})
	id: string;

	@Column({
		type: "uuid",
		name: "student_id",
		nullable: false,
	})
	studentId: string;

	@Column({
		type: "uuid",
		name: "class_period_id",
		nullable: false,
	})
	classPeriodId: string;

	@Column("varchar", {
		name: "description",
		nullable: true,
	})
	description: string;

	@Column({
		name: "is_joined",
		default: false,
	})
	isJoined: boolean;

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

	@ManyToOne(
		() => ClassPeriodEntity,
		(classPeriod) => classPeriod.attendances,
		{
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		}
	)
	@JoinColumn({ name: "class_period_id" })
	classPeriod: ClassPeriodEntity;
}
