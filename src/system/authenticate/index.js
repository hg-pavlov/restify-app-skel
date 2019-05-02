
class Authenticate
{
	constructor ()
	{
	}

	authenticate (options, req)
	{
		let user = { uid: 1, name: 'Sean', admin: false };
		req.set('auth.user', user);
	}

	getUser (req)
	{
		return req.get('auth.user');
	}
}

module.exports = new Authenticate();
