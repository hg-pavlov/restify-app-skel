
const errors = require('restify-errors');
const Component = require(process.cwd()+'/src/system/prototypes/Component');
const auth = require(process.cwd()+'/src/system/authenticate');
const access = require(process.cwd()+'/src/system/access');

class UserComponent extends Component
{
	constructor (app, server, componentDir)
	{
		super(app, server, componentDir);

		/**
		 * authentication checking required
		 *
		 */
		this.onEvent('appBeforeController', (routeObj, req) => {
			auth.authenticate(routeObj.options.auth||{}, req);
			access.process(routeObj.options.access||{}, auth.getUser(req), req);
			if (!access.isAllowed(req)) {
				throw new errors.ForbiddenError();
			}
		});
	}
}

module.exports = UserComponent;
