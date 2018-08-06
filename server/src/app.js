const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const nocache = require('nocache');
const path = require('path');

const models = require('./models');
const { parseUser } = require('./auth').middleware;

const postsRouter = require('./routers/posts');
const authRouter = require('./routers/auth');
const usersRouter = require('./routers/users');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(compression());

const api = express.Router();
api.use(nocache());
app.use('/api', api);

api.use(parseUser);
api.use('/posts', postsRouter);
api.use('/auth', authRouter);
api.use('/users', usersRouter);

app.use('/', express.static(path.join(__dirname, '../../client/build')));
app.use('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

module.exports = {
	async init({ storage } = {}) {
		if (storage) {
			const db = require('./models/db');
			db.options.storage = storage;
		}
		await models.sync();
	},
	expressApp: app,
};
