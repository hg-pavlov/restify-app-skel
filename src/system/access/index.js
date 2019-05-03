
const errors = require('restify-errors');

class Access
{
	constructor (app)
	{
		this.app = app;
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
