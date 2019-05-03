
const errors = require('restify-errors');

class UserController
{
	constructor (app, key)
	{
		this.app = app;
		this.key = key;
		this.routes = [
			{
				"path":"/user/:id", "type":"get", "handler": this.read,
				"options": {
					"auth": { "strategy":"Basic", "repository":"users#User" },
					"access": { "allow":true, "deny":null }
				},
				"name":"Get User",
				"description":"Get User"
			},
			{
				"path":"/user/:id", "type":"post", "handler": this.create,
				"options": {
					"auth": { "strategy":"Basic", "repository":"users#User" },
					"access": { "allow":true, "deny":null }
				},
				"name":"Create User",
				"description":"Create User"
			},
			{
				"path":"/user/:id", "type":"put", "handler": this.update,
				"options": {
					"auth": { "strategy":"Basic", "repository":"users#User" },
					"access": { "allow":true, "deny":null }
				},
				"name":"Update User",
				"description":"Update User"
			},
			{
				"path":"/user/:id", "type":"del", "handler": this.remove,
				"options": {
					"auth": { "strategy":"Basic", "repository":"users#User" },
					"access": { "allow":true, "deny":null }
				},
				"name":"Delete User",
				"description":"Delete User"
			},
		];
	}

	read (req, res, next)
	{
		console.log('----',req.username,req.authorization);
		res.send({
			hello: req.params.id
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

module.exports = UserController;
