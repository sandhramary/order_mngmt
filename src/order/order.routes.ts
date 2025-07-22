import { Router } from "express";

import { OrderController } from "./order.controller.js";
import { OrderService } from "./order.service.js";
import { OrderRepository } from "./order.repository.js";
import { CartRepository } from "../cart/cart.repository.js";
import { ProductRepository } from "../product/product.repository.js";
import { auth } from "../middleware/auth.js";

const router = Router();

const cartRepository = new CartRepository();
const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const orderService = new OrderService(
  orderRepository,
  cartRepository,
  productRepository
);
const orderController = new OrderController(orderService);

router.get("/orders", auth, async (req, res) =>
  orderController.getOrders(req, res)
);

router.get("/orders/:orderId", auth, async (req, res) =>
  orderController.getOrderById(req, res)
);

router.post("/order/checkout", auth, async (req, res) =>
  orderController.orderCheckout(req, res)
);

router.post("/order/buy-now", auth, async (req, res) =>
  orderController.buyNow(req, res)
);

router.patch("/order/payment-success/:userId/:orderId", auth, async (req, res) =>
  orderController.orderSuccess(req, res)
);

router.patch("/order/payment-failure/:userId/:orderId", auth, async (req, res) =>
  orderController.orderFailure(req, res)
);

router.patch("/order/expire/:userId/:orderId", auth, async (req, res) =>
  orderController.orderExpire(req, res)
);

export default router;
