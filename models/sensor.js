var mongoose = require('mongoose');

module.exports = function(connection) {

    var Schema = mongoose.Schema;

    var sensorSchema = new Schema({
        nome: String,
        valor: String
    });

    var Sensor = connection.model('Sensor', sensorSchema);

    return Sensor;
}