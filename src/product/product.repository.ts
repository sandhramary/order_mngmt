import { Between, ILike } from "typeorm";

import AppDataSource from "../db/data-source.js";
import { Product } from "./product.entity.js";
import { ProductFilters } from "./product.types.js";

export class ProductRepository {
  private productRepo = AppDataSource.getRepository(Product);

  async getProducts(query: ProductFilters) {
    const { min, max, limit, offset, searchKey } = query;

    return this.productRepo.find({
      where: [
        {
          price: Between(min, max),
          name: ILike(`%${searchKey}%`),
        },
        {
          price: Between(min, max),
          description: ILike(`%${searchKey}%`),
        },
      ],
      skip: offset,
      take: limit,
    });
  }

  async getProductById(productId: number) {
    return this.productRepo.findOneBy({ id: productId });
  }

  async updateProductCount(productId: number, quantity: number) {
    const product = await this.getProductById(productId);
    if (product) {
      product.stock = quantity;
      await this.productRepo.save(product);
    }
    return;
  }
}
