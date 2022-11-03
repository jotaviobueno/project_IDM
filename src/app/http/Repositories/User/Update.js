import UserModel from "../../../Models/User/User.js";

class UpdateRepository {
    
	async updateUsername(_id, newUsername, oldUsername) {
		const update = await UserModel.updateOne({_id: _id, deleted_at: null}, 
			{username: newUsername.replace(" ", ""), updated_at: new Date(), 
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

}

export default new UpdateRepository;