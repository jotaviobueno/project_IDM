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

}

export default new UserRepository;