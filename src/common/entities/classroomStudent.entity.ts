import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { ClassroomEntity } from "./classroom.entity";

@Entity("classroom_student")
export class ClassroomStudentEntity {
	@PrimaryGeneratedColumn("uuid", {
		name: "id",
	})
	id: string;

	@Column({
		type: "uuid",
		name: "student_id",
	})
	studentId: string;

	@Column({
		type: "uuid",
		name: "classroom_id",
	})
	classroomId: string;

	@ManyToOne(() => ClassroomEntity, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({
		name: "classroom_id",
	})
	classroom: ClassroomEntity;
}
