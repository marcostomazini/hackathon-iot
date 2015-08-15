module.exports = function(models){

    var Sensor = models.sensor;

    var _ = require('underscore');

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
        }
    }

}



