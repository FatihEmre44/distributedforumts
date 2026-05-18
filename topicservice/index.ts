import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { createTopicsRouter } from "./routes/topicsRouter";
import { TopicService } from "./services/topicService";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const topicService = new TopicService();

app.use("/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.use("/topics", createTopicsRouter(topicService));

const port = Number(process.env.PORT) || 3003;
app.listen(port, () => {
	console.log(`Topic service listening on port ${port}`);
});
