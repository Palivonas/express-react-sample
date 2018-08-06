const jwt = require('jsonwebtoken');
const { secret } = require('./config').auth;
const User = require('./models/user');

const sign = (payload) => jwt.sign(payload, secret);
const decode = (token) => jwt.verify(token, secret);

const middleware = {
	async parseUser(req, res, next) {
		const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
		if (!token) {
			next();
			return;
		}
		try {
			const payload = decode(token);
			const user = await User.findById(payload.userId);
			if (!user) {
				throw new Error('User not found');
			}
			req.user = user.toJSON();
			next();
		} catch (err) {
			res.status(401).json({ error: 'token_invalid' });
		}
	},
	protect(req, res, next) {
		if (!req.user) {
			res.status(401).json({ error: 'not_logged_in' });
			return;
		}
		next();
	},
};

module.exports = {
	sign,
	decode,
	middleware,
};
