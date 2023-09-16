import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("UserTable")
export class UserTable {
  @PrimaryColumn()
  Username!: string;

  @Column()
  Password!: string;
}
