import ArticleModel from "../../../Models/Article/Article.js";
import UserModel from "../../../Models/User/User.js";

import { nanoid } from "nanoid";

class ArticleRepository {

	async storageArticle(title, body, articleImageUrl, user_id, username ) {
		return await ArticleModel.create({
			title: title,
			body: body,
			article_image_url: articleImageUrl ?? null,
			user_id: user_id,
			author_article: username,
			views: 0,
			like: 0,
			liked: [],
			article_id: nanoid(),
			comment_info: [],
			created_at: new Date(),
			updated_at: new Date(),
			deleted_at: null,
		});
	}

	async addOwner(_id, article_id) {
		await UserModel.updateOne({_id: _id, deleted_at: null}, { $push: { article_owner: article_id }});
	}

	async existArticle(article_id) {
		try {

			const article = await ArticleModel.findOne({article_id: article_id, deleted_at: null});

			if (! article)
				return false;

			return article;

		} catch (e) {
			return false;
		}
	}

	async addComment(article_id, user_id, body) {
		const update = await ArticleModel.updateOne({_id: article_id, deleted_at: null}, 
			{$push: { comment_info: {user_id: user_id, body: body }}, updated_at: new Date() });

		if (update.matchedCount === 1)
			return true;

		return false;
	}
}

export default new ArticleRepository;