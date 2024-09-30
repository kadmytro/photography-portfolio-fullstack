import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity({ name: "ContactRequestSet" })
export class ContactRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  subject!: string;

  @Column("text")
  message!: string;

  @CreateDateColumn()
  date!: Date;

  @Column({ default: true })
  isNew!: boolean;
}
