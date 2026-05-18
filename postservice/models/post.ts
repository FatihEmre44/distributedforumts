export interface PostProps {
	id?: string | null;
	authorId?: string | null;
	topicId?: string | null;
	content?: string;
	createdAt?: Date | string | null;
	upvotes?: number;
	aiStatus?: string | null;
	aiScore?: number;
}

export class Post {
	id: string | null;
	authorId: string | null;
	topicId: string | null;
	content: string;
	createdAt: Date;
	upvotes: number;
	aiStatus: string;
	aiScore: number;

	constructor({
		id,
		authorId,
		topicId,
		content,
		createdAt,
		upvotes = 0,
		aiStatus = "pending",
		aiScore = 0,
	}: PostProps = {}) {
		this.id = id ?? null;
		this.authorId = authorId ?? null;
		this.topicId = topicId ?? null;
		this.content = content ?? "";
		this.createdAt = createdAt ? new Date(createdAt) : new Date();
		this.upvotes = Number.isFinite(upvotes) ? upvotes : 0;
		this.aiStatus = aiStatus ?? "pending";
		this.aiScore = Number.isFinite(aiScore) ? aiScore : 0;
	}

	updateAiResult(status?: string | null, score?: number): { aiStatus: string; aiScore: number } {
		if (status !== undefined && status !== null) {
			this.aiStatus = status;
		}
		if (Number.isFinite(score)) {
			this.aiScore = score as number;
		}
		return { aiStatus: this.aiStatus, aiScore: this.aiScore };
	}

	upvote(): number {
		this.upvotes += 1;
		return this.upvotes;
	}

	toJSON(): {
		id: string | null;
		authorId: string | null;
		topicId: string | null;
		content: string;
		createdAt: Date;
		upvotes: number;
		aiStatus: string;
		aiScore: number;
	} {
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
