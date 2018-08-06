const express = require('express');
const { compareSync : verifyPassword } = require('bcrypt');
const User = require('../models/user');
const { sign } = require('../auth');

const router = express.Router();

router.post('/', async (req, res) => {
	let user = await User.findOne({ where: { email: req.body.email } });
	const valid = !!user && verifyPassword(req.body.password, user.password);
	if (!valid) {
		res.sendStatus(401);
		return;
	}
	const token = sign({ userId: user.id });
	res.json({ token });
});

module.exports = router;
