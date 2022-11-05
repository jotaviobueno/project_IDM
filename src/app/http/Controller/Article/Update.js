import UpdateServices from "../../Services/Article/Update.js";

class Update {

	async updateTitle(req, res) {
		const userAgent = req.headers["user-agent"];
		const {session_id} = req.headers;
		const {article_id} = req.query;
		const {new_title} = req.body;

		const update = await UpdateServices.updateTitle(session_id, article_id, new_title, userAgent);

		return res.status(update.statuscode).json(update.message);
	}

	async updateBody(req, res) {
		const userAgent = req.headers["user-agent"];
		const {session_id} = req.headers;
		const {article_id} = req.query;
		const {new_body} = req.body;

		const update = await UpdateServices.updateBody(session_id, article_id, new_body, userAgent);

		return res.status(update.statuscode).json(update.message);
	}

}

export default new Update;