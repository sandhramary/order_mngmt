import "reflect-metadata";
import express from "express";

import AppDataSource from "./db/data-source.js";
import cartRouter from "../src/routers/cart.js";
import orderRouter from "../src/routers/order.js";
import productRouter from './product/product.controller.js'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(productRouter);
app.use(cartRouter);
app.use(orderRouter);

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("TypeORM connection error: ", error));
