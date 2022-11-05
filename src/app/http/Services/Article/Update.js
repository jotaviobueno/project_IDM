import UpdateRepository from "../../Repositories/Article/Update.js";
import ArticleRepository from "../../Repositories/Article/Article.js";
import UserRepository from "../../Repositories/User/User.js";
import AuthLoginRepository from "../../Repositories/User/AuthLogin.js";

import CompareSession from "../../../Utils/User/CompareSession.js";

class UpdateServices {

	async updateTitle(session_id, article_id, newTitle, userAgent) {

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
    
		if (article.title === newTitle)
			return { statuscode: 401, message: { error: "you are trying to change the title to the current title" } };

		if (! await ArticleRepository.verifyOwner(user.article_owner, article_id))
			return;

		if (await UpdateRepository.updateTitle(article._id, newTitle)) {

			await UserRepository.createLog(user._id, "updated the title in the article", newTitle, article.title, article_id);

			return { statuscode: 204, message: { success: " " } };
		}
        
		return { statuscode: 422, message: { error: "title update failed" } }; 
	}

	async updateBody(session_id, article_id, newBody, userAgent) {

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
    
		if (! await ArticleRepository.verifyOwner(user.article_owner, article_id))
			return;

		if (await UpdateRepository.updateBody(article._id, newBody)) {

			await UserRepository.createLog(user._id, "updated the body in the article", newBody, article.body, article_id);

			return { statuscode: 204, message: { success: " " } };
		}
        
		return { statuscode: 422, message: { error: "title update failed" } }; 
	}

}

export default new UpdateServices;