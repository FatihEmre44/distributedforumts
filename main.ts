import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { PostService } from "./services/postService";
import { RabbitMQProvider } from "./services/RabbitMQProvider";
import { TopicStatsWorker } from "./services/TopicStatsWorker";
import { TopicService } from "./services/topicService";
import { UserStatsWorker } from "./services/UserStatsWorker";
import { UserService } from "./services/userService";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const userService = new UserService();
const topicService = new TopicService();

const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost";
const postsQueue = process.env.POSTS_QUEUE || "posts.events";

const queueProvider = new RabbitMQProvider(rabbitUrl);
const postService = new PostService({ queueProvider, queueName: postsQueue });
const userStatsWorker = new UserStatsWorker(queueProvider, postsQueue, userService);
const topicStatsWorker = new TopicStatsWorker(queueProvider, postsQueue, topicService);

app.get("/health", (_req: Request, res: Response) => {
	res.json({ status: "ok" });
});

app.post("/users", async (req: Request, res: Response) => {
	try {
		const user = await userService.createUser(req.body);
		res.status(201).json(user.toJSON());
	} catch (error) {
		res.status(400).json({ error: (error as Error).message });
	}
});

app.get("/users", async (_req: Request, res: Response) => {
	const users = await userService.listUsers();
	res.json(users.map((user) => user.toJSON()));
});

app.post("/posts", async (req: Request, res: Response) => {
	try {
		const post = await postService.createPost(req.body);
		res.status(201).json(post.toJSON());
	} catch (error) {
		res.status(400).json({ error: (error as Error).message });
	}
});

app.get("/posts", async (_req: Request, res: Response) => {
	const posts = await postService.listPosts();
	res.json(posts.map((post) => post.toJSON()));
});

app.post("/topics", async (req: Request, res: Response) => {
	try {
		const topic = await topicService.createTopic(req.body);
		res.status(201).json(topic.toJSON());
	} catch (error) {
		res.status(400).json({ error: (error as Error).message });
	}
});

app.get("/topics", async (_req: Request, res: Response) => {
	const topics = await topicService.listTopics();
	res.json(topics.map((topic) => topic.toJSON()));
});

app.delete("/posts/:id", async (req: Request, res: Response) => {
	const deleted = await postService.deletePost(req.params.id);
	if (!deleted) {
		res.status(404).json({ error: "Post not found" });
		return;
	}
	res.json(deleted.toJSON());
});

app.get("/topics/trending", async (req: Request, res: Response) => {
	const limit = Number(req.query.limit) || 10;
	const topics = await topicService.getTrendingTopics(limit);
	res.json(topics.map((topic) => topic.toJSON()));
});

const port = Number(process.env.PORT) || 3000;
const startServer = async (): Promise<void> => {
	try {
		await queueProvider.connect();
		await userStatsWorker.start();
		await topicStatsWorker.start();
		app.listen(port, () => {
			console.log(`GsForum API listening on port ${port}`);
		});
	} catch (error) {
		console.error("Startup failed:", error);
		process.exit(1);
	}
};

void startServer();
