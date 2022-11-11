import UserRepository from "../../Repositories/User/User.js";
import AuthLoginRepository from "../../Repositories/User/AuthLogin.js";
import ArticleRepository from "../../Repositories/Article/Article.js";

import CompareSession from "../../../Utils/User/CompareSession.js";

class UserServices {

	async storage(user) {
        
		if (await UserRepository.existEmail(user.email))
			return { statuscode: 422, message: { error: "invalid credentials" } };

		if (await UserRepository.existUsername(user.username))
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
					friends: user.friends,
					article_owner: user.article_owner,
					created_at: user.created_at,
					updated_at: user.updated_at,
					update_logs: user.update_logs,
				},

				articles: await ArticleRepository.findArticleByOwner(user._id)
			}};
			
		return { statuscode: 422, message: { error: "unable to complete the request" } };
	}

	async outherProfiles(session_id, username, userAgent) {
		let session;

		if (! (session = await AuthLoginRepository.existSession(session_id) ))
			return { statuscode: 422, message: { error: "session id its invalid" } };
	
		if (! CompareSession(session, userAgent) ) {

			await AuthLoginRepository.disconnectUser(session_id);
	
			return { statuscode: 403, message: { error: "unauthorized, please re-login" } }; 
		}

		if (! await UserRepository.findUserById(session.user_id) )
			return { statuscode: 401, message: { error: "you have problems with your registered email" } }; 

		let outherUser;

		if ((outherUser = await UserRepository.existUsername(username)))
			return { statuscode: 200, message: { 
				user: {
					full_name: outherUser.full_name,
					username: outherUser.username,
					email: outherUser.email,
					email_verified: outherUser.email_verified,
					avatar_url: outherUser.avatar_url,
					genre: outherUser.genre,
					birth_date: outherUser.birth_date,
					resident_country: outherUser.resident_country,
					friends: outherUser.friends,
					created_at: outherUser.created_at,
				},

				articles: await ArticleRepository.findArticleByOwner(outherUser._id)
			}};

		return { statuscode: 404, message: { error: "username not found" } };
	}

	async sendFriendRequest(session_id, username, userAgent) {
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

		let outherUser;

		if (! (outherUser = await UserRepository.existUsername(username) ))
			return;

		if (! await UserRepository.alreadySentAFriendRequest(user._id.toString(), outherUser._id))
			return { statuscode: 422, message: { error: "Have you ever sent a friend request to this person?" } };
			
		else {
			
			if (await UserRepository.sendFriendRequest(user._id, outherUser._id))
				return { statuscode: 200, message: { success: "friend request sent successfully" } };

			return { statuscode: 400, message: { error: "failed to send friend request" } };
		}
	}
}

export default new UserServices;