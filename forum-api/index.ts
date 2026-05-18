import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/health", (_req, res) => {
	res.json({ status: "ok" });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
	console.log(`Forum API listening on port ${port}`);
});
