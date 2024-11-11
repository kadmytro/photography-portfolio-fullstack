import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "SettingSet" })
export class Setting {
  @PrimaryGeneratedColumn()
  id!: number;

  // Unique key for each setting
  @Column({ type: "varchar", unique: true })
  key!: string;

  @Column({ type: "jsonb" })
  value!: any;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt!: Date;
}
