
const fs = require('fs'),
	errors = require('restify-errors'),
	passportLocal = require('passport-local'),
	passportHTTP = require('passport-http'),
	passportJWT = require('passport-jwt'),
	rjwt = require('restify-jwt-community'),
	jwt = require('jsonwebtoken');


exports.Local = function(auth)
{
	let strategy = new passportLocal.Strategy(
		{
			passReqToCallback: true,
			usernameField: 'username',
			passwordField: 'password'
		},
    	function(req, username, password, done) {
			let repository = auth.getRepository(req);
			let user = {};
			if (user) {
            	return done(null, user);
			}
            return done(new errors.UnauthorizedError(), user);
		}
	);
	strategy.init = function (user)
	{
		let token = '';
		return { token: token };
	};
	strategy.name = 'local';
	strategy.config = {
		"strategyObj":strategy,
	};

	return strategy;
};
exports.Basic = function(auth)
{
	let strategy = new passportHTTP.BasicStrategy(
		{
			passReqToCallback: true,
	    },
    	function(req, username, password, done) {
			let repository = auth.getRepository(req);
			let user = repository.findOne(req.body);
			if (user) {
            	return done(null, user);
			}
            return done(new errors.UnauthorizedError(), user);
        }
	);
	strategy.init = function (user)
	{
		let token = '';
		return { token: token };
	};
	strategy.name = 'basic';
	strategy.config = {
		"strategyObj":strategy,
	};

	return strategy;
};
exports.Digest = function(auth)
{
	let strategy = new passportHTTP.DigestStrategy(
		{
			passReqToCallback: true,
	    },
    	function(req, username, password, done) {
			let repository = auth.getRepository(req);
			let user = {};
			if (user) {
            	return done(null, user);
			}
            return done(new errors.UnauthorizedError(), user);
       	}
	);
	strategy.init = function (user)
	{
		let token = '';
		return { token: token };
	};
	strategy.name = 'digest';
	strategy.config = {
		"strategyObj":strategy,
	};

	return strategy;
};
exports.JWT = function(auth)
{
	let conf = {
		keys: {
			priv: fs.readFileSync(process.cwd()+'/config/jwt/private.key', 'utf8'),
			pub: fs.readFileSync(process.cwd()+'/config/jwt/public.key', 'utf8')
		},
		issuer: 'HGNET',
		audience: 'hgnet.ru',
		expiresIn: 600,
		authHeaderScheme: 'JWT',
	};

	let signConf = {
		audience: conf.audience||null,
		issuer: conf.issuer||null,
		algorithm: 'RS256',
	},
	verifyConf = {
		audience: conf.audience||null,
		issuer: conf.issuer||null,
		passReqToCallback: true,
		jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme(conf.authHeaderScheme||'JWT'),
		secretOrKey: conf.keys.pub,
		algorithms: [signConf.algorithm],
	};
	let strategy = new passportJWT.Strategy(
	    verifyConf,
    	function(req, jwtPayload, done) {
			let repository = auth.getRepository(req);
			let user = jwtPayload.user||null;
			if (user) {
            	return done(null, user);
			}
			return done(new errors.UnauthorizedError(), null);
       	}
	);
	strategy.init = function (user)
	{
		let data = {
			user: user,
			exp: conf.expiresIn ? Math.ceil(new Date().getTime()/1000)+conf.expiresIn : null,
		},
		token = jwt.sign(data, conf.keys.priv, signConf);
		return { token: token };
	};
	strategy.name = 'jwt';
	strategy.config = {
		"strategyObj":strategy,
	};

	return strategy;
};

