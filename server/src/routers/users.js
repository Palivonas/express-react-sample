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
	const where = {};
	if (req.params.email) {
		where.email = req.params.email;
	}
	const users = (await User.findAll({ where }))
		.map((user) => _.omit(user.toJSON(), 'password'));
	res.json(users);
});

router.get('/me', protect, async (req, res) => {
	res.json(req.user);
});

router.get('/:id', async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		res.sendStatus(404);
		return;
	}
	res.json(_.omit(user.toJSON(), 'password'));
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
		res.json(_.omit(user.toJSON(), 'password'));
		return;
	} catch (err) {
		if (err.name !== 'SequelizeUniqueConstraintError') {
			res.status(500).json({ error: 'unknown_error' });
			return;
		}
		res.status(409).json({ errors: [ 'email' ] });
	}
});

router.delete('/:id', protect, async (req, res) => {
	if (parseInt(req.params.id, 10) !== req.user.id) {
		res.sendStatus(403);
		return;
	}
	const user = await User.findById(req.params.id);
	if (!user) {
		res.sendStatus(404);
		return;
	}

	// GDPR intesifies...
	const userPosts = await Post.findAll({ where: { authorId: user.get('id') } });
	const postIds = userPosts.map((post) => post.get('id'));
	await Post.destroy({ where: { id: postIds } });
	await user.destroy();

	res.sendStatus(204);
});

module.exports = router;
