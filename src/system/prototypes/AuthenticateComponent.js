
const fs = require('fs'),
	path = require('path'),
	errors = require('restify-errors'),
	passport = require('passport'),
	Component = require(process.cwd()+'/src/system/prototypes/Component');

class Authenticate extends Component
{
	constructor (app, server, componentDir)
	{
		super(app, server, componentDir);

		server.use(passport.initialize());

		this.authConfig = {};
		let strategies = require(path.join(componentDir, 'strategies'));
		Object.keys(strategies).forEach((strategyType) => {
			let strategy = strategies[strategyType](this);
			this.authConfig[strategy.name] = strategy.config;
			passport.use(strategy);
		});

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
		this.authHandler(strategyType, req, res, next, repository, options);

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

	getRequiredFieldsByStrategy (strategyType)
	{
		return (typeof this.authConfig[strategyType] === 'undefined') ? null : this.authConfig[strategyType].requiredFields;
	}
	createAuthByStrategy (strategyType, req)
	{
		return this.authInitiator(strategyType, req);
	}


	authHandler (strategyType, req, res, next, repository, options)
	{
		let passportOptions = this.authConfig[strategyType].passportOptions||{};
		passport.authenticate(strategyType, passportOptions)(req, res, next);
	}
	authInitiator (strategyType, req)
	{
		let repository = this.getRepository(req, strategyType);
		let user = repository ? repository.findOne(req.body) : null;
		if (!user) throw new errors.InvalidCredentialsError();
		return user;
	}
}

module.exports = Authenticate;


