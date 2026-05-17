"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
class Post {
    constructor({ id, authorId, topicId, content, createdAt, upvotes = 0, aiStatus = "pending", aiScore = 0, } = {}) {
        this.id = id ?? null;
        this.authorId = authorId ?? null;
        this.topicId = topicId ?? null;
        this.content = content ?? "";
        this.createdAt = createdAt ? new Date(createdAt) : new Date();
        this.upvotes = Number.isFinite(upvotes) ? upvotes : 0;
        this.aiStatus = aiStatus ?? "pending";
        this.aiScore = Number.isFinite(aiScore) ? aiScore : 0;
    }
    updateAiResult(status, score) {
        if (status !== undefined && status !== null) {
            this.aiStatus = status;
        }
        if (Number.isFinite(score)) {
            this.aiScore = score;
        }
        return { aiStatus: this.aiStatus, aiScore: this.aiScore };
    }
    upvote() {
        this.upvotes += 1;
        return this.upvotes;
    }
    toJSON() {
        return {
            id: this.id,
            authorId: this.authorId,
            topicId: this.topicId,
            content: this.content,
            createdAt: this.createdAt,
            upvotes: this.upvotes,
            aiStatus: this.aiStatus,
            aiScore: this.aiScore,
        };
    }
}
exports.Post = Post;
