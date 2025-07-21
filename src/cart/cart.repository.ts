import AppDataSource from "../db/data-source.js";
import { Cart } from "./cart.entity.js";
import { CartItem } from "./cartItem.entity.js";

export class CartRepository {
  private cartRepo = AppDataSource.getRepository(Cart);
  private cartItemRepo = AppDataSource.getRepository(CartItem);

  async getUserCart(userId: number) {
    return this.cartRepo.findOne({
      where: { user: { id: Number(userId) } },
      relations: ["cartItems", "cartItems.product"],
    });
  }

  async findCartItem(cartId: number, productId: number) {
    return this.cartItemRepo.findOne({
      where: {
        cart: { id: cartId },
        product: { id: productId },
      }
    });
  }

  async findCartById(cartId: number) {
    return this.cartRepo.findOneBy({ id: cartId });
  }

  async findCartItemById(cartItemId: number) {
    return this.cartItemRepo.findOneBy({ id: cartItemId });
  }

  async updateCartItemQuantity(cartItemId: number, quantity: number) {
    const cartItem = await this.findCartItemById(cartItemId);
    if (cartItem) {
      cartItem.quantity = quantity;
      return this.cartItemRepo.save(cartItem);
    } else {
      return null;
    }
  }

  async addCartItem(cartId: number, productId: number, quantity: number) {
    const newCartItem = this.cartItemRepo.create({
      cart: { id: cartId },
      product: { id: productId },
      quantity,
    });

    return this.cartItemRepo.save(newCartItem);
  }

  async createCart(userId: number) {
    const newCart = this.cartRepo.create({ user: { id: Number(userId) } });
    return this.cartRepo.save(newCart);
  }

  async deleteCart(cartId: number) {
    const cartToDelete = await this.findCartById(cartId);
    if (cartToDelete) {
      return this.cartRepo.remove(cartToDelete);
    }
    return null;
  }

  async deleteCartItem(cartId: number, productId: number) {
    const cartItemToDelete = await this.findCartItem(cartId, productId);
    if (cartItemToDelete) {
      return this.cartItemRepo.remove(cartItemToDelete);
    }
    return null;
  }
}
