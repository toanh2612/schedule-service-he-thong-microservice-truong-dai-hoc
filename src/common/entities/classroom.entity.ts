import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	// JoinColumn,
	// ManyToOne,
	// OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { ClassPeriodEntity } from "./classPeriod.entity";
import { SubjectEntity } from "./subject.entity";

@Entity("classroom")
export class ClassroomEntity {
	@PrimaryGeneratedColumn("uuid", {
		name: "id",
	})
	id: string;
	@Column({
		type: "uuid",
		name: "subject_id",
	})
	subjectId: string;

	@Column("varchar", {
		name: "name",
		nullable: false,
	})
	name: string;

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

	@ManyToOne(() => SubjectEntity, (subject) => subject.classrooms, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({
		name: "subject_id",
		referencedColumnName: "id",
	})
	subject: SubjectEntity;

	@ManyToOne(() => ClassPeriodEntity, (classPeriod) => classPeriod.classroom, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	classPeriods: ClassPeriodEntity;
}
