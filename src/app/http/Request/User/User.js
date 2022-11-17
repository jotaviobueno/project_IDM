import yup from "yup";

class UserRequest {

	async validateStorage ( req, res, next ) {

		const bodyValidator = yup.object().shape({
			full_name: yup.string().required(),
			username: yup.string().min(3).max(16).required(),
			email: yup.string().email().required(),
			password: yup.string().min(3).max(16).required(),
			avatar_url: yup.string(),
			genre: yup.string().required(),
			birth_date: yup.date().required(),
			resident_country: yup.string().required(),
		});

		try {
			await bodyValidator.validate(req.body);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}

	async validateProfile( req, res, next ) {

		const headersValidator = yup.object().shape({
			session_id: yup.string().required()
		});

		try {
			await headersValidator.validate(req.headers);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}

	async validateOutherProfile ( req, res, next ) {

		const headersValidator = yup.object().shape({
			session_id: yup.string().required()
		});

		const paramsValidator = yup.object().shape({
			username: yup.string().required(),
		});

		try {
			await headersValidator.validate(req.headers);
			await paramsValidator.validate(req.params);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}

	async validateSendFriendRequest ( req, res, next ) {

		const headersValidator = yup.object().shape({
			session_id: yup.string().required()
		});

		const bodyValidator = yup.object().shape({
			username: yup.string().required(),
		});

		try {
			await headersValidator.validate(req.headers);
			await bodyValidator.validate(req.body);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}

	async validateAcceptFriendRequest ( req, res, next ) {

		const headersValidator = yup.object().shape({
			session_id: yup.string().required(),
			friend_id: yup.string().required()
		});

		try {
			await headersValidator.validate(req.headers);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}
}

export default new UserRequest;