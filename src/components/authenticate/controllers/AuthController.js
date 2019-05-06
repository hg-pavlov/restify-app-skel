
const errors = require('restify-errors');

class AuthController
{
	constructor (app, key)
	{
		this.app = app;
		this.key = key;
		this.routes = [
			{
				"path":"/auth", "type":"get", "handler": this.authForm,
				"options": {
					"auth": { "strategy":"Basic", "repository":"users#User" },
					"access": { "allow":true, "deny":null }
				},
				"name":"Get Hello",
				"description":"Get Hello Greeting"
			},
			{
				"path":"/auth", "type":"post", "handler": this.authProc,
				"options": {
					"auth": { "strategy":"Basic", "repository":"users#User" },
					"access": { "allow":true, "deny":null }
				},
				"name":"Create Hello",
				"description":"Create Hello Greeting"
			},
		];
	}

	authForm (req, res, next)
	{
		console.log('get ----',req.username,req.authorization);
		res.send({
			hello: 'ddkd'
		});
		return next();
	}

	authProc (req, res, next)
	{
		console.log('post ----',req.username,req.authorization);
		res.send(200);
		return next();
	}
}

module.exports = AuthController;
