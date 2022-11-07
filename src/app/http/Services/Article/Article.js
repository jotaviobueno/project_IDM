import ArticleRepository from "../../Repositories/Article/Article.js";
import AuthLoginRepository from "../../Repositories/User/AuthLogin.js";
import UserRepository from "../../Repositories/User/User.js";

import CompareSession from "../../../Utils/User/CompareSession.js";

class ArticleServices {

	async storageArticle(session_id, title, body, articleImageUrl, userAgent) {

		let session;

		if (! (session = await AuthLoginRepository.existSession(session_id) ))
			return { statuscode: 422, message: { error: "session id its invalid" } };
	
		if (! CompareSession(session, userAgent) ) {

			await AuthLoginRepository.disconnectUser(session_id);
	
			return { statuscode: 403, message: { error: "unauthorized, please re-login" } }; 
		}

		let user;

		if (! (user = await UserRepository.findUserById(session.user_id)) )
			return { statuscode: 401, message: { error: "you have problems with your registered email" } };
        
		let article;

		if ((article = await ArticleRepository.storageArticle(title, body, articleImageUrl, user._id, user.username))) {
            
			await ArticleRepository.addOwner(user._id, article.article_id);

			return { statuscode: 201, message: { 
				success: "article created",
				title: article.title,
				body: article.body,
				article_image_url: article.article_image_url,
				author_article: article.author_article,
				views: article.views,
				like: article.like,
				liked: article.liked,
				article_id: article.article_id,
				comment_info: article.comment_info,
				created_at: article.created_at,
				updated_at: article.updated_at,
			}, };
		}
 
		return { statuscode: 400, message: { error: "Could not create article..." } };
	}

	async addComment(session_id, body, article_id, userAgent) {
		
		let article;

		if (! (article = await ArticleRepository.existArticle(article_id)))
			return { statuscode: 422, message: { error: "article id its invalid" } };

		let session;

		if (! (session = await AuthLoginRepository.existSession(session_id) ))
			return { statuscode: 422, message: { error: "session id its invalid" } };
	
		if (! CompareSession(session, userAgent) ) {

			await AuthLoginRepository.disconnectUser(session_id);
	
			return { statuscode: 403, message: { error: "unauthorized, please re-login" } }; 
		}

		let user;

		if (! (user = await UserRepository.findUserById(session.user_id)) )
			return { statuscode: 401, message: { error: "you have problems with your registered email" } };

		if (await ArticleRepository.addComment(article._id, user._id, body))
			return { statuscode: 204, message: { success: " " } };

		return { statuscode: 422, message: { error: "failed to add comment" } };
	}

	async listAllArticles(session_id, userAgent) {

		let session;

		if (! (session = await AuthLoginRepository.existSession(session_id) ))
			return { statuscode: 422, message: { error: "session id its invalid" } };
	
		if (! CompareSession(session, userAgent) ) {

			await AuthLoginRepository.disconnectUser(session_id);
	
			return { statuscode: 403, message: { error: "unauthorized, please re-login" } }; 
		}

		if (! await UserRepository.findUserById(session.user_id) )
			return { statuscode: 401, message: { error: "you have problems with your registered email" } };

		let articles;

		if ((articles = await ArticleRepository.listAllArticles()))
			return { statuscode: 200, message: { articles } };

		return { statuscode: 422, message: { error: "article listing failure" } };
	}

	async listAnArticle(session_id, article_id, userAgent) {

		let article;

		if (! (article = await ArticleRepository.existArticle(article_id)))
			return { statuscode: 422, message: { error: "article id its invalid" } };

		let session;

		if (! (session = await AuthLoginRepository.existSession(session_id) ))
			return { statuscode: 422, message: { error: "session id its invalid" } };
	
		if (! CompareSession(session, userAgent) ) {

			await AuthLoginRepository.disconnectUser(session_id);
	
			return { statuscode: 403, message: { error: "unauthorized, please re-login" } }; 
		}

		if (! await UserRepository.findUserById(session.user_id) )
			return { statuscode: 401, message: { error: "you have problems with your registered email" } };

		if (article) {

			await ArticleRepository.addViews(article._id, article.views);

			return { statuscode: 200, message: { 
				article: {
					title: article.title,
					body: article.body,
					article_image_url: article.article_image_url,
					author_article: article.author_article,
					views: article.views,
					like: article.like,
					article_id: article.article_id,
				}, 
				comments: await ArticleRepository.listingAllComment(article.comment_info),
				liked: await ArticleRepository.listingAllLiked(article.liked)
			}};
		}

		return { statuscode: 422, message: { error: "article listing error" } };
	}

