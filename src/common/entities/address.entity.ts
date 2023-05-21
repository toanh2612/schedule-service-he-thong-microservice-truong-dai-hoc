import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { ClassPeriodEntity } from "./classPeriod.entity";

@Entity("address")
export class AddressEntity {
	@PrimaryGeneratedColumn("uuid", {
		name: "id",
	})
	id: string;

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

	@OneToMany(() => ClassPeriodEntity, (classPeriod) => classPeriod.address, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	classPeriods: ClassPeriodEntity[];
}
