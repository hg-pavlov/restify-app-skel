
var App = require('./src/application');
var config = require('./config/app');

const app = new App(config);
app.start();

