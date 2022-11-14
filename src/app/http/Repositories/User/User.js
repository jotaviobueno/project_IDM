// Models
import UserModel from "../../../Models/User/User.js";

import {hash} from "bcrypt";
import {nanoid} from "nanoid";

class UserRepository {

	async existEmail(email) {
		try {

			const user = await UserModel.findOne({email: email, deleted_at: null});

			if (! user)
				return false;

			return user;

		} catch (e) {
			return false;
		}
	}

	async existUsername(username) {
		try {

			const user = await UserModel.findOne({username: username, deleted_at: null});

			if (! user)
				return false;

			return user;

		} catch (e) {
			return false;
		}
	}

	async findUserById(_id) {
		try {

			const user = await UserModel.findOne({_id: _id, deleted_at: null});

			if (! user )
				return false;
			
			return user;

		} catch(e) {
			return false;
		}
	}

	async storageUser(user) {
		return await UserModel.create({
			full_name: user.full_name,
			username: user.username,
			email: user.email,
			email_verified: false,
			password: await hash(user.password, 10),
			avatar_url: user.avatar_url ?? null,
			genre: user.genre,
			birth_date: new Date(user.birth_date),
			resident_country: user.resident_country,
			request_received: [],
			friend_request_sent: [],
			reports: [],
			friends: [],
			article_owner: [],
			permissions: ["guest"],
			created_at: new Date(),
			updated_at: new Date(),
			update_logs: [{log: "created", updated_at: new Date() }],
			deleted_at: null,
		});
	}

	async createLog(_id, log, New, old, id) {
		const update = await UserModel.updateOne({_id: _id, deleted_at: null}, 
			{ $push: {
				update_logs: {
					log: log,
					new: New ?? null,
					id: id ?? nanoid(),
					old: old ?? null,
					updated_at: new Date()
				}
			},
			updated_at: new Date()
			});

		if (update.modifiedCount === 1)
			return true;

		return false;
	}

	async alreadySentAFriendRequest(userId, outherId) {
		if (! await UserModel.findOne({_id: outherId, deleted_at: null, 
			request_received: {$elemMatch: {user_id: userId} }}))
			return true;

		return false;
	}
	
	async sendFriendRequest(userId, outherUserId) {
		const friend_id = nanoid();

		const update = await UserModel.updateOne({_id: outherUserId, deleted_at: null},  {
			$push:{ request_received: {
				id: friend_id,
				user_id: userId.toString()
			}},
			updated_at: new Date()
		});

		if (update.modifiedCount === 1)
			return friend_id;

		return false;
	}

	async updateListOtherUserFriend(userId, outherUserId, friendId) {
		const update = await UserModel.updateOne({_id: userId, deleted_at: null},  {
			$push:{ friend_request_sent: {
				id: friendId,
				user_id: outherUserId.toString()
			}},
			updated_at: new Date()
		});

		if (update.modifiedCount === 1)
			return true;

		return false;
	}

	async thisFriendIdExist(userId, friendId) {
		const exist = await UserModel.findOne({_id: userId, deleted_at: null, request_received: { $elemMatch: {id: friendId} }});

		if (!exist)
			return false;

		return exist;
	}

	async getOutherUser(requestReceived, friend_id) {

		const requestReceivedList = requestReceived.request_received;
		let user;

		if (requestReceivedList.length > 0)
			for (let index = 0; index < requestReceivedList.length; index++) {
				const friends = requestReceivedList[index];

				if (friends)
					if (friends.id === friend_id) {
						user = await UserModel.findOne({_id: friends.user_id, deleted_at: null});
					}
			}
		
		return user;
	}

	async acceptFriendRequest(userId, outherUserId, friendId) {
		
		const update = await UserModel.updateOne({_id: userId, deleted_at: null}, {
			$push: { friends: outherUserId }, $pull: {request_received: { id: friendId }},
			updated_at: new Date()
		});

		if (update.modifiedCount === 1)
			return true;

		return false;
	}

	async updateOtherUser(outherUserId, userId, friendId ) {
		const update = await UserModel.updateOne({_id: outherUserId, deleted_at: null}, {
			$push: { friends: userId }, $pull: { friend_request_sent: { id: friendId }},
			updated_at: new Date()
		});

		if (update.modifiedCount === 1)
			return true;

		return false;
	}

	async seeAllFriends(friendList) {
		let Friends = [];

		for (let index = 0; index < friendList.length; index++) {
			const friends = friendList[index];

			if (friends) {
				const user = await UserModel.findOne({_id: friends, deleted_at: null});

				if (user) {
					Friends.push({username: user.username, avatar_url: user.avatar_url});
				}
			}
		}
		return Friends;
	}

	async alreadyAndYourFriend(friends, userId) {

		for (let index = 0; index < friends.length; index++) {
			const friend = friends[index].toString();
			
			if (friend)
				if (friend === userId.toString())
					return false;
		}

		return true;
	}
}

export default new UserRepository;