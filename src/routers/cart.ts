import express from "express";
import AppDataSource from "../db/data-source.js";
import { Cart } from "../entities/Cart.js";
import { CartItem } from "../entities/CartItem.js";
import { User } from "../entities/User.js";
import { Product } from "../entities/Product.js";
import { error } from "console";

const router = express.Router();

router.get("/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const cartRepo = AppDataSource.getRepository(Cart);

    const cart = await cartRepo.findOne({
      where: { user: { id: Number(userId) } },
      relations: ["cartItems", "cartItems.product"],
    });

    if (!cart) res.status(404).send();

    res.send(cart);
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/cart/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const { productId, quantity } = req.body || {};

    const productRepo = AppDataSource.getRepository(Product);
    const cartRepo = AppDataSource.getRepository(Cart);
    const cartItemRepo = AppDataSource.getRepository(CartItem);

    if (productId && quantity) {
      // Check if its a valid product
      const product = await productRepo.findOneBy({ id: productId });
      if (!product) {
        res.status(404).send({ error: "No such product found" });
        return;
      }

      // Check if its a valid quantity
      if (quantity < 1) {
        res.status(400).send({ error: "Quantity should be positive" });
        return;
      }

      // Check if its an existing cart
      const existingCart = await cartRepo.findOne({
        where: { user: { id: Number(userId) } },
      });

      // --------------------------------- Cart exists -----------------------------

      if (existingCart) {
        // Check if its an existing item in the cart
        const existingCartItem = await cartItemRepo.findOne({
          where: { cart: { id: existingCart?.id }, product: { id: productId } },
        });

        if (existingCartItem) {
          existingCartItem.quantity += quantity;
          await cartItemRepo.save(existingCartItem);
        } else {
          const newCartItem = cartItemRepo.create({
            cart: { id: existingCart.id },
            product: { id: productId },
            quantity,
          });

          await cartItemRepo.save(newCartItem);
        }

        const updatedCart = await cartRepo.findOne({
          where: { id: existingCart.id },
          relations: ["cartItems", "cartItems.product"],
        });

        res.status(200).json({
          message: "Item added to cart",
          cart: updatedCart,
        });
      }
      // No existing cart
      else {
        const newCart = cartRepo.create({ user: { id: Number(userId) } });

        const savedCart = await cartRepo.save(newCart);

        const newCartItem = cartItemRepo.create({
          cart: { id: savedCart.id },
          product: { id: productId },
          quantity,
        });

        await cartItemRepo.save(newCartItem);
        const updatedCart = await cartRepo.findOne({
          where: { id: savedCart.id },
          relations: ["cartItems", "cartItems.product"],
        });

        res.status(200).json({
          message: "Item added to cart",
          cart: updatedCart,
        });
      }
      return;
    }
    res.status(400).send({ error: "Invalid input" });
  } catch (e) {
    res.status(400).send();
  }
});

router.patch("/cart/:cartId/:itemId", async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.itemId;
    const allowedField = "quantity";

    // Check for invalid quantity
    if (req?.body?.quantity < 0) {
      res.status(400).send({ error: "Quantity must be positive" });
    }

    // Check for invalid updates
    const requestFields = Object.keys(req.body);
    if (requestFields.length > 1 || requestFields[0] !== allowedField) {
      res.status(400).send({ error: "Invalid update" });
    }
    // If valid update
    else {
      const cartItemRepo = AppDataSource.getRepository(CartItem);
      const existingCartItemWithProduct = await cartItemRepo.findOne({
        where: {
          cart: { id: Number(cartId) },
          product: { id: Number(productId) },
        },
        relations: ["product", "cart"],
      });

      // Check if there is a product in the cart
      if (existingCartItemWithProduct) {
        existingCartItemWithProduct.quantity = req.body.quantity || 0;
        await cartItemRepo.save(existingCartItemWithProduct);
        res.send(existingCartItemWithProduct);
      } else {
        res.status(404).send({ error: "Product doesnt exist in the cart" });
      }
    }
  } catch {
    res.status(400).send();
  }
});

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
