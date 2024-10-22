import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";

import { PhotoCategory } from "./PhotoCategory";

@Entity({ name: "PhotoSet" })
export class Photo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("bytea")
  photo!: Buffer;

  @Column("bytea")
  photoMobile!: Buffer;

  @Column("bytea")
  photoBlurred!: Buffer;

  @ManyToMany(() => PhotoCategory, (category) => category.photos, {
    cascade: true,
  })
  @JoinTable({ name: "photo_category_links" })
  categories!: PhotoCategory[];

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  caption?: string;

  @Column("date", { nullable: true })
  date?: Date | null;

  @Column("int")
  height!: number;

  @Column("int")
  width!: number;

  @Column({ default: "image/jpeg" })
  mimeType!: string;

  getPhotoWithBase64(): any {
    return {
      id: this.id,
      categoriesIds: this.categories?.map((category) => category.id) ?? [],
      location: this.location,
      caption: this.caption,
      date: this.date,
      height: this.height,
      width: this.width,
      mimeType: this.mimeType,
      photo: this.photo.toString("base64"),
    };
  }

  getPhotoMetadata() {
    return {
      id: this.id,
      categoriesIds: this.categories?.map((category) => category.id)?? [],
      location: this.location,
      caption: this.caption,
      date: this.date,
      height: this.height,
      width: this.width,
      mimeType: this.mimeType,
    };
  }
}
