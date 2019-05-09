
const errors = require('restify-errors'),
	Component = require(process.cwd()+'/src/system/prototypes/Component');

class Access extends Component
{
	constructor (app, server, componentDir)
	{
		super(app, server, componentDir);

		/**
		 * access checking required
		 * checking access hook; calling on every route !
		 */
		this.onEvent('appBeforeController', (routeObj, req, res, next) => {
			if (typeof routeObj.options === 'object' && typeof routeObj.options.access === 'object' && routeObj.options.access !== null) {
				this.process(routeObj.options.access, this.app.getComponent('authenticate').getUser(req), req);
			}
		});
	}

	process (rules, user, req)
	{
		let allowed = rules.allow ? true : false;
		req.set('access.allowed', allowed);
		if (!allowed) {
			throw new errors.ForbiddenError();
		}
	}

	isAllowed (req)
	{
		return req.get('access.allowed');
	}
}

module.exports = Access;
