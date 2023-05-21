import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { ClassroomEntity } from "./classroom.entity";

@Entity("classroom_teacher")
export class ClassroomTeacherEntity {
	@PrimaryGeneratedColumn("uuid", {
		name: "id",
	})
	id: string;

	@Column({
		type: "uuid",
		name: "teacher_id",
	})
	teacherId: string;

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
