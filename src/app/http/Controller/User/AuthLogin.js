import AuthLoginServices from "../../Services/User/AuthLogin.js";

class AuthLoginController {

	async createSession(req, res) {
		const userAgent = req.headers["user-agent"];
		const { email, password } = req.body;

		const session = await AuthLoginServices.createSession(email, password, userAgent);

		return res.status(session.statuscode).json(session.message);
	}

}

export default new AuthLoginController;