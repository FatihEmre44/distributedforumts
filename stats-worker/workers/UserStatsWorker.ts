import { IQueueProvider } from "../interfaces/IQueueProvider";
import { PostCreatedEvent } from "../events/PostCreatedEvent";
import { PostDeletedEvent } from "../events/PostDeletedEvent";
import { UserService } from "../services/userService";

export class UserStatsWorker {
	private readonly queueProvider: IQueueProvider;
	private readonly queueName: string;
	private readonly userService: UserService;

	constructor(queueProvider: IQueueProvider, queueName: string, userService: UserService) {
		this.queueProvider = queueProvider;
		this.queueName = queueName;
		this.userService = userService;
	}

	async start(): Promise<void> {
		await this.queueProvider.subscribe(this.queueName, async (raw) => {
			let event: PostCreatedEvent | PostDeletedEvent | null = null;
			try {
				event = JSON.parse(raw) as PostCreatedEvent | PostDeletedEvent;
			} catch (error) {
				console.error("UserStatsWorker: invalid message payload", error);
				return;
			}

			if (!event) {
				return;
			}

			const authorId = event.post.authorId;
			if (!authorId) {
				return;
			}

			if (event.type === "post.created") {
				console.log("UserStatsWorker: consumed post.created", {
					queue: this.queueName,
					postId: event.post.id,
					authorId,
				});
				await this.userService.incrementPostCount(authorId);
				return;
			}

			if (event.type === "post.deleted") {
				console.log("UserStatsWorker: consumed post.deleted", {
					queue: this.queueName,
					postId: event.post.id,
					authorId,
				});
				await this.userService.decrementPostCount(authorId);
			}
		});
	}
}
