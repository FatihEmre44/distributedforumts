import { Post } from "../models/post";

export interface PostCreatedEvent {
	type: "post.created";
	post: ReturnType<Post["toJSON"]>;
}
