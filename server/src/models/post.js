const _ = require('lodash');
const { posts } = require('./inMemory');

module.exports = {
	async find({ authorId } = {}) {
		let result = _.sortBy(posts, (post) => -new Date(post.createdAt).getTime());
		if (authorId) {
			result = result.filter((p) => p.authorId === authorId);
		}
		return result;
	},
	async get(id) {
		return _.find(posts, { id });
	},
	async create(post) {
		const id = (posts.length && (parseInt(_.findLast(posts).id, 10) + 1).toString()) || '1';
		const newPost = {
			...post,
			createdAt: new Date().toISOString(),
			id,
		};
		posts.push(newPost);
		return newPost;
	},
	async delete(id) {
		const [ deleted ] = _.remove(posts, { id });
		return !!deleted;
	},
};
