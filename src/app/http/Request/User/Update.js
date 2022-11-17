import yup from "yup";

class UpdateRequest {

	async validateUpdateUsername ( req, res, next ) {

		const headersValidator = yup.object().shape({
			session_id: yup.string().required()
		});

		const bodyValidator = yup.object().shape({
			new_username: yup.string().required(),
		});

		try {
			await headersValidator.validate(req.headers);
			await bodyValidator.validate(req.body);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}

	async validateUpdateFullname( req, res, next ) {

		const headersValidator = yup.object().shape({
			session_id: yup.string().required()
		});

		const bodyValidator = yup.object().shape({
			new_full_name: yup.string().required(),
		});

		try {
			await headersValidator.validate(req.headers);
			await bodyValidator.validate(req.body);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}

	async validateUpdatePasswordLoggedIn ( req, res, next ) {

		const headersValidator = yup.object().shape({
			session_id: yup.string().required()
		});

		const bodyValidator = yup.object().shape({
			password: yup.string().required(),
			new_password: yup.string().required(),
		});

		try {
			await headersValidator.validate(req.headers);
			await bodyValidator.validate(req.body);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}

	async validateUpdateGenre ( req, res, next ) {

		const headersValidator = yup.object().shape({
			session_id: yup.string().required()
		});

		const bodyValidator = yup.object().shape({
			new_genre: yup.string().required(),
		});

		try {
			await headersValidator.validate(req.headers);
			await bodyValidator.validate(req.body);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}

	async validatePasswordWithToken( req, res, next ) {

		const headersValidator = yup.object().shape({
			token: yup.string().required()
		});

		const bodyValidator = yup.object().shape({
			new_password: yup.string().required(),
		});

		try {
			await headersValidator.validate(req.headers);
			await bodyValidator.validate(req.body);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}

	async validateUpdateEmail( req, res, next ) {

		const headersValidator = yup.object().shape({
			token: yup.string().required()
		});

		const bodyValidator = yup.object().shape({
			new_email: yup.string().required(),
		});

		try {
			await headersValidator.validate(req.headers);
			await bodyValidator.validate(req.body);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}

	async validateDeleteAccount( req, res, next ) {

		const headersValidator = yup.object().shape({
			token: yup.string().required()
		});

		try {
			await headersValidator.validate(req.headers);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}
}

export default new UpdateRequest;