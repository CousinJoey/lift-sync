import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { UserTable } from "./entity/test";

const app = express();

app.use(cors());

const PORT = 3000;

app.get("/", async function (req, res) {
  const userRepo = AppDataSource.getRepository(UserTable);
  const record = await userRepo.find({ where: { Username: "cousinjoey" } });
  console.log(record);
  res.send(`Users: ${record}`);
});

app.listen(PORT, () => {
  console.log(`Server test running, http://localhost:${PORT}`);
});

app.get("/api/users", async function (req, res) {
  console.log("API endpoint /api/users was hit.");
  const userRepo = AppDataSource.getRepository(UserTable);
  const users = await userRepo.find();
  res.json(users);
});

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "",
  password: "",
  database: "lift-sync-database",
  entities: ["src/entity/*{.ts,.js}"],
  synchronize: false,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("databased connected");
  })
  .catch((error) => console.log(error));

// createConnection()
//   .then(async (connection) => {
//     console.log("Connected to DB Test");
//     const userRepo = connection.getRepository(UserTable);
//     const allUsers = await userRepo.find();
//     console.log("Users:", allUsers);
//   })
//   .catch((error) => console.log(error));
