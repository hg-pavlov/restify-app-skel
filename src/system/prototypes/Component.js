
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
	}

	onEvent (eventName, eventHandler)
	{
		this.app.broadcast.on(eventName, eventHandler);
	}

	loadElement (app, elementDir, elementInit)
	{
		let elDir1stChar = elementDir.charAt(0),
		suffRe = new RegExp('^'+elDir1stChar), suffCh = elDir1stChar.toUpperCase(),
		elementSuffix = elementDir.replace(suffRe, suffCh).replace(/s$/i, '');

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
}

module.exports = Component;

