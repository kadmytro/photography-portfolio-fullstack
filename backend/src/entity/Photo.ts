import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "PhotoSet" })
export class Photo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("bytea")
  photo!: Buffer;

  @Column("int", { array: true })
  categoriesIds!: number[];

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

  @Column({default: 'image/jpeg'})
  mimeType!: string;

  getPhotoWithBase64(): any {
    return {
      id: this.id,
      categoriesIds: this.categoriesIds,
      location: this.location,
      caption: this.caption,
      date: this.date,
      height: this.height,
      width: this.width,
      mimeType: this.mimeType,
      photo: this.photo.toString('base64')
    };
  }

  getPhotoMetadata() {
    return {
      id: this.id,
      categoriesIds: this.categoriesIds,
      location: this.location,
      caption: this.caption,
      date: this.date,
      height: this.height,
      width: this.width,
      mimeType: this.mimeType,
    }
  }
}