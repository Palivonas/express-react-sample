const express = require('express');
const { protect } = require('../auth').middleware;
const Post = require('../models/post');

const router = express.Router();

router.get('/', async (req, res) => {
	res.json(await Post.find());
});

router.get('/:id', async (req, res) => {
	const post = await Post.get(req.params.id);
	if (!post) {
		res.sendStatus(404);
		return;
	}
	res.json(post);
});

router.post('/', protect, async (req, res) => {
	const { title, content } = req.body;
	const authorId = req.user.id;
	const post = await Post.create({ title, content, authorId });
	res.status(201);
	res.json(post);
});

router.delete('/:id', protect, async (req, res) => {
	const deleted = await Post.delete(req.params.id);
	if (!deleted) {
		res.sendStatus(404);
		return;
	}
	res.sendStatus(204);
});

module.exports = router;
