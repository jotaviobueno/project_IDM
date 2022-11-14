import UserModel from "../../../Models/User/User.js";

import {hash} from "bcrypt";

class UpdateRepository {
    
	async updateUsername(_id, newUsername, oldUsername) {
		const update = await UserModel.updateOne({_id: _id, deleted_at: null}, 
			{username: newUsername, updated_at: new Date(), 
				$push: { update_logs: { 
					log: "updated username",
					old: oldUsername,
					new: newUsername,
					updated_at: new Date() 
				} } });

		if (update.matchedCount === 1)
			return true;

		return false;
	}

	async updateFullName(_id, newFullName, oldUsername) {
		const update = await UserModel.updateOne({_id: _id, deleted_at: null}, 
			{full_name: newFullName, updated_at: new Date(), 
				$push: { update_logs: { 
					log: "updated full name",
					old: oldUsername,
					new: newFullName,
					updated_at: new Date() 
				} } });

		if (update.matchedCount === 1)
			return true;

		return false;
	}

	async updatePasswordLoggedIn(_id, newPassword) {
		const update = await UserModel.updateOne({_id: _id, deleted_at: null}, 
			{ password: await hash(newPassword, 10), updated_at: new Date(),
				$push: { update_logs: { 
					log: "password has been change",
					updated_at: new Date() 
				}}});

		if (update.matchedCount === 1)
			return true;

		return false;
	}

	async validateGenre(newGenre) {
		const genres = ["MALE", "FEMALE"];
		let g = [];

		genres.forEach((genre) => {
			if (genre === newGenre)
				g.push(newGenre);
		});

		if (g.length > 0)
			return true;

		return false;
	}

	async updateGenre(_id, newGenre) {
		const update = await UserModel.updateOne({_id: _id, deleted_at: null}, 
			{ genre: newGenre, updated_at: new Date() });

		if (update.matchedCount === 1)
			return true;

		return false;
	}
}

export default new UpdateRepository;