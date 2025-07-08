import { Product } from "../product/product.entity";

export type OrderStatus = "pending" | "success" | "failed" | "discard";

export type OrderItemType = {
  quantity: number;
  priceAtPurchase: number;
  product: Product;
};
