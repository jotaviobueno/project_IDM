// Models
import UserModel from "../../../Models/User/User.js";

import {hash} from "bcrypt";

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
					id: id ?? null,
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
		if (! await UserModel.findOne({_id: outherId, deleted_at: null, request_received: {$eq: userId }}))
			return true;

		return false;
	}
	
	async sendFriendRequest(userId, outherUserId) {
		const update = await UserModel.updateOne({_id: outherUserId, deleted_at: null},  {
			$push:{ request_received: userId.toString() }
		});

		if (update.modifiedCount === 1)
			return true;

		return false;
	}

}

export default new UserRepository;