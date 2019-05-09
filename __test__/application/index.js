
const rootDir = process.cwd(), path = require('path');
const assert = require('assert');
const config = require(path.join(rootDir,'config','app'));
const App = require(path.join(rootDir,'src','application')), app = new App(config);
const Component = require(path.join(rootDir,'src','system','prototypes','Component'));


let appSequence = app.loadSequence();
let appComponents = app.components;
let appFirstComponent = app.getComponent(Object.keys(app.components)[0]||null);

describe('Application', function() {
	describe('#loadSequence()', function() {
		it('should return array with length > 0', function() {
			assert.ok(Array.isArray(appSequence) && appSequence.length > 0);
		});
	});
	describe('#loadComponents() from app.components', function() {
		it('should be an Object instance and not empty', function() {
			assert.ok(appComponents instanceof Object && Object.keys(appComponents).length > 0);
		});
	});
	describe('#getComponent()', function() {
		it('should return component initialized - Component object', function() {
			assert.ok(appFirstComponent instanceof Component);
		});
	});
});

