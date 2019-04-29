
let auth = require('../authenticate');
let access = require('../access');

class Context
{
	constructor (options)
	{
		this.auth = new auth(options.auth||{});
		this.access = new access(options.access||{});

		this.user = this.auth.getUser();
		this.access.process(this.user);
		console.log('context access: ',this.access);
	}

	accessIsAllowed ()
	{
		
	}
}

module.exports = Context;
