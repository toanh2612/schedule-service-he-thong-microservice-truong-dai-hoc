import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { ClassPeriodEntity } from "./classPeriod.entity";

@Entity("class_period_time_range")
export class ClassPeriodTimeRangeEntity {
	@PrimaryGeneratedColumn("uuid", {
		name: "id",
	})
	id: string;

	@Column({
		name: "number_index",
		nullable: false,
		type: "integer",
	})
	numberIndex: number;

	@Column({
		name: "start_time",
		nullable: false,
		type: "time",
	})
	startTime: string;

	@Column({
		name: "end_time",
		nullable: false,
		type: "time",
	})
	endTime: string;

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

	@OneToMany(
		() => ClassPeriodEntity,
		(classPeriod) => classPeriod.classPeriodTimeRange,
		{
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		}
	)
	classPeriods: ClassPeriodEntity[];
}
