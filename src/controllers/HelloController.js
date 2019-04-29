
const errors = require('restify-errors');
const context = require('../components/context');

class HelloController
{
	constructor (app, server)
	{
		this.app = app;
		
		this.setServerRouting(server, [
			{
				"path":"/hello/:name", "type":"get", "handler": this.read,
				"options": {
					"auth": { "strategy":"Basic", "storage":"Hello" },
					"access": { "allow":true, "deny":null }
				},
				"name":"Get Hello",
				"description":"Get Hello Greeting"
			},
		]);
	}
	setServerRouting (server, routes)
	{
		routes.forEach((routeObj) => {

			server[routeObj.type]({ path: routeObj.path, name: routeObj.name||'' }, async (req, res, next) => {
				// create context
				let ctx = new context(routeObj.options);
				if (ctx.accessIsAllowed()) {
					this[method](req, res, next);
				} else {
					next(new errors.ForbiddenError());
				}
			});
		});
	}

	read (req, res, next)
	{
		console.log(this.app.context,req.username,req.authorization);
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

module.exports = HelloController;
