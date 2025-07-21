import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Product } from "../product/product.entity.js";
import { Order } from "./order.entity.js";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int", { nullable: false })
  quantity: number;

  @Column("decimal", { nullable: false })
  priceAtPurchase: number;

  @ManyToOne("Order", { onDelete: "CASCADE" })
  @JoinColumn({ name: "orderId" })
  order: Order;

  @ManyToOne("Product")
  @JoinColumn({ name: "productId" })
  product: Product;
}
