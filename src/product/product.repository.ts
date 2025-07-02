import { Between, ILike } from "typeorm";

import AppDataSource from "../db/data-source.js";
import { Product } from "./product.entity.js";
import { ProductFilters } from "./product.types.js";

export class ProductRepository {
  async getProducts(query: ProductFilters) {
    const { min, max, limit, offset, searchKey } = query;

    const productRepo = AppDataSource.getRepository(Product);

    return productRepo.find({
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
}
