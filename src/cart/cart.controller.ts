import { Request, Response } from "express";

import { CartService } from "./cart.service.js";
import { CartUpdateDto } from "./cart.types.js";

export class CartController {
  constructor(private readonly cartService: CartService) {}

  async getUserCart(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const cart = await this.cartService.getUserCart(userId);

      if (!cart) {
        res.status(404).send();
        return;
      }
      res.send(cart);
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: "Failed to fetch user cart" });
    }
  }

  async addCartItem(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { productId, quantity } = req.body || {};

      if (!productId || !quantity) {
        res.status(400).send({ error: "Invalid input" });
        return;
      }

      const cart = await this.cartService.addCartItem(
        userId,
        productId,
        quantity
      );
      res.send(cart);
    } catch {
      res.status(500).send({ error: "Failed to add item to cart" });
    }
  }

  async updateCartItem(req: Request, res: Response) {
    try {
      const { cartId, productId } = req.params;
      if (!cartId || !productId) {
        res.status(400).send({ error: "Invalid input" });
        return;
      }
      const updatedCart = await this.cartService.updateCartItem(
        cartId,
        productId,
        req.body as CartUpdateDto
      );
      res.send(updatedCart);
    } catch {
      res.status(500).send({ error: "Failed to update item" });
    }
  }

  async deleteCartItem(req: Request, res: Response) {
    try {
      const { cartId, productId } = req.params;
      if (!cartId || !productId) {
        res.status(400).send({ error: "Invalid input" });
        return;
      }
      await this.cartService.deleteCartItem(cartId, productId);
      res.send("Cart item deleted successfully");
    } catch {
      res.status(500).send({ error: "Failed to delete item from cart" });
    }
  }

  async deleteCart(req: Request, res: Response) {
    try {
      const { cartId } = req.params;
      if (!cartId) {
        res.status(400).send({ error: "No valid cart id" });
        return;
      }
      await this.cartService.deleteCart(cartId);
      res.send("Cart deleted successfully");
    } catch {
      res.status(500).send({ error: "Failed to delete cart" });
    }
  }
}
