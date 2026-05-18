export interface UserProps {
	id?: string | null;
	username?: string;
	sadakatpuani?: number;
	postCount?: number;
}

export class User {
	id: string | null;
	username: string;
	sadakatpuani: number;
	postCount: number;

	constructor({ id, username, sadakatpuani = 0, postCount = 0 }: UserProps = {}) {
		this.id = id ?? null;
		this.username = username ?? "";
		this.sadakatpuani = Number.isFinite(sadakatpuani) ? sadakatpuani : 0;
		this.postCount = Number.isFinite(postCount) ? postCount : 0;
	}

	increaseSadakat(puan: number): number {
		const inc = Number.isFinite(puan) ? Math.floor(puan) : 0;
		if (inc > 0) {
			this.sadakatpuani += inc;
		}
		return this.sadakatpuani;
	}

	incrementPostCount(): number {
		this.postCount += 1;
		return this.postCount;
	}

	decrementPostCount(): number {
		this.postCount = Math.max(0, this.postCount - 1);
		return this.postCount;
	}

	toJSON(): { id: string | null; username: string; sadakatpuani: number; postCount: number } {
		return {
			id: this.id,
			username: this.username,
			sadakatpuani: this.sadakatpuani,
			postCount: this.postCount,
		};
	}
}
