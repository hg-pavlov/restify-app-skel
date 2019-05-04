
const fs = require('fs'),
	errors = require('restify-errors'),
	rjwt = require('restify-jwt-community'),
	jwt = require('jsonwebtoken');

let keys = {
	priv: fs.readFileSync(process.cwd()+'/config/jwt/private.key', 'utf8'),
	pub: fs.readFileSync(process.cwd()+'/config/jwt/public.key', 'utf8')
};

class Authenticate
{
	constructor (app)
	{
		this.app = app;
	}

	authenticate (options, req)
	{
		let user = null, repository = this.app.getComponentRepository(options.repository);

		// verification/update token from repository (database)
		if (typeof options.repository === 'undefined')
			throw new errors.InternalError('User repository must be defined credentials to be verified');

		// strategy function
		let strategyType = options.strategy ? options.strategy.toLowerCase() : 'basic';
		switch (strategyType) {
			case 'basic': user = this.strategyBasic(req, repository, options); break;
			case 'jwt': user = this.strategyJWT(req, repository, options); break;
			default:
				throw new errors.InternalError('Authentication strategy "'+ strategyType +'" is not supported');
		}

		req.set('auth.user', user);
	}

	getUser (req)
	{
		return req.get('auth.user');
	}

	strategyBasic (req, repository, options)
	{
		let user = null, credentials = null;

		if (req.authorization
			&& typeof req.authorization.scheme === 'string'
			&& req.authorization.scheme.toLowerCase() === 'basic'
			&& typeof req.authorization.basic === 'object'
			&& typeof req.authorization.basic.username !== 'undefined'
			&& typeof req.authorization.basic.password !== 'undefined'
		) {
			credentials = req.authorization.basic;
		} else {
			throw new errors.UnauthorizedError('Authorized users only');
		}

		if (!credentials || typeof credentials.username === 'undefined' || typeof credentials.password === 'undefined')
			throw new errors.InternalError('Credentials must be defined credentials to be verified');

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

		user = repository.findOne(credentials);

		return user;
	}
	strategyJWT (req, repository, options)
	{
		let user = null, token = null;

		if (req.authorization
			&& typeof req.authorization.scheme === 'string'
			&& req.authorization.scheme.toLowerCase() === 'bearer'
			&& typeof req.authorization.credentials === 'string'
		) {
			token = req.authorization.credentials;
		} else {
			throw new errors.UnauthorizedError('Authorized users only');
		}

		if (!token)
			throw new errors.UnauthorizedError('JWT must be defined to be verified');

		user = jwt.verify(token, keys.pub);

		return user;
	}

	jwtCreate (credentials, repository, options, ttl)
	{
		let user = repository.findOne(credentials), data = {};
		if (!user) throw new errors.NotFoundError('User not found');

		data.user = user;

		return jwt.sign(data, keys.priv, {
			algorithm: 'RS256',
            expiresIn: ttl||'15m'
        });
	}
}

module.exports = Authenticate;

