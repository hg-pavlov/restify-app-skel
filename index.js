
var App = require('./src/application');
var config = require('./config/app');
var routes = require('./config/routes');

const app = new App(config, routes);
app.start();

