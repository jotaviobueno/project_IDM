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
}

export default new ArticleServices;