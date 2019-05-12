
const juggling = require('jugglingdb');
const schema = new juggling.Schema('mysql', {
	port: 3306,
	host: 'localhost',
	password: '1111',
	database: 'restifydb',
	username: 'restifydb',
});

const UserModel = require('../models/UserModel'),
	UserGroupModel = require('../models/UserGroupModel'),
	UserRoleModel = require('../models/UserRoleModel'),
	UserRolePermissionModel = require('../models/UserRolePermissionModel'),
	UserPhoneModel = require('../models/UserPhoneModel');

let User,
	UserGroup, UserToGroup,
	UserRole, UserToRole,
	UserRolePermission, UserRoleToPermission,
	UserPhone;

User = schema.define('User', UserModel, {
	table: 'users',
});
UserGroup = schema.define('UserGroup', UserGroupModel, {
	table: 'user_groups',
});
UserRole = schema.define('UserRole', UserRoleModel, {
	table: 'user_roles',
});
UserRolePermission = schema.define('UserRolePermission', UserRolePermissionModel, {
	table: 'user_role_permissions',
});
UserToGroup = schema.define(
	'UserToGroup',
	{ usergroupId: { type: Number, index: true }, userId: { type: Number, index: true } },
	{ table: 'user_to_group', }
);
UserToRole = schema.define(
	'UserToRole',
	{ userroleId: { type: Number, index: true }, userId: { type: Number, index: true } },
	{ table: 'user_to_role', }
);
UserRoleToPermission = schema.define(
	'UserRoleToPermission',
	{ userroleId: { type: Number, index: true }, userrolepermissionId: { type: Number, index: true } },
	{ table: 'user_role_to_permission', }
);
User.hasAndBelongsToMany(UserGroup, {as: 'groups', through: UserToGroup});
UserGroup.hasAndBelongsToMany(User, {as: 'users', through: UserToGroup});
User.hasAndBelongsToMany(UserRole, {as: 'roles', through: UserToRole});
UserRole.hasAndBelongsToMany(User, {as: 'users', through: UserToRole});
UserRole.hasAndBelongsToMany(UserRolePermission, {as: 'permissions', through: UserRoleToPermission});
UserRolePermission.hasAndBelongsToMany(UserRole, {as: 'roles', through: UserRoleToPermission});

UserPhone = schema.define('UserPhone', UserPhoneModel, {
	table: 'user_phones',
});
User.hasMany(UserPhone, {as: 'phones', foreignKey: 'userId'});
UserPhone.belongsTo(User, {as: 'user', foreignKey: 'userId'});

class UserMysqlRepository
{
	constructor (app, key)
	{
		this.app = app;
		this.key = key;

		this._upgrade();
//		this._migrate();
	}

	_migrate ()
	{
		schema.automigrate();
	}
	_upgrade ()
	{
		schema.isActual((err, actual) => {
			if (!actual) {
				schema.autoupdate();
			}
		});
	}

	findOne (userData)
	{
		let user = User.findOne({ where: userData });
		return user;
	}

	createOne (userData)
	{
		User.create(userData);
	}
}

module.exports = UserMysqlRepository;
