import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { nullable: false, length: 255 })
  name: string;

  @Column("text")
  description: string;

  @Column("decimal", { nullable: false })
  price: number;

  @Column("int", { default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
}
