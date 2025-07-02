import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Order } from "./Order.js";
import { Product } from "../products/product.entity.js";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int", { nullable: false })
  quantity: number;

  @Column("decimal", { nullable: false })
  priceAtPurchase: number;

  @ManyToOne("Order")
  @JoinColumn({ name: "orderId" })
  order: Order;

  @ManyToOne("Product")
  @JoinColumn({ name: "productId" })
  product: Product;
}
