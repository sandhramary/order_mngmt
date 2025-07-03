import express from "express";
import AppDataSource from "../db/data-source.js";
import { Cart } from "../entities/Cart.js";
import { CartItem } from "../entities/CartItem.js";
import { Product } from "../product/product.entity.js";

const router = express.Router();

router.delete("/cart/:cartId/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const cartItemRepo = AppDataSource.getRepository(CartItem);

    const existingCartItemWithProduct = await cartItemRepo.findOne({
      where: {
        cart: { id: Number(cartId) },
        product: { id: Number(productId) },
      },
      relations: ["product", "cart"],
    });
    if (existingCartItemWithProduct) {
      await cartItemRepo.remove(existingCartItemWithProduct);
      res.status(200).send({ message: "Cart item removed successfully" });
    } else {
      res.status(404).send({ error: "Product doesnt exist in the cart" });
    }
  } catch {
    res.status(400).send();
  }
});

export default router;
