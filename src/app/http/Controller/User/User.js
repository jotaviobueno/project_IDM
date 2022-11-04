import UserServices from "../../Services/User/User.js";

class UserController {

	async storage(req, res) {
		let user = {
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

		user.username = user.username.replace(" ", "");

		const stored = await UserServices.storage(user);

		return res.status(stored.statuscode).json(stored.message); 
	}

	async profile(req, res) {
		const userAgent = req.headers["user-agent"];
		const {session_id} = req.headers;
	
		const profile = await UserServices.profile(session_id, userAgent);

		return res.status(profile.statuscode).json(profile.message); 
	}

	async outherProfile(req, res) {
		const userAgent = req.headers["user-agent"];
		let {username} = req.params;
		const {session_id} = req.headers;

		username = username.replace(" ", "");

		const profile = await UserServices.outherProfiles(session_id, username, userAgent);

		return res.status(profile.statuscode).json(profile.message); 
	}
}

export default new UserController;