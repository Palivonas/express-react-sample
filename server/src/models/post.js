const { posts } = require('./inMemory');

module.exports = {
	async find() {
		return posts.slice()
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	},
	async get(id) {
		return posts.find((post) => post.id === id);
	},
	async create(post) {
		const id = (posts.length && (parseInt(posts[posts.length - 1].id, 10) + 1).toString()) || '1';
		const newPost = {
			...post,
			createdAt: new Date().toISOString(),
			id,
		};
		posts.push(newPost);
		return newPost;
	},
	async delete(id) {
		const index = posts.findIndex((post) => post.id === id);
		if (index === -1) {
			return false;
		}
		posts.splice(index, 1);
		return true;
	},
};
