import path from "path";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "hoacomuadong5",
  database: "canifa",
  synchronize: true,
  logging: false,
  entities: [path.join(__dirname, "/entities/*")],
});
