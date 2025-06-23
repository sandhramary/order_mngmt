import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User.js";
import { CartItem } from "./CartItem.js";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany("CartItem", "cart")
  cartItems: CartItem[];

  @ManyToOne("User")
  @JoinColumn({ name: "userId" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
