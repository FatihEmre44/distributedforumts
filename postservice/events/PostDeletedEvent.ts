import { Post } from "../models/post";

export interface PostDeletedEvent {
	type: "post.deleted";
	post: ReturnType<Post["toJSON"]>;
}
