
const path = require('path'), fs = require("fs"), restify = require('restify'), errors = require('restify-errors');

class App
{
	constructor (config, routes)
	{
		this.config = config;

		this.server = restify.createServer(config.server);
		this.server.use(restify.plugins.acceptParser(this.server.acceptable));
		this.server.use(restify.plugins.authorizationParser());
		this.server.use(restify.plugins.dateParser());
		this.server.use(restify.plugins.queryParser());
		this.server.use(restify.plugins.urlEncodedBodyParser());

		this.loadControllers();
	}

	start ()
	{
		this.server.listen(
			process.env.NODE_PORT||this.config.server.port,
			process.env.NODE_HOST||this.config.server.host,
			() => {
				console.log('listening: %s', this.server.url);
			}
		);
	}

	getController (name)
	{
		return typeof this.controllers[name] !== 'undefined' ? this.controllers[name] : null;
	}

	loadControllers ()
	{
		let controllersPath = path.join(__dirname, 'controllers');
		this.controllers = {};
		fs.readdirSync(controllersPath).forEach((file) => {
			if (file.indexOf('.') === 0 || file.indexOf('Controller') === -1) return;
			let controller = require(path.join(controllersPath, file)),
			key = file.replace(/(Controller|\.js$)/ig,'');
			this.controllers[key] = new controller(this, this.server);
		});
	}
}

module.exports = App;
