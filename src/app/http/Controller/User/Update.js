import UpdateServices from "../../Services/User/Update.js";

class UpdateController {

	async updateUsername(req, res) {
		const {session_id} = req.headers;
		const userAgent = req.headers["user-agent"];
		let {new_username} = req.body;

		new_username = new_username.replace(" ", ""); 

		const update = await UpdateServices.updateUsername(session_id, new_username, userAgent);

		return res.status(update.statuscode).json(update.message);
	}

	async updateFullName(req, res) {
		const {session_id} = req.headers;
		const userAgent = req.headers["user-agent"];
		const {new_full_name} = req.body;

		const update = await UpdateServices.updateFullName(session_id, new_full_name, userAgent);

		return res.status(update.statuscode).json(update.message);
	}

	async updatePasswordLoggedIn(req, res) {
		const {session_id} = req.headers;
		const userAgent = req.headers["user-agent"];
		const {password, new_password} = req.body;
		
		const update = await UpdateServices.updatePasswordLoggedIn(session_id, password, new_password, userAgent);

		return res.status(update.statuscode).json(update.message);
	} 

	async updateGenre(req, res) {
		const {session_id} = req.headers;
		const userAgent = req.headers["user-agent"];
		let {new_genre} = req.body;

		const result = new_genre.toUpperCase();

		const update = await UpdateServices.updateGenre(session_id, result, userAgent);

		return res.status(update.statuscode).json(update.message);
	}

	async updatePasswordWithToken(req, res) {
		const {token} = req.headers;
		const {new_password} = req.body;

		const change = await UpdateServices.updatePasswordWithToken(token, new_password);

		return res.status(change.statuscode).json(change.message);
	}

	async updateEmail(req, res) {
		const {token} = req.headers;
		const {new_email} = req.body;

		const change = await UpdateServices.updateEmail(token, new_email);

		return res.status(change.statuscode).json(change.message);
	}

	async deleteAccount(req, res) {
		const {token} = req.headers;

		const deleteAccount = await UpdateServices.deleteAccount(token);

		return res.status(deleteAccount.statuscode).json(deleteAccount.message);
	}
}

export default new UpdateController;