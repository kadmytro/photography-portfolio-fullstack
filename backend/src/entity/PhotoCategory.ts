import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Photo } from "./Photo";

@Entity({ name: "PhotoCategorySet" })
export class PhotoCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  ordinal!: number;
  
  @ManyToMany(() => Photo, (photo) => photo.categories)
  photos!: Photo[];
}
