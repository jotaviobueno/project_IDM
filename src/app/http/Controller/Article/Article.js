import ArticleServices from "../../Services/Article/Article.js";

class ArticleController {

	async storageArticle(req, res) {
		const userAgent = req.headers["user-agent"]; 
		const {session_id} = req.headers;
		const {title, body, articleImageUrl} = req.body;

		const stored = await ArticleServices.storageArticle(session_id, title, body, articleImageUrl, userAgent);

		return res.status(stored.statuscode).json(stored.message);
	}

	async addComment (req, res) {
		const userAgent = req.headers["user-agent"]; 
		const {session_id} = req.headers;
		const {article_id} = req.query;
		const {body} = req.body;

		const comment = await ArticleServices.addComment(session_id, body, article_id, userAgent);
		
		return res.status(comment.statuscode).json(comment.message);
	}

	async listAllArticles(req, res) {
		const {session_id} = req.headers;
		const userAgent = req.headers["user-agent"]; 

		const articles = await ArticleServices.listAllArticles(session_id, userAgent);
		
		return res.status(articles.statuscode).json(articles.message);
	}

	async listAnArticle(req, res) {
		const {session_id} = req.headers;
		const {article_id} = req.query;
		const userAgent = req.headers["user-agent"];

		await ArticleServices.listAnArticle(session_id, article_id, userAgent);
	}

}

export default new ArticleController;