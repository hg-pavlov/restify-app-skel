
const errors = require('restify-errors'),
	rjwt = require('restify-jwt-community'),
	jwt = require('jsonwebtoken');


class Authenticate
{
	constructor (app)
	{
		this.app = app;
	}

	authenticate (options, req)
	{
		let user = null, credentials = null, repository = null;

		// strategy function
		let strategyType = options.strategy ? options.strategy.toLowerCase() : 'basic', strategyFn = null;
		switch (strategyType) {
			case 'basic': strategyFn = this.strategyBasic; break;
		}
		if (!strategyFn) throw new errors.InternalError('Authentication strategy "'+ strategyType +'" is not supported');
		credentials = strategyFn(req);

		// verification from repository (database)
		if (typeof options.repository === 'undefined')
			throw new errors.InternalError('User repository must be defined credentials to be verified');

		if (!credentials || typeof credentials.username === 'undefined' || typeof credentials.password === 'undefined')
			throw new errors.InternalError('Credentials must be defined credentials to be verified');

		repository = this.app.getComponentRepository(options.repository);

		user = this.verification(repository, credentials);

		req.set('auth.user', user);
	}

	getUser (req)
	{
		return req.get('auth.user');
	}

	strategyBasic (req)
	{
		if (req.authorization
			&& typeof req.authorization.scheme === 'string'
			&& req.authorization.scheme.toLowerCase() === 'basic'
			&& typeof req.authorization.basic === 'object'
			&& typeof req.authorization.basic.username !== 'undefined'
			&& typeof req.authorization.basic.password !== 'undefined'
		) {
			return req.authorization.basic;
		} else {
			throw new errors.UnauthorizedError('Authorized users only');
		}

		/*
		let credentials = null;

		if (req.headers && req.headers.authorization) {
			let authParts = req.headers.authorization.split(' ');
			if (authParts.length === 2 && /^Basic$/i.test(authParts[0])) {
				credentials = Buffer.from(authParts[1], 'base64').toString().split(/:(.+)/)
								.filter((val) => { return (val&&val.length>0); });
				if (credentials.length === 2) {
					credentials = { username: credentials[0], password: credentials[1] };
				} else {
					throw new errors.InvalidCredentialsError();
				}
			} else {
				throw new errors.InvalidHeaderError();
			}
		} else {
			throw new errors.UnauthorizedError();
		}
		return credentials;
		*/
	}

	verification (repository, credentials)
	{
		return repository.findOne(credentials);
	}
}

module.exports = Authenticate;

