import UpdateRepository from "../../Repositories/User/Update.js";
import UserRepository from "../../Repositories/User/User.js";
import AuthLoginRepository from "../../Repositories/User/AuthLogin.js";

import CompareSession from "../../../Utils/User/CompareSession.js";

class UpdateServices {

	async updateUsername(session_id, newUsername, userAgent) {

		let session;

		if (! (session = await AuthLoginRepository.existSession(session_id) ))
			return { statuscode: 422, message: { error: "session id its invalid" } };
	
		if (! CompareSession(session, userAgent) ) {

			await AuthLoginRepository.disconnectUser(session_id);
	
			return { statuscode: 403, message: { error: "unauthorized, please re-login" } }; 
		}

		let user;

		if (! (user = await UserRepository.findUserById(session.user_id)) )
			return { statuscode: 401, message: { error: "you have problems with your registered email" } }; 

		if (user.username === newUsername.replace(" ", ""))
			return { statuscode: 422, message: { success: "you are trying to change the name to the same name as the account" } };

		if (await UpdateRepository.updateUsername(user._id, newUsername, user.username))
			return { statuscode: 204, message: { success: "successfully updated" } };
            
		return { statuscode: 400, message: { success: "error updating username" } };
	}

	async updateFullName(session_id, newFullName, userAgent) {

		let session;

		if (! (session = await AuthLoginRepository.existSession(session_id) ))
			return { statuscode: 422, message: { error: "session id its invalid" } };
	
		if (! CompareSession(session, userAgent) ) {

			await AuthLoginRepository.disconnectUser(session_id);
	
			return { statuscode: 403, message: { error: "unauthorized, please re-login" } }; 
		}

		let user;

		if (! (user = await UserRepository.findUserById(session.user_id)) )
			return { statuscode: 401, message: { error: "you have problems with your registered email" } }; 

		if (await UpdateRepository.updateFullName(user._id, newFullName, user.full_name))
			return { statuscode: 204, message: { success: "successfully updated" } };
            
		return { statuscode: 400, message: { success: "error updating full_name" } };
	}
}

export default new UpdateServices;