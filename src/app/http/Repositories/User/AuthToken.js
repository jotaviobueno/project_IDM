import {nanoid} from "nanoid";

import TokensModel from "../../../Models/User/Tokens.js";
import UserModel from "../../../Models/User/User.js";

class AuthTokenRepository {

	async generationToken(_id, email, generated_token_for) {
		try {
			return await TokensModel.create({
				user_id: _id,
				email: email,
				token: nanoid(),
				generated_token_for: generated_token_for,
				created_at: new Date(),
				updated_at: new Date(),
				expires_at: new Date().setHours(new Date().getHours() + 1),
				status: "generated",
				sent_to_email: false,
				deleted_at: null,
			});
		} catch(e) {
			return false;
		}
	}

	async seeUserTokenAmounts(userId, generated_token_for) {
		const amountToken = await TokensModel.find({user_id: userId, status: "generated", generated_token_for: generated_token_for, deleted_at: null});

		if (amountToken.length > 0)
			amountToken.forEach(async (token) => {
				await TokensModel.updateOne({_id: token._id, deleted_at: null, status: "generated", }, {
					status: "discarted", deleted_at: new Date(), updated_at: new Date()
				});
			});
	}

	async existToken(tokenId, generated_token_for) {
		try {
			const existToken = await TokensModel.findOne({status: "generated", generated_token_for: generated_token_for, deleted_at: null, 
				token: tokenId});

			if (!existToken)
				return false;

			return existToken;

		} catch (e) {
			console.log(e);
			return false;
		}
	}

	async updateToken(token, generated_token_for) {
		const update = await TokensModel.updateOne({token: token, status: "generated", generated_token_for: generated_token_for, deleted_at: null}, {
			status: "used", deleted_at: new Date(), updated_at: new Date()
		});
	
		if (update.matchedCount === 1)
			return true;

		return false;
	}

	async updateUser(userId) {
		await UserModel.updateOne({_id: userId, deleted_at: null}, {
			$pull: {permissions: "guest"}, updated_at: new Date()
		});

		await UserModel.updateOne({_id: userId, deleted_at: null}, {
			$push: {permissions: "user"}, email_verified: true, updated_at: new Date()
		});
	}
}

export default new AuthTokenRepository;