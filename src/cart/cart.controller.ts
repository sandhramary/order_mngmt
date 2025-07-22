import { Request, Response } from "express";

import { CartService } from "./cart.service.js";
import { CartUpdateDto } from "./cart.types.js";

export class CartController {
  constructor(private readonly cartService: CartService) {}

  async getUserCart(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const cart = await this.cartService.getUserCart(userId);

      if (!cart) {
        res.status(404).send({error: "Cart not found"});
        return;
      }
      res.send(cart);
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: "Failed to fetch user cart" });
    }
  }

  async addCartItem(req: any, res: Response) {
    try {
      const userId = req.user.id;
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

  async updateCartItem(req: any, res: Response) {
    try {
      const { cartId, productId } = req.params;
      if (!cartId || !productId) {
        res.status(400).send({ error: "Invalid input" });
        return;
      }
      const updatedCart = await this.cartService.updateCartItem(
        cartId,
        productId,
        req.user.id,
        req.body as CartUpdateDto
      );
      res.send(updatedCart);
    } catch {
      res.status(500).send({ error: "Failed to update item" });
    }
  }

  async deleteCartItem(req: any, res: Response) {
    try {
      const { cartId, productId } = req.params;
      if (!cartId || !productId) {
        res.status(400).send({ error: "Invalid input" });
        return;
      }
      await this.cartService.deleteCartItem(cartId, productId,  req.user.id,);
      res.send("Cart item deleted successfully");
    } catch {
      res.status(500).send({ error: "Failed to delete item from cart" });
    }
  }

  async deleteUserCart(req: any, res: Response) {
    try {
      await this.cartService.deleteUserCart(req.user.id);
      res.send("Cart deleted successfully");
    } catch {
      res.status(500).send({ error: "Failed to delete cart" });
    }
  }
}
