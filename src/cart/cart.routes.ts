import { Router } from "express";

import { CartController } from "./cart.controller.js";
import { CartService } from "./cart.service.js";
import { CartRepository } from "./cart.repository.js";
import { ProductRepository } from "../product/product.repository.js";
import { auth } from "../middleware/auth.js";

const router = Router();

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const cartService = new CartService(cartRepository, productRepository);
const cartController = new CartController(cartService);

router.get("/cart", auth, async (req, res) =>
  cartController.getUserCart(req, res)
);

router.post("/cart", auth, async (req, res) =>
  cartController.addCartItem(req, res)
);

router.patch("/cart/:cartId/:productId", auth, async (req, res) =>
  cartController.updateCartItem(req, res)
);

router.delete("/cart/:cartId/:productId", auth, async (req, res) =>
  cartController.deleteCartItem(req, res)
);

router.delete("/cart", auth, async (req, res) =>
  cartController.deleteUserCart(req, res)
);

export default router;
