
const path = require('path'),
	errors = require('restify-errors');

let application = null;

class AuthController
{
	constructor (app, key)
	{
		application = app;
		this.app = app;
		this.key = key;
		this.routes = [
			{
				"path":"/auth/:strategy", "type":"get", "handler": this.authRequirements,
				"name":"Get Auth",
				"description":"Get Requirements for that strategy"
			},
			{
				"path":"/auth/:strategy", "type":"post", "handler": this.authProcess,
				"name":"Create Auth",
				"description":"Create Authentication"
			},
		];
	}

	authRequirements (req, res, next)
	{
		let componentName = path.basename(path.join(__dirname,'..'));
		let auth = application.getComponent(componentName), strategy = req.params.strategy.toLowerCase();
		if (!auth)
			throw new errors.InternalServerError('Authenticate component not found by name "'+componentName+'"');
		if (!strategy || strategy.length < 1)
			throw new errors.InternalServerError('Strategy is undefined in the url path');

		let requiredFields = auth.getRequiredFieldsByStrategy(strategy);
		if (!requiredFields)
			throw new errors.NotFoundError('Strategy "'+req.params.strategy+'" is not implemented yet');

		res.send({
			strategy: strategy,
			requiredFields: requiredFields
		});
		return next();
	}

	authProcess (req, res, next)
	{
		let componentName = path.basename(path.join(__dirname,'..'));
		let auth = application.getComponent(componentName), strategy = req.params.strategy.toLowerCase();
		if (!auth)
			throw new errors.InternalServerError('Authenticate component not found by name "'+componentName+'"');
		if (!strategy || strategy.length < 1)
			throw new errors.InternalServerError('Strategy is undefined in the url path');

		let result = auth.createAuthByStrategy(strategy, req);
		if (!result)
			throw new errors.NotFoundError('Strategy "'+req.params.strategy+'" is not implemented yet');

		res.send({
			result: result
		});
		return next();
	}
}

module.exports = AuthController;
