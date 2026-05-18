import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { createAuthRouter } from "./routes/authRouter";
import { AuthService } from "./services/authService";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const authService = new AuthService();

app.use("/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.use("/auth", createAuthRouter(authService));

const port = Number(process.env.PORT) || 3004;
app.listen(port, () => {
	console.log(`Auth service listening on port ${port}`);
});
