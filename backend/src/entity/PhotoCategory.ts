import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Photo } from "./Photo";

@Entity({ name: "PhotoCategorySet" })
export class PhotoCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;
}
