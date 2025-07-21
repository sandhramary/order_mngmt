import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";

import AppDataSource from "./db/data-source.js";
import cartRouter from "./cart/cart.routes.js";
import orderRouter from "./order/order.routes.js";
import productRouter from "./product/product.routes.js";
import userRouter from "./user/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(productRouter);
app.use(cartRouter);
app.use(orderRouter);
app.use(userRouter);

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("TypeORM connection error: ", error));
