import UserRepository from "../../Repositories/User/User.js";
import AuthLoginRepository from "../../Repositories/User/AuthLogin.js";

import ComparePassword from "../../../Utils/User/ComparePassword.js";

class AuthLoginServices {

	async createSession(email, password, userAgent) {
        
		let user;
        
		if (! (user = await UserRepository.existEmail(email)))
			return { statuscode: 422, message: { error: "email invalid" } };

		if (! await ComparePassword(password, user.password))
			return { statuscode: 403, message: { error: "invalid credentials" } };
        
		let session;

		if ((session = await AuthLoginRepository.createSession(email, user._id, userAgent)))
			return { statuscode: 200, 
				message: { session: { email: session.email, session_id: session.session_id, created_at: session.created_at } } };

		return { statuscode: 422, message: { error: "unable to complete the request" } };
	}
}

export default new AuthLoginServices;