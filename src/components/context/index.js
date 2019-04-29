
let auth = require('../authenticate');
let access = require('../access');
let self = null;

class Context
{
	constructor (options)
	{
		self = this;
		this.auth = new auth(options.auth||null);
		this.access = new access(options.access||null);

		this.user = this.auth.authorization();
		this.access.allowed = this.access.process(this.user);
		console.log('context access: ',this.access);
	}
}

module.exports = Context;
