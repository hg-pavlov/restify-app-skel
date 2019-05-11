
const fs = require("fs"),
	path = require('path'),
	errors = require('restify-errors');

class Component
{
	constructor (app, server, componentDir)
	{
		this.app = app;
		this.server = server;
		this.componentDir = componentDir;
		this.name = path.basename(componentDir);

		this.controllers = this.loadControllers();
		this.repositories = this.loadRepositories();
		this.models = this.loadModels();

		this.app.restifySwaggerJsdoc.createSwaggerPage({
			title: 'Component '+ this.name.toLowerCase() +' API documentation', // Page title (required)
			version: '1.0.0', // Server version (required)
			server: this.server, // Restify server instance created with restify.createServer() (required)
			path: '/docs/'+ this.name, // Public url where the swagger page will be available (required)
			description: 'API component '+ this.name, // A short description of the application. (default: '')
			tags: [{ // A list of tags used by the specification with additional metadata (default: [])
				name: 'Component '+ this.name,
				description: 'API of component '+ this.name,
			}],
			// The host (name or ip) serving the API. This MUST be the host only and does not include the scheme nor sub-paths.
			host: this.app.config.docHost+':'+this.app.config.docPort,
			schemes: ['http'], // The transfer protocol of the API. Values MUST be from the list: "http", "https", "ws", "wss". (default: [])
			apis: [ componentDir + '/**/*.js' ], // Path to the API docs (default: [])
//			definitions: {myObject: require('api/myObject.json')}, // External definitions to add to swagger (default: [])
//			routePrefix: 'prefix', // prefix to add for all routes (default: '')
			forceSecure: false // force swagger-ui to use https protocol to load JSON file (default: false)
		});

		console.log('=========== component: '+componentDir+' =============');
		console.log('controllers: ',Object.keys(this.controllers));
		console.log('repositories: ',Object.keys(this.repositories));
		console.log('models: ',Object.keys(this.models));
	}

	onEvent (eventName, eventHandler)
	{
		this.app.broadcast.on(eventName, eventHandler);
	}

	loadElement (app, elementDir, elementInit)
	{
		let elementSuffix = '';
		switch (elementDir) {
		case 'controllers': elementSuffix = 'Controller'; break;
		case 'repositories': elementSuffix = 'Repository'; break;
		case 'models': elementSuffix = 'Model'; break;
		}

		let elementObjList = {}, elementPath = path.join(this.componentDir, elementDir);
		if (fs.existsSync(elementPath)) {
			fs.readdirSync(elementPath)
			.forEach((file) => {
				let elementFilePath = path.join(elementPath, file);
				let fstat = fs.statSync(elementFilePath);
				if (!fstat.isFile() || file.indexOf('.') === 0 || file.indexOf(elementSuffix) === -1) return;
				let elementObj = require(elementFilePath),
				keyRe = new RegExp('('+elementSuffix+'|\.js$)', 'ig'), key = file.replace(keyRe,'');
				elementObjList[key] = new elementObj(app, key);
				if (elementInit) elementInit(elementObjList[key]);
			});
		}
		return elementObjList;
	}

	loadControllers ()
	{
		return this.loadElement(this.app, 'controllers', (controller) => {
			this.app.setServerRouting(this.server, this, controller);
		});
	}
	loadRepositories ()
	{
		return this.loadElement(this.app, 'repositories');
	}
	loadModels ()
	{
		return this.loadElement(this.app, 'models');
	}
}

module.exports = Component;

