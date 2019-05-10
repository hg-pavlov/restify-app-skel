
const errors = require('restify-errors');

class DefaultController
{
	constructor (app, key)
	{
		this.app = app;
		this.key = key;
		this.routes = [
			{
				"path":"/", "type":"get", "handler": this.read,
				"name":"GET main info",
				"description":"Get main page info"
			},
		];
	}

	read (req, res, next)
	{
		res.send(200);
		return next();
	}
}

module.exports = DefaultController;
