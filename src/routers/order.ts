import express from "express";

import AppDataSource from "../db/data-source.js";
import { Order } from "../entities/Order.js";
import { Cart } from "../entities/Cart.js";
import { Product } from "../entities/Product.js";

const router = express.Router();

router.post("/order/checkout/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orderRepo = AppDataSource.getRepository(Order);
    const cartRepo = AppDataSource.getRepository(Cart);
    const productRepo = AppDataSource.getRepository(Product);

    // CASE: No cart
    const cart = await cartRepo.findOne({
      where: { user: { id: Number(userId) } },
      relations: ["cartItems", "cartItems.product"],
    });

    if (!cart || !cart.cartItems.length) {
      res.status(400).send({ error: "Cart is empty" });
      return;
    }

    // CASE: Active order
    const existingOrder = await orderRepo.findOne({
      where: { user: { id: Number(userId) }, status: "pending" },
    });

    if (existingOrder) {
      const createdAtTime = new Date(existingOrder.createdAt).getTime();
      const now = Date.now();

      const isExpired = now - createdAtTime > 15 * 60 * 1000; // Order is discarded after 15 mins


      console.log(
        new Date(),
        existingOrder.createdAt,
        isExpired,
        "times"
      );
      if (!isExpired) {
        res
          .status(400)
          .send({ error: "An active order already exists for this user" });
        return;
      }
      existingOrder.status = "discard";
      await orderRepo.save(existingOrder);
    }

    // Checkout cart
    let total = 0;
    const orderItems = [];
    for (const item of cart.cartItems) {
      const availableStock = item.product.stock;

      if (item.quantity > availableStock) {
        res
          .status(400)
          .send({ error: `Invalid quantity for product ${item.product.name}` });
        return;
      }

      total += item.quantity * Number(item.product.price);
      orderItems.push({
        quantity: item.quantity,
        priceAtPurchase: Number(item.product.price),
        product: item.product,
      });
    }

    if (orderItems?.length > 0) {
      const order = orderRepo.create({
        totalAmount: total,
        status: "pending",
        user: { id: Number(userId) },
        orderItems: orderItems,
      });

      const savedOrder = await orderRepo.save(order);
      const finalOrder = await orderRepo.findOne({
        where: { id: savedOrder.id },
        relations: ["orderItems", "orderItems.product"],
      });

      res.send(finalOrder);
    }
  } catch (e) {
    res.status(500).send({ error: "Something went wrong during checkout" });
  }
});

router.post("/order/buy-now/:userId", async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  const orderRepo = AppDataSource.getRepository(Order);
  const productRepo = AppDataSource.getRepository(Product);

  try {
    // Invalid product or quantity
    if (!productId || !quantity) {
      res.status(400).send({ error: "Invalid input" });
      return;
    }

    // Validate product
    const product = await productRepo.findOneBy({ id: productId });
    if (!product || product?.stock < quantity) {
      res.status(400).send({ error: "Invalid product or quantity" });
      return;
    }

    // CASE: Active order
    const existingOrder = await orderRepo.findOne({
      where: { user: { id: Number(userId) }, status: "pending" },
    });

    if (existingOrder) {
      res
        .status(400)
        .send({ error: "An active order already exists for this user" });
      return;
    }

    // Buy product
    const order = orderRepo.create({
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

    const savedOrder = await orderRepo.save(order);
    const updatedOrder = await orderRepo.findOne({
      where: { id: savedOrder.id },
      relations: ["orderItems", "orderItems.product"],
    });
    res.send(updatedOrder);
  } catch {
    res.status(500).send();
  }
});

router.get("/order/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const orderRepo = AppDataSource.getRepository(Order);

    const order = await orderRepo.find({
      where: { user: { id: Number(userId) } },
      relations: ["orderItems", "orderItems.product"],
    });

    if (!order?.length) {
      res.status(400).send({ error: "No orders" });
      return;
    }

    res.send(order);
  } catch {
    res.status(500).send();
  }
});

router.get("/order-history/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const orderRepo = AppDataSource.getRepository(Order);

    const orders = await orderRepo.find({
      where: { user: { id: Number(userId) } },
      relations: ["orderItems", "orderItems.product"],
    });

    const completedOrders = orders.filter(
      (order) => order.status === "success"
    );

    if (!completedOrders.length) {
      res.send([]);
      return;
    }

    res.send(completedOrders);
  } catch {
    res.status(500).send();
  }
});

router.post("/order/payment-success/:userId/:orderId", async (req, res) => {
  const { orderId, userId } = req.params;

  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const cartRepo = AppDataSource.getRepository(Cart);
    const productRepo = AppDataSource.getRepository(Product);

    const order = await orderRepo.findOne({
      where: { id: Number(orderId) },
      relations: ["orderItems", "orderItems.product"],
    });

    if (!order || order.status !== "pending") {
      res.status(404).send({ error: "Invalid order" });
      return;
    }

    if (order.orderType === "cart") {
      const existingCart = await cartRepo.findOneBy({
        user: { id: Number(userId) },
      });
      if (existingCart) await cartRepo.remove(existingCart);
    }

    await Promise.all(
      order.orderItems.map(async (item) => {
        const product = await productRepo.findOneBy({ id: item.product.id });

        if (product) {
          product.stock -= item.quantity;
          await productRepo.save(product);
        }
      })
    );

    order.status = "success";
    await orderRepo.save(order);

    const updatedOrder = orderRepo.findOneBy({ id: order.id });
    res.send(updatedOrder);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/order/payment-failure/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOneBy({ id: Number(orderId) });

    if (!order || order.status !== "pending") {
      res.status(404).send({ error: "Invalid order" });
      return;
    }

    order.status = "failed";
    await orderRepo.save(order);
    res.send("Payment failed");
  } catch {
    res.status(500).send();
  }
});

router.post("/order/expire/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOneBy({ id: Number(orderId) });

    if (!order || order.status === "discard") {
      res.status(404).send({ error: "Invalid order" });
      return;
    }

    order.status = "discard";
    await orderRepo.save(order);
    res.send("Order discarded");
  } catch {
    res.status(500).send();
  }
});

export default router;
