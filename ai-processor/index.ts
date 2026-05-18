import "dotenv/config";

import { RabbitMQProvider } from "./queue/RabbitMQProvider";
import { PostCreatedEvent } from "./events/PostCreatedEvent";
import { AiService } from "./services/aiService";

const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost";
const postsQueue = process.env.POSTS_QUEUE || "posts.events";

const queueProvider = new RabbitMQProvider(rabbitUrl);
const aiService = new AiService();

const startProcessor = async (): Promise<void> => {
	try {
		await queueProvider.connect();
		await queueProvider.subscribe(postsQueue, async (raw) => {
			let event: PostCreatedEvent | null = null;
			try {
				event = JSON.parse(raw) as PostCreatedEvent;
			} catch (error) {
				console.error("AiProcessor: invalid message payload", error);
				return;
			}

			if (!event || event.type !== "post.created") {
				return;
			}

			if (!event.post.id) {
				return;
			}

			await aiService.createResult({ postId: event.post.id, status: "processed", score: 0 });
			console.log("AiProcessor: processed post", {
				postId: event.post.id,
				authorId: event.post.authorId,
				topicId: event.post.topicId,
			});
		});
		console.log("AI processor is running");
	} catch (error) {
		console.error("AI processor startup failed:", error);
		process.exit(1);
	}
};

void startProcessor();
