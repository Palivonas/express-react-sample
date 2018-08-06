const express = require('express');
const { protect } = require('../auth').middleware;
const Post = require('../models/post');

const router = express.Router();

router.get('/', async (req, res) => {
	const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });
	res.json(posts.map((post) => post.toJSON()));
});

router.get('/:id', async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (!post) {
		res.sendStatus(404);
		return;
	}
	res.json(post.toJSON());
});

router.post('/', protect, async (req, res) => {
	const { title, content } = req.body;
	if (typeof title !== 'string' || title.length === 0 || typeof content !== 'string') {
		res.sendStatus(422);
		return;
	}
	const authorId = req.user.id;
	const createdAt = new Date().toISOString();
	const post = await Post.create({ title, content, authorId, createdAt });
	res.status(201);
	res.json(post.toJSON());
});

router.delete('/:id', protect, async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (!post) {
		res.sendStatus(404);
		return;
	}
	if (post.get('authorId') !== req.user.id) {
		res.sendStatus(403);
		return;
	}
	await post.destroy();
	res.sendStatus(204);
});

module.exports = router;
