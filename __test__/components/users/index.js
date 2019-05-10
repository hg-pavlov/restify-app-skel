
const chai = require('chai'), chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

const rootDir = process.cwd(), path = require('path');
const config = require(path.join(rootDir,'config','app'));
const App = require(path.join(rootDir,'src','application')), app = new App(config);


describe('Component Users', () => {
	describe('#GET /users', () => {
		it('it should get all users', (done) => {
			chai.request(app.server)
			.get('/users')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(4);
				done();
			});
		});
	});
});

