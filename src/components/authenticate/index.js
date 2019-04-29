
class Authenticate
{
	constructor (options)
	{
		this.options = options;
	}

	getUser ()
	{
		return { uid: 1, name: 'Sean', admin: false };
	}
}

module.exports = Authenticate;
