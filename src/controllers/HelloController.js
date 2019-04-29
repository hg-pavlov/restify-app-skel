
class HelloController
{
	constructor (app, storage)
	{
		this.app = app;
		this.storage = storage;
	}

	read (req, res, next)
	{
		console.log(this.app.context,req.username,req.authorization);
		res.send({
			hello: req.params.name
		});
		return next();
	}

	create (req, res, next)
	{
		return next();
	}

	update (req, res, next)
	{
		return next();
	}

	remove (req, res, next)
	{
		return next();
	}
}

module.exports = HelloController;
