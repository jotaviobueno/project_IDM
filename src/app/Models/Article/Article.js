import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Model
const Article = new Schema({

	title: { type: String, required: true },
	body: { type: String, required: true },
	article_image_url: { type: String },
	user_id: { type: String, required: true },
	author_article: { type: String, required: true },
	views: { type: Number, required: true },
	like: { type: Number, required: true },
	liked: { type: [String] },
	article_id: { type: String, required: true },
	comment_info: [{
		user_id: Object,
		body: String,
		id: String,
	}],
	created_at: { type: Date, default: Date.now, required: true },
	updated_at: { type: Date, required: true },
	deleted_at: { type: Date }
});

export default mongoose.model("Article", Article);