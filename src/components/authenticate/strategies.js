
const fs = require('fs'),
	errors = require('restify-errors'),
	passportLocal = require('passport-local'),
	passportHTTP = require('passport-http'),
	passportJWT = require('passport-jwt'),
	rjwt = require('restify-jwt-community'),
	jwt = require('jsonwebtoken');

let keys = {
	priv: fs.readFileSync(process.cwd()+'/config/jwt/private.key', 'utf8'),
	pub: fs.readFileSync(process.cwd()+'/config/jwt/public.key', 'utf8')
};


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
			return done(null, user);
		}
	);
	strategy.name = 'local';
	strategy.config = {
		"requiredFields":["username","password"],
		"defaultRepository":"users#User",
		"passportOptions": {
			session: false
		}
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
			let user = {};
//			throw new errors.UnauthorizedError();
//			return done(new errors.UnauthorizedError());
            return done(null, user);
        }
	);
	strategy.name = 'basic';
	strategy.config = {
		"requiredFields":["username","password"],
		"defaultRepository":"users#User",
		"passportOptions": {
			session: false
		}
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
            return done(null, user);
       	}
	);
	strategy.name = 'digest';
	strategy.config = {
		"requiredFields":["username","password"],
		"defaultRepository":"users#User",
		"passportOptions": {
			session: false
		}
	};

	return strategy;
};
exports.JWT = function(auth)
{
	let strategy = new passportJWT.Strategy(
		{
			passReqToCallback: true,
			jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: keys.pub,
			issuer: 'HGNET',
			audience: 'hgnet.ru'
	    },
    	function(req, jwtPayload, done) {
			let repository = auth.getRepository(req);
			let user = jwtPayload;
			console.log(user);
            return done(null, user);
       	}
	);
	strategy.name = 'jwt';
	strategy.config = {
		"requiredFields":["username","password"],
		"defaultRepository":"users#User",
		"passportOptions": {
			session: false
		}
	};

	return strategy;
};

