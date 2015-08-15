 To start application :
	npm install // to install node modules dependencies
	bower install // to install bower dependencies
	node server.js

 To minify application:
	node_modules/requirejs/bin/r.js -o tools/app.build.js

## Directory Layout
    
    server.js              --> app config
    package.json        --> for npm
    config/             --> contains mongoDB and passport configuration
        database.js
        passport.js
    models/             --> contains mongoDB simple user Schema
        users.js
        person.js
        thing.js
        models.js
    public/             --> all of the files to be used in on the client side
      css/              --> css files
        app.css         --> default stylesheet
      js/               --> javascript files
        app.js          --> declare top-level app module
        controllers.js  --> application controllers
        directives.js   --> custom angular directives
        filters.js      --> custom angular filters
        services.js     --> custom angular services
        bower_components/            --> angular and 3rd party JavaScript libraries
          angular/
          angular-local-storage/
          angular-route/
          bootstrap/
          cryptojslib/
          jquery/
          noty/
    app/
      api.js            --> api definitions
      routes.js          --> route for serving HTML pages, JSON and partials
    views/
      index.html        --> main page for app
      partials/         --> angular view partials (partial jade templates)
        header.html
        nav.html
        register.html
        login.html
      auth/
        home.html
        person.html
        thing.html
