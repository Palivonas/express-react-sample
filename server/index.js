const app = require('./src/app');
const config = require('./src/config');

(async () => {
	await app.init();
	const listener = app.expressApp.listen(config.port, () => {
		global.console.log(`App listening on port ${listener.address().port}`);
	});
})();
