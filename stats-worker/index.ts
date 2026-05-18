import "dotenv/config";

import { RabbitMQProvider } from "./queue/RabbitMQProvider";
import { TopicService } from "./services/topicService";
import { UserService } from "./services/userService";
import { TopicStatsWorker } from "./workers/TopicStatsWorker";
import { UserStatsWorker } from "./workers/UserStatsWorker";

const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost";
const postsQueue = process.env.POSTS_QUEUE || "posts.events";

const queueProvider = new RabbitMQProvider(rabbitUrl);
const userService = new UserService();
const topicService = new TopicService();

const userStatsWorker = new UserStatsWorker(queueProvider, postsQueue, userService);
const topicStatsWorker = new TopicStatsWorker(queueProvider, postsQueue, topicService);

const startWorker = async (): Promise<void> => {
	try {
		await queueProvider.connect();
		await userStatsWorker.start();
		await topicStatsWorker.start();
		console.log("Stats worker is running");
	} catch (error) {
		console.error("Stats worker startup failed:", error);
		process.exit(1);
	}
};

void startWorker();
