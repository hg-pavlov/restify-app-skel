
const fs = require("fs"),
	path = require('path'),
	restify = require('restify'),
	errors = require('restify-errors'),
	EventEmitter = require('events');


class Application
{
	constructor (config)
	{
		this.config = config;
		this.server = restify.createServer(config.server);
		this.broadcast = new EventEmitter();
		this.srcDir = path.join(process.cwd(), 'src');

		this.init();
		this.components = this.loadComponents(this, this.server);
	}

	init ()
	{
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

	loadSequence ()
	{
		return [];
	}

	loadComponents (app, server)
	{
		let components = {}, componentsPath = path.join(app.srcDir, 'components');
		this.loadSequence()
		.forEach((componentDir) => {
			let componentPath = path.join(componentsPath, componentDir);
			let componentClass = require(path.join(componentPath, 'index.js'));
			components[componentDir] = new componentClass(app, server, componentPath);
		});
		return components;
	}

	setServerRouting (server, component, controller)
	{
		controller.routes.forEach((routeObj) => {

			server[routeObj.type]({ path: routeObj.path, name: routeObj.name||'' }, async (req, res, next) => {
				try {
					this.broadcast.emit('appBeforeController', routeObj, req, res, next);
					routeObj.handler(req, res, next);
				} catch (err) {
					next(err);
				}
			});
		});
	}

	getComponent (componentName)
	{
		return (typeof this.components[componentName] !== 'undefined') ? this.components[componentName] : null;
	}

	getComponentRepository (repoName)
	{
		let repoPath = null;

		if (typeof repoName !== 'string')
			throw new errors.InternalError('Repository must be identified by <component>#<repository> signature');

		repoPath = repoName.split('#');

		if (repoPath.length !== 2)
			throw new errors.InternalError('Repository identificator must consists of two parts');

		if (typeof this.components[repoPath[0]] === 'undefined' || typeof this.components[repoPath[0]].repositories[repoPath[1]] === 'undefined') {
			throw new errors.InternalError('Repository is not exists "'+repoName+'"');
		}

		return this.components[repoPath[0]].repositories[repoPath[1]];
	}
}

module.exports = Application;

