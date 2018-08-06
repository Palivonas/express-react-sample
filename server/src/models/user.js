const Sequelize = require('sequelize');
const db = require('./db');

const User = db.define('user', {
	email: { type: Sequelize.STRING, unique: true },
	name: { type: Sequelize.TEXT },
	password: { type: Sequelize.STRING },
});

module.exports = User;
