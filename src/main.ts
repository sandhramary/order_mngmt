import "reflect-metadata";
import express from "express";

import AppDataSource from "./db/data-source.js";
import productRouter from "../src/routers/product.js";
import cartRouter from "../src/routers/cart.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(productRouter);
app.use(cartRouter);

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("TypeORM connection error: ", error));
