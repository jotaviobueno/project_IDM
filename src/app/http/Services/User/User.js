import UserRepository from "../../Repositories/User/User.js";
import AuthLoginRepository from "../../Repositories/User/AuthLogin.js";
import ArticleRepository from "../../Repositories/Article/Article.js";
import AuthTokenRepository from "../../Repositories/User/AuthToken.js";

import CompareSession from "../../../Utils/User/CompareSession.js";

class UserServices {

	async storage(user) {
        
		if (await UserRepository.existEmail(user.email))
			return { statuscode: 422, message: { error: "invalid credentials" } };

		if (await UserRepository.existUsername(user.username))
			return { statuscode: 422, message: { error: "user name already exists" } };

		let stored;

		if ((stored = await UserRepository.storageUser(user))) {

			const token = await AuthTokenRepository.generationToken(stored._id, stored.email, "authenticate_account");

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
				},

				auth_token: token.token,
				expires_at: token.expires_at
			}};
		}

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
					article_owner: user.article_owner,
					created_at: user.created_at,
					updated_at: user.updated_at,
					update_logs: user.update_logs,
				},

				articles: await ArticleRepository.findArticleByOwner(user._id),
				received_friend_requests: user.request_received,
				friend_requests_sent: user.friend_request_sent,
				friends: await UserRepository.seeAllFriends(user.friends)
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
			return { statuscode: 422, message: { error: "you have problems with your registered email" } }; 

		let otherUser;

		if ((otherUser = await UserRepository.existUsername(username)))
			return { statuscode: 200, message: { 
				user: {
					full_name: otherUser.full_name,
					username: otherUser.username,
					email: otherUser.email,
					email_verified: otherUser.email_verified,
					avatar_url: otherUser.avatar_url,
					genre: otherUser.genre,
					birth_date: otherUser.birth_date,
					resident_country: otherUser.resident_country,
					created_at: otherUser.created_at,
				},

				articles: await ArticleRepository.findArticleByOwner(otherUser._id),
				friends: await UserRepository.seeAllFriends(otherUser.friends)
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
			return { statuscode: 422, message: { error: "you have problems with your registered email" } };

		let otherUser;

		if (! (otherUser = await UserRepository.existUsername(username) ))
			return { statuscode: 404, message: { error: "User not found" } };

		if (user.username === username)
			return { statuscode: 422, message: { error: "the name given is invalid" } };

		if (! await UserRepository.alreadyAndYourFriend(otherUser.friends, user._id))
			return { statuscode: 422, message: { error: "you are already friends with this user" } };

		if (! await UserRepository.alreadySentAFriendRequest(user._id.toString(), otherUser._id)) 
			return { statuscode: 422, message: { error: "you have already sent a friend request to this person" } };
			
		else {
			let friend_id;

			if ((friend_id = await UserRepository.sendFriendRequest(user._id, otherUser._id))) {
				
				await UserRepository.updateListOtherUserFriend(user._id, otherUser._id, friend_id);

				return { statuscode: 200, message: { success: "friend request sent successfully", friend_id: friend_id } };
			}

			return { statuscode: 400, message: { error: "failed to send friend request" } };
		}
	}

	async acceptFriendRequest(session_id, friend_id, userAgent ) {

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

		let requestReceived;

		if (! (requestReceived = await UserRepository.thisFriendIdExist(user._id, friend_id)))
			return { statuscode: 404, message: { error: "friend_id its invalid" } };

		const otherUser = await UserRepository.getOutherUser(requestReceived, friend_id);

		if (await UserRepository.acceptFriendRequest(user._id, otherUser._id, friend_id)) {
			
			await UserRepository.updateOtherUser(otherUser._id, user._id, friend_id);

			return { statuscode: 200, message: { success: "friend request accepted" } };
		}

		return { statuscode: 400, message: { error: "failed to accept friend request" } };
	}
}

export default new UserServices;