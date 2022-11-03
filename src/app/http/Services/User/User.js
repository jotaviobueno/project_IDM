import UserRepository from "../../Repositories/User/User.js";
import AuthLoginRepository from "../../Repositories/User/AuthLogin.js";

import CompareSession from "../../../Utils/User/CompareSession.js";

class UserServices {

	async storage(user) {
        
		if (await UserRepository.existEmail(user.email))
			return { statuscode: 422, message: { error: "invalid credentials" } };

		if (await UserRepository.existUsername(user.username.replace(" ", "")))
			return { statuscode: 422, message: { error: "user name already exists" } };

		let stored;

		if ((stored = await UserRepository.storageUser(user)))
			return { statuscode: 201, message: { 
				success: "account created",
				user: {
					full_name: stored.full_name,
					username: stored.username,
					email: stored.email,
					email_verified: stored.email_verified,
					avatar_url: stored.avatar_url,
					genre: stored.genre,
					birth_date: stored.birth_date,
					resident_country: stored.resident_country,
				}
			}};

		return { statuscode: 422, message: { error: "unable to complete the request" } };
	}

	async profile(session_id, userAgent) {
		
		let session;

		if (! (session = await AuthLoginRepository.existSession(session_id) ))
			return { statuscode: 422, message: { error: "session id its invalid" } };
	
		if (! CompareSession(session, userAgent) ) {

			await AuthLoginRepository.disconnectUser(session_id);
	
			return { statuscode: 403, message: { error: "unauthorized, please re-login" } }; 
		}

		let user;

		if ((user = await UserRepository.findUserById(session.user_id) ))
			return { statuscode: 200, message: { 
				user: {
					full_name: user.full_name,
					username: user.username,
					email: user.email,
					email_verified: user.email_verified,
					avatar_url: user.avatar_url,
					genre: user.genre,
					birth_date: user.birth_date,
					resident_country: user.resident_country,
					reports: user.reports,
					friends: user.friends,
					article_owner: user.article_owner,
					created_at: user.created_at,
					updated_at: user.updated_at,
					update_logs: user.update_logs,
				}
			}};
			
		return { statuscode: 422, message: { error: "unable to complete the request" } };
	}

}

export default new UserServices;