	async addLike(session_id, article_id, userAgent) {

		let article;

		if (! (article = await ArticleRepository.existArticle(article_id)))
			return { statuscode: 422, message: { error: "article id its invalid" } };

		let session;

		if (! (session = await AuthLoginRepository.existSession(session_id) ))
			return { statuscode: 422, message: { error: "session id its invalid" } };
	
		if (! CompareSession(session, userAgent) ) {

			await AuthLoginRepository.disconnectUser(session_id);
	
			return { statuscode: 403, message: { error: "unauthorized, please re-login" } }; 
		}

		let user;

		if (! (user = await UserRepository.findUserById(session.user_id)) )
			return { statuscode: 401, message: { error: "you have problems with your registered email" } };

		if (await ArticleRepository.verifyLike(article.liked, user._id)) {
			
			if (await ArticleRepository.removeLike(article._id, article.like, user._id))
				return { statuscode: 204, message: { success: "" } };

			return { statuscode: 422, message: { error: "Failed to like or remove" } };
		}

		if (await ArticleRepository.addLike(article._id, article.like, user._id))
			return { statuscode: 204, message: { success: "" } };

		return { statuscode: 422, message: { error: "failed to like" } };
	}

	async deleteArticle(session_id, article_id, userAgent) {

		let article;

		if (! (article = await ArticleRepository.existArticle(article_id)))
			return { statuscode: 422, message: { error: "article id its invalid" } };

		let session;

		if (! (session = await AuthLoginRepository.existSession(session_id) ))
			return { statuscode: 422, message: { error: "session id its invalid" } };
	
		if (! CompareSession(session, userAgent) ) {

			await AuthLoginRepository.disconnectUser(session_id);
	
			return { statuscode: 403, message: { error: "unauthorized, please re-login" } }; 
		}

		let user;

		if (! (user = await UserRepository.findUserById(session.user_id)) )
			return { statuscode: 401, message: { error: "you have problems with your registered email" } };

		if (await ArticleRepository.verifyOwner(user.article_owner, article_id)) {

			if (await ArticleRepository.deleteArticle(article._id)) {
			
				await UserRepository.createLog(user._id, "deleted article", null, null, article.article_id);
				
				return { statuscode: 200, message: { success: "article deleted" } }; 
			}

			return { statuscode: 422, message: { error: "article deletion failed" } }; 
		}

		return { statuscode: 401, message: { error: "not authorized" } }; 		
	}

	async deleteComment(session_id, article_id, comment_id, userAgent) {

		let article;

		if (! (article = await ArticleRepository.existArticle(article_id)))
			return { statuscode: 422, message: { error: "article id its invalid" } };

		let session;

		if (! (session = await AuthLoginRepository.existSession(session_id) ))
			return { statuscode: 422, message: { error: "session id its invalid" } };
	
		if (! CompareSession(session, userAgent) ) {

			await AuthLoginRepository.disconnectUser(session_id);
	
			return { statuscode: 403, message: { error: "unauthorized, please re-login" } }; 
		}

		let user;

		if (! (user = await UserRepository.findUserById(session.user_id)) )
			return { statuscode: 401, message: { error: "you have problems with your registered email" } };
		
		if (await ArticleRepository.existComment(article._id, comment_id, user._id)) {
		
			if (await ArticleRepository.deleteComment(article._id, comment_id, user._id)) {
				
			}
		}

	}
}

export default new ArticleServices;