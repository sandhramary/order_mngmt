import { Request, Response } from "express";

import { OrderService } from "./order.service.js";
import { OrderStatus } from "./order.types.js";

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  async getOrders(req: Request, res: Response) {
    const { userId } = req.params;
    const status = req.query.status as OrderStatus;

    try {
      const orders = await this.orderService.getOrders(userId, status);
      if (!orders) {
        res.status(404).send();
        return;
      }
      res.send(orders);
    } catch {
      res.status(500).send();
    }
  }

  async getOrderById(req: Request, res: Response) {
    const { userId, orderId } = req.params;
    if (!orderId || !userId) {
      res.status(400).send({ error: "Invalid user or order" });
      return;
    }
    try {
      const orderDetails = await this.orderService.getOrderById(
        userId,
        orderId
      );
      if (!orderDetails) {
        res.status(400).send({ error: "Invalid user or order" });
        return;
      }
      res.send(orderDetails);
    } catch {
      res.status(500).send();
    }
  }

  async orderCheckout(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const orderDetails = await this.orderService.orderCheckout(userId);
      if (orderDetails) {
        res.send({ message: "Order created", ...orderDetails });
      }
      res.status(500).send();
    } catch {
      res.status(500).send();
    }
  }

  async buyNow(req: Request, res: Response) {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      res.status(400).send({ error: "Invalid input" });
      return;
    }

    try {
      const orderDetails = await this.orderService.buyNow(
        userId,
        productId,
        quantity
      );
      if (orderDetails) {
        res.send({ message: "Order created", ...orderDetails });
      }
      res.status(500).send();
    } catch {
      res.status(500).send();
    }
  }

  async orderSuccess(req: Request, res: Response) {
    const { userId, orderId } = req.params;
    try {
      if (!orderId) {
        res.status(404).send({ error: "Invalid order" });
        return;
      }
      const response = await this.orderService.orderSuccess(userId, orderId);
      res.send(response);
    } catch {
      res.status(500).send();
    }
  }

  async orderFailure(req: Request, res: Response) {
    const { userId, orderId } = req.params;
    try {
      if (!orderId) {
        res.status(404).send({ error: "Invalid order" });
        return;
      }
      const response = await this.orderService.orderFailure(userId, orderId);
      res.send(response);
    } catch {
      res.status(500).send();
    }
  }

  async orderExpire(req: Request, res: Response) {
    const { userId, orderId } = req.params;
    try {
      if (!orderId) {
        res.status(404).send({ error: "Invalid order" });
        return;
      }
      const response = await this.orderService.orderExpire(userId, orderId);
      res.send(response);
    } catch {
      res.status(500).send();
    }
  }
}
