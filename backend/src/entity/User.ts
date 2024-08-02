import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: "UserSet" })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column()
  role!: string;
  
  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}

