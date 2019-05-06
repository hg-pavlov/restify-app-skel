
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

		/**
		 * authentication checking required
		 * checking authentication hook; calling on every route !
		 */
		this.onEvent('appBeforeController', (routeObj, req, res, next) => {
			if (typeof routeObj.options.auth === 'object' && routeObj.options.auth !== null) {
				this.authenticate(routeObj.options.auth, req, res, next);
			}
		});
	}

	authenticate (options, req, res, next)
	{
		let user = null, repository = this.app.getComponentRepository(options.repository);

		req.set('auth.repository', repository);
		req.set('auth.options', options);

		// verification/update token from repository (database)
		if (typeof options.repository === 'undefined')
			throw new errors.InternalError('User repository must be defined credentials to be verified');

		// strategy function
		let strategyType = options.strategy ? options.strategy.toLowerCase() : 'basic';
		switch (strategyType) {
			case 'local':	this.strategyLocal(req, res, next, repository, options); break;
			case 'basic':	this.strategyBasic(req, res, next, repository, options); break;
			case 'digest':	this.strategyDigest(req, res, next, repository, options); break;
			case 'jwt':		this.strategyJWT(req, res, next, repository, options); break;
			default:
				throw new errors.InternalError('Authentication strategy "'+ strategyType +'" is not supported');
		}

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
	getRepository (req)
	{
		return req.get('auth.repository');
	}

	strategyLocal (req, res, next, repository, options)
	{
		passport.authenticate(
			'local',
			{
				successRedirect: '/',
				failureRedirect: '/login',
				failureFlash: true
			}
		)(req, res, next);
	}
	strategyBasic (req, res, next, repository, options)
	{
		passport.authenticate(
			'basic',
			{
	//			successRedirect: '/',
				failureRedirect: '/login',
				session: false
			}
		)(req, res, next);
	}
	strategyDigest (req, res, next, repository, options)
	{
		passport.authenticate(
			'digest',
			{
	//			successRedirect: '/',
				failureRedirect: '/login',
				session: false
			}
		)(req, res, next);
	}
	strategyJWT (req, res, next, repository, options)
	{
		passport.authenticate(
			'jwt',
			{
	//			successRedirect: '/',
				failureRedirect: '/login',
				session: false
			}
		)(req, res, next);
	}
}

module.exports = Authenticate;

