
class Access
{
	constructor (rules)
	{
		this.rules = rules;
		console.log('access control rules: ',this.rules);
	}

	process (user)
	{
		console.log('try user access: ',user,this.rules);
		this.allowed = false;
		return this.allowed;
	}
}

module.exports = Access;
