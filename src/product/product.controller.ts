import { Request, Response } from "express";

import { ProductService } from "./product.service.js";
import { ProductQueryDto } from "./product.types.js";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async getProducts(req: Request, res: Response) {
    try {
      const query = req.query as ProductQueryDto;
      const products = await this.productService.getProducts(query);
      res.send(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }
}
