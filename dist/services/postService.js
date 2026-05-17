"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const post_1 = require("../models/post");
class PostService {
    constructor({ queueProvider = null, queueName = "" } = {}) {
        this.postsById = new Map();
        this.queueProvider = queueProvider;
        this.queueName = queueName;
    }
    async createPost({ id, authorId, topicId, content, createdAt, upvotes = 0, aiStatus, aiScore } = {}) {
        const post = new post_1.Post({ id, authorId, topicId, content, createdAt, upvotes, aiStatus, aiScore });
        if (!post.id) {
            throw new Error("Post id is required");
        }
        if (this.postsById.has(post.id)) {
            throw new Error("Post already exists");
        }
        this.postsById.set(post.id, post);
        if (this.queueProvider && this.queueName) {
            const payload = {
                type: "post.created",
                post: post.toJSON(),
            };
            console.log("PostService: publishing post.created", {
                queue: this.queueName,
                postId: payload.post.id,
                authorId: payload.post.authorId,
                topicId: payload.post.topicId,
            });
            await this.queueProvider.publish(this.queueName, JSON.stringify(payload));
        }
        return post;
    }
    async findById(postId) {
        return this.postsById.get(postId) ?? null;
    }
    async listPosts() {
        return Array.from(this.postsById.values());
    }
    async listByAuthor(authorId) {
        return Array.from(this.postsById.values()).filter((post) => post.authorId === authorId);
    }
    async deletePost(postId) {
        const post = await this.findById(postId);
        if (!post) {
            return null;
        }
        this.postsById.delete(postId);
        if (this.queueProvider && this.queueName) {
            const payload = {
                type: "post.deleted",
                post: post.toJSON(),
            };
            console.log("PostService: publishing post.deleted", {
                queue: this.queueName,
                postId: payload.post.id,
                authorId: payload.post.authorId,
                topicId: payload.post.topicId,
            });
            await this.queueProvider.publish(this.queueName, JSON.stringify(payload));
        }
        return post;
    }
    async upvote(postId) {
        const post = await this.findById(postId);
        if (!post) {
            return null;
        }
        post.upvote();
        return post;
    }
    async updateAiResult(postId, status, score) {
        const post = await this.findById(postId);
        if (!post) {
            return null;
        }
        post.updateAiResult(status, score);
        return post;
    }
}
exports.PostService = PostService;
