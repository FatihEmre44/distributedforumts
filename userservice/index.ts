import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { createUsersRouter } from "./routes/usersRouter";
import { UserService } from "./services/userService";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const userService = new UserService();

app.use("/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.use("/users", createUsersRouter(userService));

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
	console.log(`User service listening on port ${port}`);
});
