import UpdateRepository from "../../Repositories/User/Update.js";
import UserRepository from "../../Repositories/User/User.js";
import AuthLoginRepository from "../../Repositories/User/AuthLogin.js";
import AuthTokenRepository from "../../Repositories/User/AuthToken.js";

import CompareSession from "../../../Utils/User/CompareSession.js";
import ComparePassword from "../../../Utils/User/ComparePassword.js";

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
			return { statuscode: 422, message: { error: "you have problems with your registered email" } }; 

		if (user.username === newUsername)
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
			return { statuscode: 422, message: { error: "you have problems with your registered email" } }; 

		if (await UpdateRepository.updateFullName(user._id, newFullName, user.full_name))
			return { statuscode: 204, message: { success: "successfully updated" } };
            
		return { statuscode: 400, message: { success: "error updating full_name" } };
	}

	async updatePasswordLoggedIn(session_id, password, newPassword, userAgent) {

		let session;

		if (! (session = await AuthLoginRepository.existSession(session_id) ))
			return { statuscode: 422, message: { error: "session id its invalid" } };
	
		if (! CompareSession(session, userAgent) ) {

			await AuthLoginRepository.disconnectUser(session_id);
	
			return { statuscode: 403, message: { error: "unauthorized, please re-login" } }; 
		}

		let user;

		if (! (user = await UserRepository.findUserById(session.user_id)) )
			return { statuscode: 422, message: { error: "you have problems with your registered email" } };

		if (! await ComparePassword(password, user.password ))
			return { statuscode: 403, message: { error: "invalid credentials" } };
			
		if (await ComparePassword(newPassword, user.password))
			return { statuscode: 422, message: { error: "the password entered is identical to" } };

		if (await UpdateRepository.updatePassword(user._id, newPassword)) {
			
			await AuthLoginRepository.disconnectUser(session_id);

			return { statuscode: 200, message: { success: "password has been changed" } };
		}
		
		return { statuscode: 400, message: { error: "Failed to change password" } };
	}

	async updateGenre(session_id, newGenre, userAgent) {

		let session;

		if (! (session = await AuthLoginRepository.existSession(session_id) ))
			return { statuscode: 422, message: { error: "session id its invalid" } };
	
		if (! CompareSession(session, userAgent) ) {

			await AuthLoginRepository.disconnectUser(session_id);
	
			return { statuscode: 403, message: { error: "unauthorized, please re-login" } }; 
		}

		let user;

		if (! (user = await UserRepository.findUserById(session.user_id)) )
			return { statuscode: 422, message: { error: "you have problems with your registered email" } };

		if (! await UpdateRepository.validateGenre(newGenre))
			return { statuscode: 422, message: { error: "genre invalid" } };

		if (await UpdateRepository.updateGenre(user._id, newGenre)) {

			await UserRepository.createLog(user._id, "change genre", newGenre, user.genre);

			return { statuscode: 200, message: { success: "genre change" } };
		}
	
		return { statuscode: 422, message: { error: "failed to change gender" } };
	}

	async updatePasswordWithToken(token, newPassword) {

		let tokenOwner;

		if(!(tokenOwner = await AuthTokenRepository.existToken(token, "change_password")))
			return { statuscode: 401, message: { error: "informed token is invalid" } };

		let user;

		if (! (user = await UserRepository.findUserById(tokenOwner.user_id)) )
			return { statuscode: 422, message: { error: "you have problems with your registered email" } };

		if (await ComparePassword(user.password, newPassword))
			return { statuscode: 403, message: { error: "the password entered is the same as the account" } };
			
		if (await UpdateRepository.updatePassword(user._id, newPassword)) {
			
			await AuthLoginRepository.disconnectMany(user._id);

			await AuthTokenRepository.updateToken(token, "change_password");

			return { statuscode: 200, message: { success: "password has been changed" } };
		}
		
		return { statuscode: 400, message: { error: "password change failed" } };
	}

	async updateEmail(token, new_email) {

		let tokenOwner;

		if (!(tokenOwner = await AuthTokenRepository.existToken(token, "change_email")))
			return { statuscode: 401, message: { error: "informed token is invalid" } };

		let user;

		if (! (user = await UserRepository.findUserById(tokenOwner.user_id)) )
			return { statuscode: 422, message: { error: "you have problems with your registered email" } };
			
		if (user.email === new_email)
			return { statuscode: 400, message: { error: "the email provided is the same as your account" } };

		if (await UserRepository.existEmail(new_email))
			return { statuscode: 400, message: { error: "email informado j?? existe" } };

		if (await UpdateRepository.updateEmail(user._id, new_email)) {
			
			await UserRepository.createLog(user._id, "change email", new_email, user.email);

			await AuthLoginRepository.disconnectMany(user._id);

			await AuthTokenRepository.updateToken(token, "change_email");

			return { statuscode: 200, message: { success: "email has been changed" } };
		}
		
		return { statuscode: 422, message: { error: "unable to proceed with update-email" } };
	}

	async deleteAccount(token) {

		let tokenOwner;

		if (!(tokenOwner = await AuthTokenRepository.existToken(token, "delete_account")))
			return { statuscode: 401, message: { error: "informed token is invalid" } };

		let user;

		if (! (user = await UserRepository.findUserById(tokenOwner.user_id)) )
			return { statuscode: 422, message: { error: "you have problems with your registered email" } };

		if (await UpdateRepository.deleteAccount(user._id)) {
			
			await AuthLoginRepository.disconnectMany(user._id);
	
			await AuthTokenRepository.updateToken(token, "delete_account");
	
			return { statuscode: 200, message: { success: "account has been deleted" } };
		}
			
		return { statuscode: 422, message: { error: "unable to proceed with account deletion" } };
	}
}

export default new UpdateServices;