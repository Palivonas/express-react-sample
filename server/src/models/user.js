const { users } = require('./inMemory');
const _ = require('lodash');

module.exports = {
	async find({ email } = {}) {
		let results = users;
		if (email) {
			results = _.filter(results, { email });
		}
		return results;
	},
	async get(id) {
		return _.find(users, { id });
	},
	async create(user) {
		const exists = users.some((u) => u.email === user.email);
		if (exists) {
			const error = new Error('Duplicate email');
			error.code = 'duplicate_data';
			throw error;
		}
		const id = (users.length && (parseInt(_.findLast(users).id, 10) + 1).toString()) || '1';
		const newUser = {
			...user,
			id,
		};
		users.push(newUser);
		return newUser;
	},
	async delete(id) {
		const index = users.findIndex((post) => post.id === id);
		if (index === -1) {
			return false;
		}
		users.splice(index, 1);
		return true;
	},
};
