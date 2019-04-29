
const path = require('path'), fs = require("fs"), restify = require('restify'), errors = require('restify-errors');
const Context = require('./components/context');

class App
{
	constructor (config, routes)
	{
		this.config = config;
		this.loadModels();
		this.loadStorages();
		this.loadControllers();

		this.server = restify.createServer(config.server);
		this.server.use(restify.plugins.acceptParser(this.server.acceptable));
		this.server.use(restify.plugins.authorizationParser());
		this.server.use(restify.plugins.dateParser());
		this.server.use(restify.plugins.queryParser());
		this.server.use(restify.plugins.urlEncodedBodyParser());

		this.setServerRouting(this.server, routes);
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

	getModel (name)
	{
		return typeof this.models[name] !== 'undefined' ? this.models[name] : null;
	}
	getStorage (name)
	{
		return typeof this.storages[name] !== 'undefined' ? this.storages[name] : null;
	}
	getController (name)
	{
		return typeof this.controllers[name] !== 'undefined' ? this.controllers[name] : null;
	}

	loadModels ()
	{
		let modelsPath = path.join(__dirname, 'models');
		this.models = {};
		fs.readdirSync(modelsPath).forEach((file) => {
			let model = require(path.join(modelsPath, file)),
			key = file.replace(/(Model|\.js$)/ig,'');
			this.models[key] = new model(this);
		});
	}
	loadStorages ()
	{
		let storagesPath = path.join(__dirname, 'storages');
		this.storages = {};
		fs.readdirSync(storagesPath).forEach((file) => {
			let storage = require(path.join(storagesPath, file)),
			key = file.replace(/(Storage|\.js$)/ig,'');
			this.storages[key] = new storage(this, this.getModel(key));
		});
	}
	/**
	 * depends on storages
	 *
	 */
	loadControllers ()
	{
		let controllersPath = path.join(__dirname, 'controllers');
		this.controllers = {};
		fs.readdirSync(controllersPath).forEach((file) => {
			let controller = require(path.join(controllersPath, file)),
			key = file.replace(/(Controller|\.js$)/ig,'');
			this.controllers[key] = new controller(this, this.getStorage(key));
		});
	}

	setServerRouting (server, routes)
	{
		let self = this;
		routes.forEach((routeObj) => {

			for (let key in routeObj.handlers) {

				if (routeObj.handlers.hasOwnProperty(key)) {
					let func = key.substr(0,key.indexOf(':')),
					controller = key.substr(key.indexOf(':')+1,(key.indexOf('#')-1-key.indexOf(':'))),
					method = key.substr(key.indexOf('#')+1,key.length);
					 
					if (!func || !controller || !method) throw new Error('No controller or method defined');

					let options = routeObj.handlers[key];

					server[func]({path: routeObj.path, name: routeObj.name}, function(req,res,next) {
						// create context
						self.context = new Context(options);
						if (self.context.access.allowed) {
							self.controllers[controller][method](req,res,next);
						} else {
							next(new errors.ForbiddenError());
						}
					});
				}
			};
		});
	}
}

module.exports = App;
