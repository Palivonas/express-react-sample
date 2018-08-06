const Sequelize = require('sequelize');
const db = require('./db');
const User = require('./user');

const Post = db.define('post', {
	title: { type: Sequelize.STRING },
	content: { type: Sequelize.TEXT },
	createdAt: { type: Sequelize.DATE },
});

Post.belongsTo(User, { as: 'author' });
module.exports = Post;
