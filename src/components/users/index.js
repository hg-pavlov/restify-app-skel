
const errors = require('restify-errors');
const Component = require(process.cwd()+'/src/system/prototypes/Component');
const Authenticate = require(process.cwd()+'/src/system/authenticate');
const Access = require(process.cwd()+'/src/system/access');

class UserComponent extends Component
{
	constructor (app, server, componentDir)
	{
		super(app, server, componentDir);

		this.auth = new Authenticate(app);
		this.access = new Access(app);

		/**
		 * authentication checking required
		 *
		 */
		this.onEvent('appBeforeController', (routeObj, req) => {
			if (typeof routeObj.options.auth === 'object' && routeObj.options.auth !== null) {
				this.auth.authenticate(routeObj.options.auth, req);
				this.access.process(routeObj.options.access||{}, this.auth.getUser(req), req);
			}
		});
	}
}

module.exports = UserComponent;
