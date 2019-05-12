
const errors = require('restify-errors');

class UserController
{
	constructor (app, key)
	{
		this.app = app;
		this.key = key;
		this.routes = [
			{
				"path":"/users", "type":"get", "handler": this.readList,
				"options": {
					"auth": { "strategy":"JWT", "repository":"users#UserMysql" },
					"access": { "allow":true, "deny":null }
				},
			},
			{
				"path":"/user/:id", "type":"get", "handler": this.read,
				"options": {
					"auth": { "strategy":"Basic", "repository":"users#UserMysql" },
					"access": { "allow":true, "deny":null }
				},
			},
			{
				"path":"/user/:id", "type":"post", "handler": this.create,
				"options": {
					"auth": { "strategy":"Basic", "repository":"users#UserMysql" },
					"access": { "allow":true, "deny":null }
				},
			},
			{
				"path":"/user/:id", "type":"put", "handler": this.update,
				"options": {
					"auth": { "strategy":"Basic", "repository":"users#UserMysql" },
					"access": { "allow":true, "deny":null }
				},
			},
			{
				"path":"/user/:id", "type":"del", "handler": this.remove,
				"options": {
					"auth": { "strategy":"Basic", "repository":"users#UserMysql" },
					"access": { "allow":true, "deny":null }
				},
			},
		];
	}

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all Users from database (limited by parameters from request body)
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: offset
 *         description: Offset of User list from start of it
 *         in: query
 *         required: false
 *         type: integer
 *         example: 10
 *       - name: limit
 *         description: Number of Users needed
 *         in: query
 *         required: false
 *         type: integer
 *         example: 10
 *       - name: filter
 *         description: Filter of User's field values
 *         in: query
 *         required: false
 *         type: object
 *         example: { "email":"^email.*$", "name":"^Maksim[a-z]$", "balance:<":10 }
 *     responses:
 *       200:
 *         description: Array of All Users, limited by filter conditions and count limitations by parameters
 *         schema:
 *           $ref: '#/definitions/User'
 */
	readList (req, res, next)
	{
		res.send([
			{ hello: '1' },
			{ hello: '2' },
			{ hello: '3' },
			{ hello: '4' },
		]);
		return next();
	}

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     description: Returns a single User by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *         type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: A single User
 *         schema:
 *           $ref: '#/definitions/User'
 */
	read (req, res, next)
	{
		console.log('----',req.username,req.authorization);
		res.send({
			hello: req.params.id
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

module.exports = UserController;
