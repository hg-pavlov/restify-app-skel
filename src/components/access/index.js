
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
		this.allowed = this.rules.allow ? true : false;
		return this.allowed;
	}
}

module.exports = Access;
