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

	async listingAllLiked(liked) {

		let users = [];

		for (let index = 0; index < liked.length; index++) {
			const user_id = liked[index];
			
			const user = await UserModel.findOne({_id: user_id, deleted_at: null}).select({
				_id: 0,
				full_name: 0,
				email: 0,
				email_verified: 0,
				password: 0,
				genre: 0,
				birth_date: 0,
				resident_country: 0,
				reports: 0,
				friends: 0,
				article_owner: 0,
				permissions: 0,
				created_at: 0,
				updated_at: 0,
				update_logs: 0,
				deleted_at: 0,
				__v: 0
			});

			if (user)
				users.push(user);
		}

		return users;
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

	async verifyLike(liked, _id) {

		let test = [];

		for (let index = 0; index < liked.length; index++) {
			const user_id = liked[index];

			if (user_id === _id.toString()) 
				test.push(user_id);
		}

		if (test.length > 0 )
			return true;

		return false;
	}

	async removeLike(article_id, totalLike, user_id) {
		const update = await ArticleModel.updateOne({_id: article_id, deleted_at: null}, 
			{ $pull: { liked: user_id.toString() }, like: parseInt(totalLike) - parseInt(1), updated_at: new Date() });

		if (update.matchedCount === 1)
			return true;

		return false;
	}

	async addLike(article_id, totalLike, user_id) {
		const update = await ArticleModel.updateOne({_id: article_id, deleted_at: null}, {
			like: parseInt(totalLike) + 1, updated_at: new Date(), $push: {
				liked: user_id
			}
		});

		if (update.matchedCount === 1)
			return true;

		return false;
	}
}

export default new ArticleRepository;