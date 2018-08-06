const User = require('../models/user');
const Post = require('../models/post');
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const { protect } = require('../auth').middleware;

const hash = (password) => {
	return bcrypt.hashSync(password, 10);
};

const router = express.Router();

router.get('/', async (req, res) => {
	const query = {};
	if (req.params.email) {
		query.email = req.params.email;
	}
	const users = (await User.find(query))
		.map((user) => _.omit(user, 'password'));
	res.json(users);
});

router.get('/:id', async (req, res) => {
	const user = await User.get(req.params.id);
	if (!user) {
		res.sendStatus(404);
		return;
	}
	res.json(_.omit(user, 'password'));
});

router.post('/', async (req, res) => {
	const rules = {
		name: /^.{1,20}$/i,
		email: /^[a-z0-9-.]+@[a-z0-9-.]+\.[a-z]+$/i,
		password: /.{1,100}/i,
	};
	const errors = _.chain(rules)
		.mapValues((regex, key) => {
			return typeof req.body[key] === 'string' && regex.test(req.body[key]);
		})
		.pickBy((value) => !value)
		.keys()
		.value();
	if (errors.length !== 0) {
		res.status(422).json({ errors });
		return;
	}
	const { email, name } = req.body;
	const password = hash(req.body.password);
	try {
		const user = await User.create({ email, name, password });
		res.status(201);
		res.json(_.omit(user, 'password'));
	} catch (err) {
		if (err.code !== 'duplicate_data') {
			res.sendStatus(500);
			return;
		}
		res.sendStatus(409);
	}
});

router.delete('/:id', protect, async (req, res) => {
	if (req.params.id !== req.user.id) {
		res.sendStatus(403);
		return;
	}
	const deleted = await User.delete(req.params.id);
	if (!deleted) {
		res.sendStatus(404);
		return;
	}

	// GDPR intesifies...
	const userPosts = await Post.find({ authorId: req.user.id });
	for (const post of userPosts) {
		// not using Promise.all() because the mock in-memory mock database doesn't handle concurrency
		await Post.delete(post.id);
	}
	res.sendStatus(204);
});

module.exports = router;
