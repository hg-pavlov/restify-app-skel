
const restify = require('restify'),
	Application = require('./system/prototypes/Application');

class App extends Application
{
	init ()
	{
		this.server.pre(restify.plugins.pre.context());
		this.server.use(restify.plugins.acceptParser(this.server.acceptable));
		this.server.use(restify.plugins.authorizationParser());
		this.server.use(restify.plugins.dateParser());
		this.server.use(restify.plugins.queryParser());
		this.server.use(restify.plugins.urlEncodedBodyParser());
	}

	loadSequence ()
	{
		return [
			'authenticate',
			'access',
			'users',
			'default',
		];
	}

	start ()
	{
		this.server.listen(
			process.env.NODE_PORT||this.config.server.port,
			process.env.NODE_HOST||this.config.server.host,
			() => {
				console.log('listening: %s', this.server.url);
			}
		);
	}
}

module.exports = App;
