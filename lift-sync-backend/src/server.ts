import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { UserTable } from "./entity/test";
import bodyParser from "body-parser";

require("dotenv").config();
const environment = process.env.NODE_ENV || "development";
require("dotenv").config({ path: `.env.${environment}` });

const app = express();
app.use(cors());
app.use(bodyParser.json());

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

interface AuthenticatedRequest extends Request {
  userId?: number;
}

const PORT = 3000;

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

app.get("/", async function (req, res) {
  const userRepo = AppDataSource.getRepository(UserTable);
  const record = await userRepo.find({ where: { username: "cousinjoey" } });
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

app.post("/api/users/register", async (req, res) => {
  try {
    const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const userRepo = AppDataSource.getRepository(UserTable);
    const user = new UserTable();
    user.username = req.body.username;
    user.password_encrypted = encryptedPassword;
    await userRepo.save(user);
    res.status(200).send({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Error registering user." });
  }
});

app.post("/api/users/login", async (req, res) => {
  console.log("/login hit");
  try {
    const { username, password } = req.body;
    const userRepo = AppDataSource.getRepository(UserTable);

    const user = await userRepo.findOne({ where: { username } });

    if (!user) {
      return res.status(400).send({ messages: "Invalid username or password" });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_encrypted
    );

    if (!passwordMatches) {
      return res.status(400).send({ messages: "Invalid username or password" });
    }

    if (passwordMatches) {
      const userInfo = {
        username: user.username,
        userId: user.user_id,
      };

      const token = jwt.sign(userInfo, SECRET_KEY, {
        expiresIn: "1h",
      });

      res.status(200).send({ token });
    }
  } catch (error) {
    console.error("Login error:", error); // Log the error
    res.status(500).send({ message: "Error" });
  }
});

function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(500).send({ message: "failed to authenticate" });
    }

    req.userId = decoded.id;
    next();
  });
}
