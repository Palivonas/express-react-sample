const express = require('express');
const { compareSync : verifyPassword } = require('bcrypt');
const User = require('../models/user');
const { sign } = require('../auth');

const router = express.Router();

router.post('/', async (req, res) => {
	const user = (await User.find({ email: req.body.email }))[0];
	const valid = !!user && verifyPassword(req.body.password, user.password);
	if (!valid) {
		res.sendStatus(401);
		return;
	}
	const token = sign({ userId: user.id });
	res.json({ token });
});

module.exports = router;
