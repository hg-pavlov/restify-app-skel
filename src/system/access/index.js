
class Access
{
	constructor ()
	{
	}

	process (rules, user, req)
	{
		console.log('try user access: ',user,rules);
		req.set('access.allowed', rules.allow ? true : false);
		console.log('access set to: ',req.get('access.allowed'));
	}

	isAllowed (req)
	{
		console.log('access get from: ',req.get('access.allowed'));
		return req.get('access.allowed');
	}
}

module.exports = new Access();
