

let User = {
	firstName: { type: String, name: 'first_name' },
	lastName: { type: String, name: 'last_name' },
	email: { type: String, name: 'email', uniq: true, limit: 128, index: true },
	password: { type: String, limit: 64 },
	birthDate: Date,
	createdOn: { type: Date, default: function () { return new Date } },
	updatedOn: { type: Date, default: function () { return new Date } },
	activated: { type: Boolean, default: false }
};

module.exports = User;
