module.exports = function(app, passport, models) {

    var api = require('./api.js')(models);

    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/partials/:name', showClientRequest, function (req, res) {
        var name = req.params.name;
        res.render('partials/' + name);
    });

    app.get('/partials/auth/:name', showClientRequest, function (req, res) {
        var name = req.params.name;
        res.render('partials/auth/' + name);
    });


    app.get('/api/sensores', showClientRequest, api.getSensores);

    app.post('/api/sensores', showClientRequest, api.sensores);


    app.get('/api/stream', showClientRequest, api.stream);

    app.post('/api/publish', showClientRequest, api.publish);

    
    function showClientRequest(req, res, next) {
        var request = {
            REQUEST : {
                HEADERS: req.headers,
                BODY : req.body
            }
        }
        console.log(request)
        return next();
    }
}