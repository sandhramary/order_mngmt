import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Cart } from "./cart.entity.js";
import { Product } from "../product/product.entity.js";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne("Cart", { onDelete: "CASCADE" })
  @JoinColumn({ name: "cartId" })
  cart: Cart;

  @ManyToOne("Product")
  @JoinColumn({ name: "productId" })
  product: Product;

  @Column("int", { nullable: false })
  quantity: number;
}
