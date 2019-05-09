
const fs = require('fs'),
	errors = require('restify-errors'),
	passport = require('passport'),
	strategies = require('./strategies'),
	Component = require(process.cwd()+'/src/system/prototypes/Component');

class Authenticate extends Component
{
	constructor (app, server, componentDir)
	{
		super(app, server, componentDir);

		server.use(passport.initialize());

		passport.use(strategies.Local(this));
		passport.use(strategies.Basic(this));
		passport.use(strategies.Digest(this));
		passport.use(strategies.JWT(this));

		server.use((req,res,next) => {
			req.flash = message => {
				console.log('flash: '+message);
			};
			res.redirect = addr => {
				res.header('Location', addr);
				res.send(302);
			};
			next();
		});

		this.authConfig = {
			"local":{
				"authHandler":this.strategyLocal.bind(this),
				"authInitiator":this.createAuthLocal.bind(this),
				"requiredFields":["username","password"],
				"defaultRepository":"users#User"
			},
			"basic":{
				"authHandler":this.strategyBasic.bind(this),
				"authInitiator":this.createAuthBasic.bind(this),
				"requiredFields":["username","password"],
				"defaultRepository":"users#User"
			},
			"digest":{
				"authHandler":this.strategyDigest.bind(this),
				"authInitiator":this.createAuthDigest.bind(this),
				"requiredFields":["username","password"],
				"defaultRepository":"users#User"
			},
			"jwt":{
				"authHandler":this.strategyJWT.bind(this),
				"authInitiator":this.createAuthJWT.bind(this),
				"requiredFields":["username","password"],
				"defaultRepository":"users#User"
			},
		};

		/**
		 * authentication checking required
		 * checking authentication hook; calling on every route !
		 */
		this.onEvent('appBeforeController', (routeObj, req, res, next) => {
			if (typeof routeObj.options === 'object' && typeof routeObj.options.auth === 'object' && routeObj.options.auth !== null) {
				this.authenticate(routeObj.options.auth, req, res, next);
			}
		});
	}

	authenticate (options, req, res, next)
	{
		let user = null, repository = (options.repository) ? this.app.getComponentRepository(options.repository) : null;

		req.set('auth.repository', repository); // verification/update token from repository (database)
		req.set('auth.options', options);

		// strategy function
		let strategyType = options.strategy ? options.strategy.toLowerCase() : 'basic';
		if (typeof this.authConfig[strategyType] === 'undefined')
			throw new errors.InternalError('Authentication strategy "'+ strategyType +'" is not supported');

		let strategyConf = this.authConfig[strategyType];
		strategyConf.authHandler(req, res, next, repository, options);

		user = req.user||null;
		req.set('auth.user', user);
	}

	getUser (req)
	{
		return req.get('auth.user');
	}
	getOptions (req)
	{
		return req.get('auth.options');
	}
	getRepository (req, strategyType)
	{
		return req.get('auth.repository') || ((typeof strategyType !== 'undefined' && typeof this.authConfig[strategyType] !== 'undefined') ?
			this.app.getComponentRepository(this.authConfig[strategyType].defaultRepository) : null);
	}

	strategyLocal (req, res, next, repository, options)
	{
		passport.authenticate(
			'local',
			{
				failureRedirect: '/auth/local', failureFlash: true, session: false
			}
		)(req, res, next);
	}
	strategyBasic (req, res, next, repository, options)
	{
		passport.authenticate(
			'basic',
			{
				failureRedirect: '/auth/basic', session: false
			}
		)(req, res, next);
	}
	strategyDigest (req, res, next, repository, options)
	{
		passport.authenticate(
			'digest',
			{
				failureRedirect: '/auth/digest', session: false
			}
		)(req, res, next);
	}
	strategyJWT (req, res, next, repository, options)
	{
		passport.authenticate(
			'jwt',
			{
				failureRedirect: '/auth/jwt', session: false
			}
		)(req, res, next);
	}

	getRequiredFieldsByStrategy (strategyType)
	{
		return (typeof this.authConfig[strategyType] === 'undefined') ? null : this.authConfig[strategyType].requiredFields;
	}
	createAuthByStrategy (strategyType, req)
	{
		return (typeof this.authConfig[strategyType] === 'undefined') ? null : this.authConfig[strategyType].authInitiator(req);
	}

	createAuthLocal (req)
	{
		let repository = this.getRepository(req, 'local');
		return { "strategy": "LOCAL", "username": "maksim", "token": "jjjjjjjjjjj", "refreshToken": "KKkkkkkkkkkkkkk" };
	}

	createAuthBasic (req)
	{
		let repository = this.getRepository(req, 'basic');
		return { "strategy": "BASIC", "username": "maksim", "token": "jjjjjjjjjjj", "refreshToken": "KKkkkkkkkkkkkkk" };
	}

	createAuthDigest (req)
	{
		let repository = this.getRepository(req, 'digest');
		return { "strategy": "DIGEST", "username": "maksim", "token": "jjjjjjjjjjj", "refreshToken": "KKkkkkkkkkkkkkk" };
	}

	createAuthJWT (req)
	{
		let repository = this.getRepository(req, 'jwt');
		return { "strategy": "JWT", "username": "maksim", "token": "jjjjjjjjjjj", "refreshToken": "KKkkkkkkkkkkkkk" };
	}
}

module.exports = Authenticate;

