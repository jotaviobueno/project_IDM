import yup from "yup";

class AuthToken {

	async validateGenerationTokenToVerifyAccount ( req, res, next ) {

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

	async validateVerifyAccount ( req, res, next ) {

		const headersValidator = yup.object().shape({
			session_id: yup.string().required(),
			auth_token: yup.string().required()

		});

		try {
			await headersValidator.validate(req.headers);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}

	async validateGenerationTokenTochangePassword ( req, res, next ) {

		const bodyValidator = yup.object().shape({
			email: yup.string().email().required(),
		});

		try {
			await bodyValidator.validate(req.body);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}

	async validateGenerationTokenToChangeEmail ( req, res, next ) {

		const bodyValidator = yup.object().shape({
			password: yup.string().email().required(),
		});

		const headersValidator = yup.object().shape({
			session_id: yup.string().required()
		});

		try {
			await headersValidator.validate(req.headers);
			await bodyValidator.validate(req.body);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}

	async validateGenerationTokenToDeleteAccount ( req, res, next ) {

		const bodyValidator = yup.object().shape({
			password: yup.string().email().required(),
		});

		const headersValidator = yup.object().shape({
			session_id: yup.string().required()
		});

		try {
			await headersValidator.validate(req.headers);
			await bodyValidator.validate(req.body);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}
}

export default new AuthToken;