const { users } = require('./inMemory');

module.exports = {
	async find({ email }) {
		let result = users;
		if (email) {
			result = result.filter((user) => user.email === email);
		}
		return result;
	},
	async get(id) {
		return users.find((user) => user.id === id);
	},
	async create(user) {
		const exists = users.some((u) => u.email === user.email);
		if (exists) {
			const error = new Error('Duplicate email');
			error.code = 'duplicate_data';
			throw error;
		}
		const id = (users.length && (parseInt(users[users.length - 1].id, 10) + 1).toString()) || '1';
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
