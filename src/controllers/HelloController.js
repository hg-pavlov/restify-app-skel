
const errors = require('restify-errors');

class HelloController
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
					"access": { "allow":true, "deny":null }
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
				"name":"Get Hello",
				"description":"Get Hello Greeting"
			},
			{
				"path":"/hello/:name", "type":"put", "handler": this.update,
				"options": {
					"auth": { "strategy":"Basic", "storage":"Hello" },
					"access": { "allow":true, "deny":null }
				},
				"name":"Get Hello",
				"description":"Get Hello Greeting"
			},
			{
				"path":"/hello/:name", "type":"del", "handler": this.remove,
				"options": {
					"auth": { "strategy":"Basic", "storage":"Hello" },
					"access": { "allow":true, "deny":null }
				},
				"name":"Get Hello",
				"description":"Get Hello Greeting"
			},
		];
	}

	read (ctx, req, res, next)
	{
		console.log(this.app.context,req.username,req.authorization);
		res.send({
			hello: req.params.name
		});
		return next();
	}

	create (ctx, req, res, next)
	{
		return next();
	}

	update (ctx, req, res, next)
	{
		return next();
	}

	remove (ctx, req, res, next)
	{
		return next();
	}
}

module.exports = HelloController;
