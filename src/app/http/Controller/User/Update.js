import UpdateServices from "../../Services/User/Update.js";

class UpdateController {

	async updateUsername(req, res) {
		const {session_id} = req.headers;
		const userAgent = req.headers["user-agent"];
		const {new_username} = req.body;

		const update = await UpdateServices.updateUsername(session_id, new_username, userAgent);

		return res.status(update.statuscode).json(update.message);
	}

}

export default new UpdateController;