import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { createPostsRouter } from "./routes/postsRouter";
import { PostService } from "./services/postService";
import { RabbitMQProvider } from "./queue/RabbitMQProvider";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost";
const postsQueue = process.env.POSTS_QUEUE || "posts.events";

const queueProvider = new RabbitMQProvider(rabbitUrl);
const postService = new PostService({ queueProvider, queueName: postsQueue });

app.use("/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.use("/posts", createPostsRouter(postService));

const port = Number(process.env.PORT) || 3002;
const startServer = async (): Promise<void> => {
	try {
		await queueProvider.connect();
		app.listen(port, () => {
			console.log(`Post service listening on port ${port}`);
		});
	} catch (error) {
		console.error("Startup failed:", error);
		process.exit(1);
	}
};

void startServer();
