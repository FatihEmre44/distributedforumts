export interface TopicProps {
	id?: string | null;
	title?: string;
	authorId?: string | null;
	createdAt?: Date | string | null;
	postIds?: string[];
	postCount?: number;
	lastActivity?: Date | string | null;
}

export class Topic {
	id: string | null;
	title: string;
	authorId: string | null;
	createdAt: Date;
	postIds: string[];
	postCount: number;
	lastActivity: Date | null;

	constructor({ id, title, authorId, createdAt, postIds, postCount = 0, lastActivity }: TopicProps = {}) {
		this.id = id ?? null;
		this.title = title ?? "";
		this.authorId = authorId ?? null;
		this.createdAt = createdAt ? new Date(createdAt) : new Date();
		this.postIds = Array.isArray(postIds) ? postIds.slice() : [];
		this.postCount = Number.isFinite(postCount) ? postCount : 0;
		this.lastActivity = lastActivity ? new Date(lastActivity) : null;
	}

	addPost(postId: string): number {
		if (postId && !this.postIds.includes(postId)) {
			this.postIds.push(postId);
		}
		return this.postIds.length;
	}

	toJSON(): {
		id: string | null;
		title: string;
		authorId: string | null;
		createdAt: Date;
		postIds: string[];
		postCount: number;
		lastActivity: Date | null;
	} {
		return {
			id: this.id,
			title: this.title,
			authorId: this.authorId,
			createdAt: this.createdAt,
			postIds: this.postIds.slice(),
			postCount: this.postCount,
			lastActivity: this.lastActivity,
		};
	}
}
