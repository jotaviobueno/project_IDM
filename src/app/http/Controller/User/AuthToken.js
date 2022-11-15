import AuthTokenServices from "../../Services/User/AuthToken.js";

class AuthtokenController {

	async generationTokenToVerifyAccount(req, res) {
		const {session_id} = req.headers;
		const userAgent = req.headers["user-agent"];

		const token = await AuthTokenServices.generationTokenToVerifyAccount(session_id, userAgent);

		return res.status(token.statuscode).json(token.message);
	}

	async verifyAccount(req, res) {
		const {auth_token} = req.headers;
		const {session_id} = req.headers;
		const userAgent = req.headers["user-agent"];

		const token = await AuthTokenServices.verifyAccount(session_id, auth_token, userAgent);
	
		return res.status(token.statuscode).json(token.message);
	}

	async generationTokenTochangePassword(req, res) {
		const {email} = req.body;

		const token = await AuthTokenServices.generationTokenTochangePassword(email);

		return res.status(token.statuscode).json(token.message);
	}

	async generationTokenToChangeEmail(req, res) {
		const {session_id} = req.headers;
		const {password} = req.body;
		const userAgent = req.headers["user-agent"];

		const token = await AuthTokenServices.generationTokenToChangeEmail(session_id, password, userAgent);

		return res.status(token.statuscode).json(token.message);
	}

	async generationTokenToDeleteAccount(req, res) {
		const {session_id} = req.headers;
		const {password} = req.body;
		const userAgent = req.headers["user-agent"];

		const token = await AuthTokenServices.generationTokenToDeleteAccount(session_id, password, userAgent);
	
		return res.status(token.statuscode).json(token.message);
	}
}

export default new AuthtokenController;