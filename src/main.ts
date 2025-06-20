import "reflect-metadata";
import express from "express";

import AppDataSource from "./db/data-source.js";
import productRouter from "../src/routers/product.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(productRouter);

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("TypeORM connection error: ", error));
