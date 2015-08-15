'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Sensor = mongoose.model('Sensor'),
	_ = require('lodash'),
	mqtt = require('mqtt'), url = require('url');    
	
	// Parse 
	var mqtt_url = url.parse(process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883');
	var auth = (mqtt_url.auth || ':').split(':');

	// Create a client connection
	var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
	  username: auth[0],
	  password: auth[1] 
	});    

/**
 * Create a article
 */
exports.enviarDados = function(req, res) {
	var sensor = new Sensor(req.body);
	
	sensor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(sensor);
		}
	});
};

/**
 * List
 */
exports.list = function(req, res) {
	Sensor.find().sort('-created').exec(function(err, sensores) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(sensores);
		}
	});
};

exports.stream = function(req,res) {
    // set timeout as high as possible
    req.socket.setTimeout(Number.MAX_VALUE);

    // send headers for event-stream connection
    // see spec for more information
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');

    // Timeout timer, send a comment line every 20 sec
    var timer = setInterval(function() {
        res.write(':' + '\n');
    }, 20000);


    var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
        username: auth[0],
        password: auth[1] 
    });
    client.on('connect', function() {
        client.subscribe('t1', function() {
            client.on('message', function(topic, msg, pkt) {
                res.write('data:' + msg + '\n\n');
            });
        });
    });

    // When the request is closed, e.g. the browser window
    // is closed. We search through the open connections
    // array and remove this connection.
    req.on("close", function() {
        clearTimeout(timer);
        client.end();
    });
};

exports.publish = function(req,res)
{
    var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
        username: auth[0],
        password: auth[1] 
    });
    client.on('connect', function() {
        client.publish('t1', new Date().toString(), function() {
            client.end();
            res.writeHead(204, { 'Connection': 'keep-alive' });
            res.end();
        });
    });
};