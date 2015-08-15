module.exports = function(models){

    var Sensor = models.sensor;

    var _ = require('underscore');

    var mqtt = require('mqtt'), url = require('url');    
    // Parse 
    var mqtt_url = url.parse(process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883');
    var auth = (mqtt_url.auth || ':').split(':');

    // Create a client connection
    var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
      username: auth[0],
      password: auth[1] 
    });    

    return {        

        getSensores: function(req,res)
        {
            Sensor.find(function(err,sensores){
                res.json({sensores: sensores });
            })
        },

        sensores:function(req,res)
        {
            var sensor = req.body;
            
            var novoDado = new Sensor({ nome: sensor.nome, valor: sensor.valor})
            novoDado.save(function (err, sensor) {
                if (err){
                    res.send(500, {'message': err});
                }

                if (sensor.valor == "1")
                    res.json(1);
                else
                    res.json(0);
            });            
        },
        
        stream: function(req,res)
        {
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
        },

        publish: function(req,res)
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
        },
    }

}



