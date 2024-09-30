import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "ServiceSet" })
export class Service {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  price!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column("bytea")
  image!: Buffer;

  @Column({ nullable: true })
  ordinal!: number;

  getServiceDetails() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      price: this.price,
      isActive: this.isActive,
      ordinal: this.ordinal,
    };
  }
}
