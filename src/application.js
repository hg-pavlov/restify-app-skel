
const fs = require("fs"),
	path = require('path'),
	restify = require('restify'),
	errors = require('restify-errors');

let auth = require('./system/authenticate');
let access = require('./system/access');

class App
{
	constructor (config)
	{
		this.config = config;

		this.server = restify.createServer(config.server);

		this.server.pre(restify.plugins.pre.context());
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

	loadElements (elementDir, elementSuffix, elementInit)
	{
		let componentsPath = path.join(__dirname, 'components');
		fs.readdirSync(componentsPath)
		.forEach((componentDir) => {
			let componentPath = path.join(componentsPath, componentDir);
			let elementPath = path.join(componentsPath, componentDir, elementDir);
			let fstat = fs.statSync(componentPath);
			if (!fstat.isDirectory() || componentDir.indexOf('.') === 0) return;
			this[elementDir] = {};
			fs.readdirSync(elementPath)
			.forEach((file) => {
				let elementFilePath = path.join(elementPath, file);
				let fstat = fs.statSync(elementFilePath);
				if (!fstat.isFile() || file.indexOf('.') === 0 || file.indexOf(elementSuffix) === -1) return;
				let elementObj = require(elementFilePath),
				keyRe = new RegExp('('+elementSuffix+'|\.js$)', 'ig'),
				key = file.replace(keyRe,'');
				this[elementDir][key] = new elementObj(this, key);
				elementInit(this[elementDir][key]);
			});
		});
	}

	loadControllers ()
	{
		this.loadElements('controllers', 'Controller', async (element) => {
			this.setServerRouting(this.server, element.routes);
		});
	}
	setServerRouting (server, routes)
	{
		routes.forEach((routeObj) => {

			server[routeObj.type]({ path: routeObj.path, name: routeObj.name||'' }, async (req, res, next) => {
				auth.authenticate(routeObj.options.auth||{}, req);
				access.process(routeObj.options.access||{}, auth.getUser(req), req);
				if (access.isAllowed(req)) {
					routeObj.handler(req, res, next);
				} else {
					next(new errors.ForbiddenError());
				}
			});
		});
	}
}

module.exports = App;
