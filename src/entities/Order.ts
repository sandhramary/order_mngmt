import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./User.js";
import { OrderItem } from "./OrderItem.js";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne("User")
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany("OrderItem", "order")
  orderItems: OrderItem[];

  @Column("varchar", { default: "pending" })
  status: string;

  @Column("decimal", { nullable: false })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
