
const fs = require("fs"),
	path = require('path'),
	restify = require('restify'),
	errors = require('restify-errors'),
	context = require('./components/context');

class App
{
	constructor (config)
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
			this.controllers[key] = new controller(this, key);
			this.setServerRouting(this.server, this.controllers[key].routes);
		});
	}

	setServerRouting (server, routes)
	{
		routes.forEach((routeObj) => {

			server[routeObj.type]({ path: routeObj.path, name: routeObj.name||'' }, async (req, res, next) => {
				// create context
				let ctx = new context(routeObj.options);
				if (ctx.accessIsAllowed()) {
					routeObj.handler(ctx, req, res, next);
				} else {
					next(new errors.ForbiddenError());
				}
			});
		});
	}
}

module.exports = App;
