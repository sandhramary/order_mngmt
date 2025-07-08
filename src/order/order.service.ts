import { CartRepository } from "../cart/cart.repository.js";
import { ProductRepository } from "../product/product.repository.js";
import { OrderRepository } from "./order.repository.js";
import { OrderItemType, OrderStatus } from "./order.types.js";

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository
  ) {}

  async getOrders(userId: string, status?: string) {
    const parsedUserId = Number(userId);
    const filteredStatus = status as OrderStatus | undefined;
    return this.orderRepository.getOrders(parsedUserId, filteredStatus);
  }

  async getOrderById(userId: string, orderId: string) {
    const parsedUserId = Number(userId);
    const parsedOrderId = Number(orderId);
    return this.orderRepository.getOrderById(parsedUserId, parsedOrderId);
  }

  async orderCheckout(userId: string) {
    const parsedUserId = Number(userId);
    const cart = await this.cartRepository.getUserCart(parsedUserId);

    // CASE: No cart
    if (!cart || !cart.cartItems.length) {
      throw "Cart is empty";
    }

    // CASE: Existing active order
    const existingOrders = await this.orderRepository.getOrders(
      parsedUserId,
      "pending"
    );
    if (existingOrders?.length > 0) {
      const existingOrder = existingOrders[0];
      const createdAtTime = new Date(existingOrder?.createdAt).getTime();
      const now = Date.now();

      const isExpired = now - createdAtTime > 15 * 60 * 1000; // Order is discarded after 15 mins

      if (!isExpired) {
        throw Error("An active order already exists for the user");
      }
      await this.orderRepository.discardOrder(existingOrder?.id);
    }

    // Checkout cart
    let total = 0;
    const orderItems: OrderItemType[] = [];
    for (const item of cart.cartItems) {
      const availableStock = item.product.stock;

      if (item.quantity > availableStock) {
        throw Error(`Invalid quantity for product ${item.product.name}`);
      }

      total += item.quantity * Number(item.product.price);
      orderItems.push({
        quantity: item.quantity,
        priceAtPurchase: Number(item.product.price),
        product: item.product,
      });
    }

    if (orderItems?.length > 0) {
      return this.orderRepository.orderCheckout(
        parsedUserId,
        orderItems,
        total
      );
    }
  }

  async buyNow(userId: string, productId: string, quantity: number) {
    const parsedUserId = Number(userId);
    const parsedProductId = Number(productId);

    // Validate product and its stock
    const product = await this.productRepository.getProductById(
      parsedProductId
    );
    if (!product || product?.stock < quantity) {
      throw Error("Invalid product or quantity");
    }

    // CASE: Existing active order
    const existingOrders = await this.orderRepository.getOrders(
      parsedUserId,
      "pending"
    );
    if (existingOrders?.length > 0) {
      const existingOrder = existingOrders[0];
      const createdAtTime = new Date(existingOrder?.createdAt).getTime();
      const now = Date.now();

      const isExpired = now - createdAtTime > 15 * 60 * 1000; // Order is discarded after 15 mins

      if (!isExpired) {
        throw Error("An active order already exists for the user");
      }
      await this.orderRepository.discardOrder(existingOrder?.id);
    }

    // Buy product
    return this.orderRepository.buyNow(parsedUserId, product, quantity);
  }

  async orderSuccess(userId: string, orderId: string) {
    const parsedUserId = Number(userId);
    const parsedOrderId = Number(orderId);

    const order = await this.orderRepository.getOrderById(parsedOrderId);
    if (!order || order.status !== "pending") {
      throw Error("Invalid order");
    }

    if (order.orderType === "cart") {
      const existingCart = await this.cartRepository.getUserCart(parsedUserId);
      if (existingCart) await this.cartRepository.deleteCart(existingCart.id);
    }

    await Promise.all(
      order.orderItems.map(async (item) => {
        const newQuantity = (item.product.stock -= item.quantity);
        await this.productRepository.updateProductCount(
          item.product.id,
          newQuantity
        );
      })
    );

    return this.orderRepository.updateOrderStatus(parsedOrderId, "success");
  }

  async orderFailure(userId: string, orderId: string) {
    const parsedUserId = Number(userId);
    const parsedOrderId = Number(orderId);

    const order = await this.orderRepository.getOrderById(parsedOrderId);
    if (!order || order.status !== "pending") {
      throw Error("Invalid order");
    }

    return this.orderRepository.updateOrderStatus(parsedOrderId, "failed");
  }

  async orderExpire(userId: string, orderId: string) {
    const parsedUserId = Number(userId);
    const parsedOrderId = Number(orderId);

    const order = await this.orderRepository.getOrderById(parsedOrderId);
    if (!order || order.status !== "pending") {
      throw Error("Invalid order");
    }

    return this.orderRepository.updateOrderStatus(parsedOrderId, "discard");
  }
}
