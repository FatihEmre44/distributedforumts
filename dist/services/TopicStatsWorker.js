"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicStatsWorker = void 0;
class TopicStatsWorker {
    constructor(queueProvider, queueName, topicService) {
        this.queueProvider = queueProvider;
        this.queueName = queueName;
        this.topicService = topicService;
    }
    async start() {
        await this.queueProvider.subscribe(this.queueName, async (raw) => {
            let event = null;
            try {
                event = JSON.parse(raw);
            }
            catch (error) {
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
exports.TopicStatsWorker = TopicStatsWorker;
