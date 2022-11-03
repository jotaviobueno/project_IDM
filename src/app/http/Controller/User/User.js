import UserServices from "../../Services/User/User.js";

class UserController {

	async storage(req, res) {
		const user = {
			full_name: req.body.full_name,
			username: req.body.username,
			email: req.body.email,
			email_verified: req.body.email_verified,
			password: req.body.password,
			avatar_url: req.body.avatar_url,
			genre: req.body.genre,
			birth_date: req.body.birth_date,
			resident_country: req.body.resident_country,
		};

		const stored = await UserServices.Storage(user);

		return res.status(stored.statuscode).json(stored.message); 
	}
}

export default new UserController;