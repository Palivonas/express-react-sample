const Sequelize = require('sequelize');
const config = require('../config');

module.exports = new Sequelize({
	dialect: 'sqlite',
	storage: config.storagePath,
	define: {
		timestamps: false,
	},
	operatorsAliases: false,
	logging: false,
});
