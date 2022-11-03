import UserRepository from "../../Repositories/User/User.js";

class UserServices {

	async Storage(user) {
        
		if (await UserRepository.existEmail(user.email))
			return { statuscode: 422, message: { error: "invalid credentials" } };

		if (await UserRepository.existUsername(user.username.replace(" ", "")))
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

}

export default new UserServices;