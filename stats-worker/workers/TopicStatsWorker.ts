import { IQueueProvider } from "../interfaces/IQueueProvider";
import { PostCreatedEvent } from "../events/PostCreatedEvent";
import { PostDeletedEvent } from "../events/PostDeletedEvent";
import { TopicService } from "../services/topicService";

export class TopicStatsWorker {
	private readonly queueProvider: IQueueProvider;
	private readonly queueName: string;
	private readonly topicService: TopicService;

	constructor(queueProvider: IQueueProvider, queueName: string, topicService: TopicService) {
		this.queueProvider = queueProvider;
		this.queueName = queueName;
		this.topicService = topicService;
	}

	async start(): Promise<void> {
		await this.queueProvider.subscribe(this.queueName, async (raw) => {
			let event: PostCreatedEvent | PostDeletedEvent | null = null;
			try {
				event = JSON.parse(raw) as PostCreatedEvent | PostDeletedEvent;
			} catch (error) {
				console.error("TopicStatsWorker: invalid message payload", error);
				return;
			}

			if (!event) {
				return;
			}

			const topicId = event.post.topicId;
			if (!topicId) {
				return;
			}

			if (event.type === "post.created") {
				console.log("TopicStatsWorker: consumed post.created", {
					queue: this.queueName,
					postId: event.post.id,
					topicId,
				});
				await this.topicService.incrementTopicStats(topicId);
				return;
			}

			if (event.type === "post.deleted") {
				console.log("TopicStatsWorker: consumed post.deleted", {
					queue: this.queueName,
					postId: event.post.id,
					topicId,
				});
				await this.topicService.decrementTopicStats(topicId, event.post.id ?? "");
			}
		});
	}
}
