import "dotenv/config";

import { RabbitMQProvider } from "./queue/RabbitMQProvider";
import { PostCreatedEvent } from "./events/PostCreatedEvent";
import { PostModerationFailedEvent } from "./events/PostModerationFailedEvent";
import { AiService } from "./services/aiService";

const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost";
const postsQueue = process.env.POSTS_QUEUE_AI || process.env.POSTS_QUEUE || "posts.events.ai";
const openAiApiKey = process.env.OPENAI_API_KEY || "";
const forceFlag = process.env.AI_FORCE_FLAG === "true";

const queueProvider = new RabbitMQProvider(rabbitUrl);
if (!openAiApiKey) {
	console.warn("AI processor: OPENAI_API_KEY is not set");
}

const aiService = new AiService({ apiKey: openAiApiKey, forceFlag });

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

			const { flagged, reasons } = await aiService.moderateContent(event.post.content ?? "");
			console.log("AiProcessor: moderation decision", {
				postId: event.post.id,
				flagged,
				reasons,
			});
			if (flagged) {
				const payload: PostModerationFailedEvent = {
					type: "post.moderation.failed",
					postId: event.post.id,
					reasons,
				};
				console.warn("AiProcessor: moderation failed", {
					postId: payload.postId,
					reasons: payload.reasons,
				});
				await queueProvider.publish(postsQueue, JSON.stringify(payload));
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
