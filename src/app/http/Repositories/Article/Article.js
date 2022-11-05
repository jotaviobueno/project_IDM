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
			{$push: { comment_info: {user_id: user_id, body: body, id: nanoid() }}, updated_at: new Date() });

		if (update.matchedCount === 1)
			return true;

		return false;
	}

	async listAllArticles() {
		return await ArticleModel.find({}).select({
			views: 0,
			like: 0,
			liked: 0,
			comment_info: 0,
			created_at: 0,
			updated_at: 0,
			deleted_at: 0,
			_id: 0,
			__v: 0,
			user_id: 0
		});
	}

	async listingAllComment(articleComment) {
		let comments = [];

		for (let index = 0; index < articleComment.length; index++) {
			let comment = articleComment[index];

			let user = await UserModel.findOne({_id: comment.user_id, deleted_at: null});

			if (user) {
				const obj = Object.assign({
					username: user.username,
					avatar_url: user.avatar_url
				}, {
					comment: {
						body: comment.body,
						comment_id: comment.id
					}
				});
	
				comments.push(obj);
			}
		}

		return comments; 
	}

	async verifyOwner(articleOwner, article_id) {

		let isOwner = [];

		for (let index = 0; index < articleOwner.length; index++) {
			const articleId = articleOwner[index];
			
			if (articleId === article_id)
				isOwner.push(articleId);

		}

		if (isOwner.length === 1)
			return true;

		return false;
	}

	async addViews(article_id, totalViews) {
		await ArticleModel.updateOne({_id: article_id, deleted_at: null}, { views: parseInt(totalViews) + 1, updated_at: new Date() });
	}

	async findArticleByOwner(user_id) {
		return  ArticleModel.find({user_id: user_id, deleted_at: null}).select({
			_id: 0,
			liked: 0,
			comment_info: 0,
			__v: 0,
			created_at: 0,
			updated_at: 0,
			deleted_at: 0,
		});
	}
}

export default new ArticleRepository;