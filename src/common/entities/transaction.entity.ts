import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity("transaction")
export class TransactionEntity {
	@PrimaryGeneratedColumn("uuid", {
		name: "id",
	})
	id: string;

	@Column({
		name: "status",
		nullable: false,
	})
	status: string;

	@Column({
		name: "original_data",
		nullable: true,
	})
	originalData: string;

	@Column({
		name: "updated_data",
		nullable: true,
	})
	updatedData: string;

	@Column()
	compensateId: number;

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
