const app = require('./src/app');
const config = require('./src/config');

const listener = app.listen(config.port, () => {
	global.console.log(`App listening on port ${listener.address().port}`);
});
