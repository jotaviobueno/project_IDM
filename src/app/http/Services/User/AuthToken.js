import UserRepository from "../../Repositories/User/User.js";
import AuthLoginRepository from "../../Repositories/User/AuthLogin.js";
import AuthTokenRepository from "../../Repositories/User/AuthToken.js";

import CompareSession from "../../../Utils/User/CompareSession.js";
import ComparePassword from "../../../Utils/User/ComparePassword.js";

class AuthTokenServices {

	async generationTokenToVerifyAccount(session_id, userAgent) {

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

		if (user.email_verified)
			return { statuscode: 422, message: { error: "your account is already verified" } };

		await AuthTokenRepository.seeUserTokenAmounts(user._id, "authenticate_account");

		let token;
		
		if ((token = await AuthTokenRepository.generationToken(user._id, user.email, "authenticate_account")))
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
			return { statuscode: 422, message: { error: "you have problems with your registered email" } };

		if (user.email_verified)
			return { statuscode: 422, message: { error: "your account is already verified" } };

		if (await AuthTokenRepository.existToken(auth_token, "authenticate_account")) {

			if (await AuthTokenRepository.updateToken(auth_token, "authenticate_account")) {

				await AuthTokenRepository.updateUser(user._id);

				await UserRepository.createLog(user._id, "account verified");

				return { statuscode: 200, message: { error: "account verified" } }; 
			}

			return { statuscode: 422, message: { error: "failed to verify the account" } }; 
		}

		return { statuscode: 400, message: { error: "token informed does not exist" } }; 
	}

	async generationTokenTochangePassword(email) {

		let user;

		if (! (user = await UserRepository.existEmail(email)) )
			return { statuscode: 401, message: { error: "informed and invalid email" } };

		await AuthTokenRepository.seeUserTokenAmounts(user._id, "change_password");

		let token;

		if ((token = await AuthTokenRepository.generationToken(user._id, user.email, "change_password")))
			return { statuscode: 201, message: { token: token.token, expires_at: token.expires_at } };


		return { statuscode: 422, message: { eror: "failed to generate token" }};
	}

	async generationTokenToChangeEmail(session_id, password, userAgent) {

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

		if (! await ComparePassword(password, user.password))
			return { statuscode: 403, message: { error: "invalid credentials" } };

		await AuthTokenRepository.seeUserTokenAmounts(user._id, "change_email");

		let token;
		
		if ((token = await AuthTokenRepository.generationToken(user._id, user.email, "change_email")))
			return { statuscode: 201, message: { token: token.token, expires_at: token.expires_at } };
	
		return { statuscode: 422, message: { error: "failed to generate a new token" } };
	}

	async generationTokenToDeleteAccount(session_id, password, userAgent) {

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

		if (! await ComparePassword(password, user.password))
			return { statuscode: 403, message: { error: "invalid credentials" } };

		await AuthTokenRepository.seeUserTokenAmounts(user._id, "delete_account");

		let token;
		
		if ((token = await AuthTokenRepository.generationToken(user._id, user.email, "delete_account")))
			return { statuscode: 201, message: { token: token.token, expires_at: token.expires_at } };
	
		return { statuscode: 422, message: { error: "failed to generate a new token" } };
	}
}

export default new AuthTokenServices;