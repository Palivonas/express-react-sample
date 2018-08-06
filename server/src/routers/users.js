const User = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');

const removeProps = (object, ...keys) => {
	const clone = { ...object };
	keys.forEach((key) => delete clone[key]);
	return clone;
};

const hash = (password) => {
	return bcrypt.hashSync(password, 10);
};

const router = express.Router();

router.get('/', async (req, res) => {
	const users = (await User.find({ email: req.query.email }))
		.map((user) => removeProps(user, 'password'));
	res.json(users);
});

router.get('/:id', async (req, res) => {
	const user = await User.get(req.params.id);
	if (!user) {
		res.sendStatus(404);
		return;
	}
	res.json(removeProps(user, 'password'));
});

router.post('/', async (req, res) => {
	const { email, name } = req.body;
	const password = hash(req.body.password);
	try {
		const user = await User.create({ email, name, password });
		res.status(201);
		res.json(removeProps(user, 'password'));
	} catch (err) {
		if (err.code !== 'duplicate_data') {
			res.sendStatus(500);
			return;
		}
		res.sendStatus(409);
	}
});

router.delete('/:id', async (req, res) => {
	const deleted = await User.delete(req.params.id);
	if (!deleted) {
		res.sendStatus(404);
		return;
	}
	res.sendStatus(204);
});

module.exports = router;
