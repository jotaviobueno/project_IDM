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

}

export default new ArticleRepository;