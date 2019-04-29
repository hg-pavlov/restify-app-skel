
class Authenticate
{
	constructor ()
	{
		
	}

	authorization ()
	{
		return { uid: 1, name: 'Sean', admin: false };
	}
}

module.exports = Authenticate;
