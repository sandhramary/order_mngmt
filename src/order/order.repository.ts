import AppDataSource from "../db/data-source.js";
import { Product } from "../product/product.entity.js";
import { Order } from "./order.entity.js";
import { OrderItemType, OrderStatus } from "./order.types.js";

export class OrderRepository {
  private orderRepo = AppDataSource.getRepository(Order);

  async getOrders(userId: number, status?: OrderStatus) {
    return this.orderRepo.find({
      where: { user: { id: userId }, status: status },
      relations: ["orderItems", "orderItems.product"],
    });
  }

  async getOrderById(orderId: number, userId?: number) {
    return this.orderRepo.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: ["orderItems", "orderItems.product"],
    });
  }

  async discardOrder(orderId: number) {
    const order = await this.getOrderById(orderId);
    if (order) {
      order.status = "discard";
      return this.orderRepo.save(order);
    }
    return null;
  }

  async orderCheckout(
    userId: number,
    orderItems: OrderItemType[],
    total: number
  ) {
    if (orderItems?.length > 0 || userId) {
      const order = this.orderRepo.create({
        totalAmount: total,
        orderItems,
        user: { id: userId },
        status: "pending",
      });

      const savedOrder = await this.orderRepo.save(order);

      return this.getOrderById(savedOrder.id);
    }
    return null;
  }

  async buyNow(userId: number, product: Product, quantity: number) {
    const order = this.orderRepo.create({
      user: { id: Number(userId) },
      totalAmount: Number(quantity) * product.price,
      orderType: "buy-now",
      orderItems: [
        {
          quantity: Number(quantity),
          priceAtPurchase: Number(product.price),
          product,
        },
      ],
    });
    const savedOrder = await this.orderRepo.save(order);

    return this.getOrderById(savedOrder.id);
  }

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    const order = await this.getOrderById(orderId);
    if (order) {
      order.status = status;
      await this.orderRepo.save(order);
    }
    return;
  }
}
