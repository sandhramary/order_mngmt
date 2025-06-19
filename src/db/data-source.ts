import { DataSource } from "typeorm";
import { Product } from "../entities/product";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "orderdb",
  synchronize: true,
  logging: true,
  entities: [Product]
});
