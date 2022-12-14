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

		const article = await ArticleServices.listAnArticle(session_id, article_id, userAgent);

		return res.status(article.statuscode).json(article.message);
	}

	async addLike(req, res) {
		const {session_id} = req.headers;
		const {article_id} = req.query;
		const userAgent = req.headers["user-agent"];

		const update = await ArticleServices.addLike(session_id, article_id, userAgent);

		return res.status(update.statuscode).json(update.message);
	}

	async deleteArticle(req, res) {
		const {session_id} = req.headers;
		const {article_id} = req.query;
		const userAgent = req.headers["user-agent"];

		const deleteArticle = await ArticleServices.deleteArticle(session_id, article_id, userAgent);
		
		return res.status(deleteArticle.statuscode).json(deleteArticle.message);
	}

	async deleteComment(req, res) {
		const {session_id} = req.headers;
		const {article_id, comment_id} = req.query;
		const userAgent = req.headers["user-agent"];

		const deleteComment = await ArticleServices.deleteComment(session_id, article_id, comment_id, userAgent);
	
		return res.status(deleteComment.statuscode).json(deleteComment.message);
	}

	async updateComment(req, res) {
		const {session_id} = req.headers;
		const {article_id, comment_id} = req.query;
		const {new_body} = req.body;
		const userAgent = req.headers["user-agent"];

		const updateComment = await ArticleServices.updateCommnet(session_id, article_id, comment_id, new_body, userAgent);

		return res.status(updateComment.statuscode).json(updateComment.message);
	}
}

export default new ArticleController;