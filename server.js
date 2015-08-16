'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk'),
	http = require('http'),
	mqtt = require('mqtt'), url = require('url'),
	request = require('request');

	// Parse 
	var mqtt_url = url.parse(process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883');
	var auth = (mqtt_url.auth || ':').split(':');

	// Create a client connection
	var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
	  username: auth[0],
	  password: auth[1] 
	}); 

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	} else {
		console.log(chalk.blue('Connected to MongoDB!'));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
	    username: auth[0],
	    password: auth[1] 
	});
	client.on('connect', function() {
	    client.subscribe('t1', function() {
	        client.on('message', function(topic, msg, pkt) {
	        	//salvar dados aqui e mandar para o front
	            console.log('data:' + msg + '\n\n');
	        });
	    });
	});

// Logging initialization
console.log('AComanda application started on port ' + config.port);