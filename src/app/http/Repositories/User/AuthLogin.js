// Models
import SessionModel from "../../../Models/User/Session.js";

import ip from "ip";
import {nanoid} from "nanoid";

class AuthLoginRepository {

	async createSession(email, user_id, userAgent) {
		return await SessionModel.create({
			email: email,
			address_ip: ip.address(),
			user_agent: userAgent,
			session_id: nanoid(),
			user_id: user_id,
			updated_at: new Date(),
			created_at: new Date(),
			disconnected_in: null,
		});
	}

}

export default new AuthLoginRepository;