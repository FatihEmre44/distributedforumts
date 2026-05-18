export interface AiResultProps {
	id?: string | null;
	postId?: string | null;
	status?: string | null;
	score?: number;
	checkedAt?: Date | string | null;
}

export class AiResult {
	id: string | null;
	postId: string | null;
	status: string;
	score: number;
	checkedAt: Date | null;

	constructor({ id, postId, status = "pending", score = 0, checkedAt }: AiResultProps = {}) {
		this.id = id ?? null;
		this.postId = postId ?? null;
		this.status = status ?? "pending";
		this.score = Number.isFinite(score) ? score : 0;
		this.checkedAt = checkedAt ? new Date(checkedAt) : null;
	}

	update(status?: string | null, score?: number): { status: string; score: number; checkedAt: Date } {
		if (status !== undefined && status !== null) {
			this.status = status;
		}
		if (Number.isFinite(score)) {
			this.score = score as number;
		}
		this.checkedAt = new Date();
		return { status: this.status, score: this.score, checkedAt: this.checkedAt };
	}

	toJSON(): { id: string | null; postId: string | null; status: string; score: number; checkedAt: Date | null } {
		return {
			id: this.id,
			postId: this.postId,
			status: this.status,
			score: this.score,
			checkedAt: this.checkedAt,
		};
	}
}
