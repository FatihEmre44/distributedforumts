import { AiResult, AiResultProps } from "../models/ai";

export class AiService {
	private resultsByPostId: Map<string, AiResult>;

	constructor() {
		this.resultsByPostId = new Map();
	}

	async createResult({ id, postId, status = "pending", score = 0, checkedAt }: AiResultProps = {}): Promise<AiResult> {
		const result = new AiResult({ id, postId, status, score, checkedAt });
		if (!result.postId) {
			throw new Error("Post id is required");
		}
		this.resultsByPostId.set(result.postId, result);
		return result;
	}

	async findByPostId(postId: string): Promise<AiResult | null> {
		return this.resultsByPostId.get(postId) ?? null;
	}

	async updateResult(postId: string, status?: string | null, score?: number): Promise<AiResult | null> {
		const result = await this.findByPostId(postId);
		if (!result) {
			return null;
		}
		result.update(status, score);
		return result;
	}

	async deleteResult(postId: string): Promise<boolean> {
		return this.resultsByPostId.delete(postId);
	}
}
