import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("master_config")
export class MasterConfigEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "id",
  })
  id: string;

  @Column("varchar", {
    name: "key",
    nullable: false,
  })
  key: string;

  @Column("varchar", {
    name: "value",
    nullable: false,
  })
  value: string;

  @Column("varchar", {
    name: "type",
    nullable: false,
  })
  type: string;

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
}
