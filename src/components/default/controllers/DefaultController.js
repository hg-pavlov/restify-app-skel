
const errors = require('restify-errors');

class DefaultController
{
	constructor (app, key)
	{
		this.app = app;
		this.key = key;
		this.routes = [
			{
				"path":"/hello/:name", "type":"get", "handler": this.read,
				"options": {
					"auth": { "strategy":"Basic", "storage":"Hello" },
					"access": { "allow":false, "deny":null }
				},
				"name":"Get Hello",
				"description":"Get Hello Greeting"
			},
			{
				"path":"/hello/:name", "type":"post", "handler": this.create,
				"options": {
					"auth": { "strategy":"Basic", "storage":"Hello" },
					"access": { "allow":true, "deny":null }
				},
				"name":"Create Hello",
				"description":"Create Hello Greeting"
			},
			{
				"path":"/hello/:name", "type":"put", "handler": this.update,
				"options": {
					"auth": { "strategy":"Basic", "storage":"Hello" },
					"access": { "allow":true, "deny":null }
				},
				"name":"Update Hello",
				"description":"Update Hello Greeting"
			},
			{
				"path":"/hello/:name", "type":"del", "handler": this.remove,
				"options": {
					"auth": { "strategy":"Basic", "storage":"Hello" },
					"access": { "allow":true, "deny":null }
				},
				"name":"Delete Hello",
				"description":"Delete Hello Greeting"
			},
		];
	}

	read (req, res, next)
	{
		console.log('----',req.username,req.authorization);
		res.send({
			hello: req.params.name
		});
		return next();
	}

	create (req, res, next)
	{
		return next();
	}

	update (req, res, next)
	{
		return next();
	}

	remove (req, res, next)
	{
		return next();
	}
}

module.exports = DefaultController;
