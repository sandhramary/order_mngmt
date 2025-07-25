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

import { OrderItem } from "./orderItem.entity.js";
import { User } from "../user/user.entity.js";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne("User", { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany("OrderItem", "order", { cascade: true })
  orderItems: OrderItem[];

  @Column("varchar", { default: "pending" })
  status: "pending" | "success" | "failed" | "discard";

  @Column("varchar", { default: "cart" })
  orderType: "cart" | "buy-now";

  @Column("decimal", { nullable: false })
  totalAmount: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
