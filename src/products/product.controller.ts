import express from "express";

import { productService } from "./product.service.js";
import { ProductQueryDto } from "./product.dto.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const products = await productService.getProducts(req.query as ProductQueryDto);
    res.send(products);
  } catch {
    res.status(500).send();
  }
});

export default router;
