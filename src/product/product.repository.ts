import { Between, ILike } from "typeorm";

import AppDataSource from "../db/data-source.js";
import { Product } from "./product.entity.js";
import { ProductQueryDto } from "./product.dto.js";

export const productRepository = {
  async getProducts(query: ProductQueryDto) {
    const { min, max, limit, offset, searchKey } = query;

    const productRepo = AppDataSource.getRepository(Product);

    return productRepo.find({
      where: [
        {
          price: Between(
            Number(min ?? 0),
            Number(max ?? Number.MAX_SAFE_INTEGER)
          ),
          name: ILike(`%${searchKey ?? ""}%`),
        },
        {
          price: Between(
            Number(min ?? 0),
            Number(max ?? Number.MAX_SAFE_INTEGER)
          ),
          description: ILike(`%${searchKey || ""}%`),
        },
      ],
      skip: Number(offset ?? 0),
      take: Math.min(Number(limit ?? Number.MAX_SAFE_INTEGER), 100),
    });
  },
};
