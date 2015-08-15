module.exports = function(connection) {

    var Sensor = require('./sensor')(connection);

    return {
        sensor: Sensor
    }
}