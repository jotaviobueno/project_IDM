import UserRepository from "../../Repositories/User/User.js";
import AuthLoginRepository from "../../Repositories/User/AuthLogin.js";
import AuthTokenRepository from "../../Repositories/User/AuthToken.js";

import CompareSession from "../../../Utils/User/CompareSession.js";

class AuthTokenServices {

	async createTokenToVerifyAccount(session_id, userAgent) {

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

		if (user.email_verified)
			return { statuscode: 422, message: { error: "your account is already verified" } };

		await AuthTokenRepository.seeUserTokenAmounts(user._id.toString());

		let token;
		
		if ((token = await AuthTokenRepository.generationTokenToAuthAccount(user._id, user.email)))
			return { statuscode: 201, message: { token: token.token, expires_at: token.expires_at } };

		return { statuscode: 422, message: { error: "failed to generate a new token" } };
	}

	async verifyAccount(session_id, auth_token, userAgent) {

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

		if (user.email_verified)
			return { statuscode: 422, message: { error: "your account is already verified" } };

		if (await AuthTokenRepository.existToken(user._id, auth_token)) {

			if (await AuthTokenRepository.updateToken(user._id)) {

				await AuthTokenRepository.updateUser(user._id);

				await UserRepository.createLog(user._id, "account verified");

				return { statuscode: 200, message: { error: "account verified" } }; 
			}

			return { statuscode: 422, message: { error: "failed to verify the account" } }; 
		}

		return { statuscode: 400, message: { error: "token informed does not exist" } }; 
	}

}

export default new AuthTokenServices;