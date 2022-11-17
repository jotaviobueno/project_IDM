import yup from "yup";

class AuthLogin {

	async validateCreateSession ( req, res, next ) {
		const bodyValidator = yup.object().shape({
			email: yup.string().email().required(),
			password: yup.string().required(),
		});

		try {
			await bodyValidator.validate(req.body);

		} catch (err) {
			return res.status(422).json({errors: err.errors});
		}

		await next();
	}
}

export default new AuthLogin;