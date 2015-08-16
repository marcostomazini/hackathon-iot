'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Sensor = mongoose.model('Sensor'),
	_ = require('lodash'),
    moment = require('moment'),
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

/**
 * Show the current sensor
 */
exports.read = function(req, res) {
    res.json(req.sensor);
};

/**
 * Sensor
 */
exports.sensorByID = function(req, res, next, id) {
    Sensor.find().sort('-created').exec(function(err, sensores) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var objetos = [];
            _.forEach(sensores, function(item, key) {
                var teste = item.valor.split('|');
                _.forEach(teste, function(item2, key) {   
                    var sensor = item2.split(':');
                    objetos.push({sensor: sensor[0], valor: sensor[1], data: moment(item.created).valueOf()});
                });
            });            

            switch(id) {

                case 'caixa': // caixa 
                    var resultado = _.take(_.filter(objetos, { 'sensor': 'C' }), 30);

                    _.forEach(resultado, function(item, key) {   
                        var valor = (20 - parseInt(item.valor)) * 100;
                        if (valor < 0) valor = 0;
                        item.valor = valor;
                    });

                    res.json(resultado);
                break;

                case 'caixa-historico': // caixa 
                    var resultadoCaixa = _.take(_.filter(objetos, { 'sensor': 'C' }), 30);
                    var resultadoGiro = _.take(_.filter(objetos, { 'sensor': 'G' }), 30);

                    var historicos = [{
                        label: 'Registro',
                        color: '#768294',
                        data: []
                    },{
                        label: 'Caixa',
                        color: '#1f92fe',
                        data: []
                    }];

                    _.forEach(resultadoCaixa, function(item, key) { 
                        historicos[1].data.push([item.data,parseInt(item.valor)]);
                        //historicos[0].data.push(item.data);
                    });

                    _.forEach(resultadoGiro, function(item, key) {   
                        historicos[0].data.push([item.data,parseInt(item.valor)]);                        
                    });

                    res.json(historicos);
                break;

                case 'solo': // umidade do solo
                    var resultado = _.take(_.filter(objetos, { 'sensor': 'U' }), 30);
                    res.json(resultado);
                break;
                
                case 'chuva': // chuva
                    var resultado = _.take(_.filter(objetos, { 'sensor': 'A' }), 30);
                    res.json(resultado);
                break;

                case 'giro': // giro
                    var resultado = _.take(_.filter(objetos, { 'sensor': 'G' }), 30);

                    _.forEach(resultado, function(item, key) {   
                        var valor = parseInt(item.valor) * 0.1;
                        item.valor = valor;
                    });

                    res.json(resultado);
                break;

                case 'temperatura': // temperatura
                    var resultado = _.take(_.filter(objetos, { 'sensor': 'T' }), 30);
                    res.json(resultado);
                break;

                case 'ar': // humidade do ar
                    var resultado = _.take(_.filter(objetos, { 'sensor': 'H' }), 30);
                    res.json(resultado);
                break;

                default:             // Default executes if the case labels
                    res.json({message: 'erro'});
                break;

            }

            //res.json(sensores);
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
        //client.publish('t1', new Date().toString(), function() {
        client.publish('t1', 'C:230|U:1020|A:1021|G:123', function() {
            client.end();
            res.writeHead(204, { 'Connection': 'keep-alive' });
            res.end();
        });
    });
};