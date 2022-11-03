import UserModel from "../../../Models/User/User.js";

class UpdateRepository {
    
	async updateUsername(_id, newUsername) {
		const update = await UserModel.updateOne({_id: _id, deleted_at: null}, 
			{username: newUsername.replace(" ", ""), updated_at: new Date(), 
				$push: { update_logs: { log: "updated username", updated_at: new Date() } } });

		if (update.matchedCount === 1)
			return true;

		return false;
	}

}

export default new UpdateRepository;