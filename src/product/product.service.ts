import { ProductRepository } from "./product.repository.js";
import { ProductQueryDto } from "./product.types.js";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProducts(query: ProductQueryDto) {
    const parsedQuery = {
      min: Number(query.min ?? 0),
      max: Number(query.max ?? Number.MAX_SAFE_INTEGER),
      searchKey: query.searchKey ?? "",
      limit: Math.min(Number(query.limit ?? 20), 100),
      offset: Number(query.offset ?? 0),
    };

    return this.productRepository.getProducts(parsedQuery);
  }
}
