
const config = require(process.cwd()+'/config/authenticate');
const AuthenticateComponent = require(process.cwd()+'/src/system/prototypes/AuthenticateComponent');

class Authenticate extends AuthenticateComponent
{
	constructor (app, server, componentDir)
	{
		super(app, server, componentDir);
		this.configure(config);
	}
}

module.exports = Authenticate;

