import express from "express";
import AppDataSource from "../db/data-source.js";
import { Product } from "../entities/product.js";
import { Between, ILike } from "typeorm";

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const { min, max, limit, offset, searchKey } = req.query;

    const productRepo = AppDataSource.getRepository(Product);

    const products = await productRepo.find({
      where: [
        {
          price: Between(
            Number(min ?? 0),
            Number(max ?? Number.MAX_SAFE_INTEGER)
          ),
          name: ILike(`%${searchKey ?? ''}%`),
        },
        {
          price: Between(
            Number(min ?? 0),
            Number(max ?? Number.MAX_SAFE_INTEGER)
          ),
          description: ILike(`%${searchKey || ''}%`)
        },
      ],
      skip: Number(offset ?? 0),
      take: Math.min(Number(limit ?? Number.MAX_SAFE_INTEGER), 100),
    });

    res.send(products);
  } catch (err) {
    res.status(400).send();
  }
});

export default router;
