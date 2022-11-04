import ArticleServices from "../../Services/Article/Article.js";

class ArticleController {

	async storageArticle(req, res) {
		const userAgent = req.headers["user-agent"]; 
		const {session_id} = req.headers;
		const {title, body, articleImageUrl} = req.body;

		const stored = await ArticleServices.storageArticle(session_id, title, body, articleImageUrl, userAgent);

		return res.status(stored.statuscode).json(stored.message);
	}

	// async addComment () {
	// 	const userAgent = req.headers["user-agent"]; 
	// 	const {session_id} = req.headers;
	// 	const {body} = req.body;

	// 	title, body, articleImageUrl, user_id, username;

	// 	await ArticleServices.storageArticle(session_id, body, userAgent);
	// }

}

export default new ArticleController;