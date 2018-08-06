const models = [
	require('./post'),
	require('./user'),
];

module.exports = {
	sync() {
		return Promise.all(models.map((model) => model.sync()));
	},
};
