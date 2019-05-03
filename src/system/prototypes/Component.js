
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

		this.controllers = this.loadControllers();
		this.repositories = this.loadRepositories();
		this.models = this.loadModels();

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

