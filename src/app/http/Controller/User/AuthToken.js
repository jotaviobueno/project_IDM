import AuthTokenServices from "../../Services/User/AuthToken.js";

class AuthtokenController {

	async createTokenToVerifyAccount(req, res) {
		const {session_id} = req.headers;
		const userAgent = req.headers["user-agent"];

		const token = await AuthTokenServices.createTokenToVerifyAccount(session_id, userAgent);

		return res.status(token.statuscode).json(token.message);
	}

	async verifyAccount(req, res) {
		const {auth_token} = req.headers;
		const {session_id} = req.headers;
		const userAgent = req.headers["user-agent"];

		const token = await AuthTokenServices.verifyAccount(session_id, auth_token, userAgent);
	
		return res.status(token.statuscode).json(token.message);
	}

}

export default new AuthtokenController;