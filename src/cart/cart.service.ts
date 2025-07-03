import { ProductRepository } from "../product/product.repository.js";
import { CartRepository } from "./cart.repository.js";
import { CartUpdateDto } from "./cart.types.js";

export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository
  ) {}

  async getUserCart(id: string) {
    const userId = Number(id);
    return this.cartRepository.getUserCart(userId);
  }

  async addCartItem(userId: string, productId: string, quantity: number) {
    const parsedUserId = Number(userId);
    const parsedProductId = Number(productId);

    const product = await this.productRepository.getProductById(
      parsedProductId
    );

    // Check for valid product
    if (!product) throw new Error("No product found");

    // Check if its a valid quantity
    if (quantity < 1) throw new Error("Quantity should be positive");
    if (product.stock < quantity) throw new Error("Quantity exceeds stock");

    // Check if there is an existing cart
    const existingCart = await this.cartRepository.getUserCart(parsedUserId);

    // CASE: CART EXISTS
    if (existingCart) {
      // Check if its an existing item in the cart
      const existingCartItem = await this.cartRepository.findCartItem(
        existingCart.id,
        parsedProductId
      );
      if (existingCartItem) {
        if (product.stock < quantity + existingCartItem?.quantity) {
          throw Error("Quantity exceeds stock");
        }
        await this.cartRepository.updateCartItemQuantity(
          existingCartItem.id,
          existingCartItem.quantity + quantity
        );
      } else {
        await this.cartRepository.addCartItem(
          existingCart.id,
          parsedProductId,
          quantity
        );
      }

      return this.cartRepository.getUserCart(parsedUserId);
    }
    // CASE : NO EXISTING CART - NEW CART CREATION
    else {
      const newCart = await this.cartRepository.createCart(parsedUserId);
      await this.cartRepository.addCartItem(
        newCart.id,
        parsedProductId,
        quantity
      );

      return this.cartRepository.getUserCart(parsedUserId);
    }
  }

  async updateCartItem(cartId: string, productId: string, body: CartUpdateDto) {
    const parsedCartId = Number(cartId);
    const parsedProductId = Number(productId);

    // Check for invalid updates
    const allowedField = "quantity";
    const requestFields = Object.keys(body);
    if (requestFields.length > 1 || requestFields[0] !== allowedField) {
      throw Error("Invalid update");
    }

    //Check for valid product
    const product = await this.productRepository.getProductById(
      parsedProductId
    );
    if (!product) throw Error("Invalid product");

    // Check for invalid quantity
    if (body?.quantity < 0) throw Error("Quantity must be positive");
    if (body?.quantity > product?.stock) throw Error("Quantity exceeds stock");

    // Valid updates
    const existingCartItem = await this.cartRepository.findCartItem(
      parsedCartId,
      parsedProductId
    );
    if (existingCartItem) {
      return this.cartRepository.updateCartItemQuantity(
        existingCartItem.id,
        body.quantity
      );
    } else {
      throw Error("Product doesnt exist in the cart");
    }
  }

  async deleteCart(cartId: string) {
    const parsedCartId = Number(cartId);
    const deleteCart = await this.cartRepository.deleteCart(parsedCartId);
    if (deleteCart) return deleteCart;
    throw Error("Invalid cart");
  }

  async deleteCartItem(cartId: string, productId: string) {
    const parsedCartId = Number(cartId);
    const parsedProductId = Number(productId);

    const deletedCartItem = await this.cartRepository.deleteCartItem(
      parsedCartId,
      parsedProductId
    );
    if (deletedCartItem) return deletedCartItem;
    throw Error("Item doesn't exist in the cart");
  }
}
