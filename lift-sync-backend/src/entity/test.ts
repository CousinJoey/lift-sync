import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("user_table")
export class UserTable {
  @PrimaryGeneratedColumn("increment")
  user_id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password_encrypted!: string;
}
