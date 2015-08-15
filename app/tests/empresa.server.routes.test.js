'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Empresa = mongoose.model('Empresa'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, empresa;

/**
 * Empresa routes tests
 */
describe('Empresa CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Empresa
		user.save(function() {
			empresa = {
				name: 'Empresa Name'
			};

			done();
		});
	});

	it('should be able to save Empresa instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Empresa
				agent.post('/empresas')
					.send(empresa)
					.expect(200)
					.end(function(empresaSaveErr, empresaSaveRes) {
						// Handle Empresa save error
						if (empresaSaveErr) done(empresaSaveErr);

						// Get a list of Empresas
						agent.get('/empresas')
							.end(function(empresasGetErr, empresasGetRes) {
								// Handle Empresa save error
								if (empresasGetErr) done(empresasGetErr);

								// Get Empresas list
								var empresas = empresasGetRes.body;

								// Set assertions
								(empresas[0].user._id).should.equal(userId);
								(empresas[0].name).should.match('Empresa Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Empresa instance if not logged in', function(done) {
		agent.post('/empresas')
			.send(empresa)
			.expect(401)
			.end(function(empresaSaveErr, empresaSaveRes) {
				// Call the assertion callback
				done(empresaSaveErr);
			});
	});

	it('should not be able to save Empresa instance if no name is provided', function(done) {
		// Invalidate name field
		empresa.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Empresa
				agent.post('/empresas')
					.send(empresa)
					.expect(400)
					.end(function(empresaSaveErr, empresaSaveRes) {
						// Set message assertion
						(empresaSaveRes.body.message).should.match('Please fill Empresa name');
						
						// Handle Empresa save error
						done(empresaSaveErr);
					});
			});
	});

	it('should be able to update Empresa instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Empresa
				agent.post('/empresas')
					.send(empresa)
					.expect(200)
					.end(function(empresaSaveErr, empresaSaveRes) {
						// Handle Empresa save error
						if (empresaSaveErr) done(empresaSaveErr);

						// Update Empresa name
						empresa.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Empresa
						agent.put('/empresas/' + empresaSaveRes.body._id)
							.send(empresa)
							.expect(200)
							.end(function(empresaUpdateErr, empresaUpdateRes) {
								// Handle Empresa update error
								if (empresaUpdateErr) done(empresaUpdateErr);

								// Set assertions
								(empresaUpdateRes.body._id).should.equal(empresaSaveRes.body._id);
								(empresaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Empresas if not signed in', function(done) {
		// Create new Empresa model instance
		var empresaObj = new Empresa(empresa);

		// Save the Empresa
		empresaObj.save(function() {
			// Request Empresas
			request(app).get('/empresas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Empresa if not signed in', function(done) {
		// Create new Empresa model instance
		var empresaObj = new Empresa(empresa);

		// Save the Empresa
		empresaObj.save(function() {
			request(app).get('/empresas/' + empresaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', empresa.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Empresa instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Empresa
				agent.post('/empresas')
					.send(empresa)
					.expect(200)
					.end(function(empresaSaveErr, empresaSaveRes) {
						// Handle Empresa save error
						if (empresaSaveErr) done(empresaSaveErr);

						// Delete existing Empresa
						agent.delete('/empresas/' + empresaSaveRes.body._id)
							.send(empresa)
							.expect(200)
							.end(function(empresaDeleteErr, empresaDeleteRes) {
								// Handle Empresa error error
								if (empresaDeleteErr) done(empresaDeleteErr);

								// Set assertions
								(empresaDeleteRes.body._id).should.equal(empresaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Empresa instance if not signed in', function(done) {
		// Set Empresa user 
		empresa.user = user;

		// Create new Empresa model instance
		var empresaObj = new Empresa(empresa);

		// Save the Empresa
		empresaObj.save(function() {
			// Try deleting Empresa
			request(app).delete('/empresas/' + empresaObj._id)
			.expect(401)
			.end(function(empresaDeleteErr, empresaDeleteRes) {
				// Set message assertion
				(empresaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Empresa error error
				done(empresaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Empresa.remove().exec();
		done();
	});
});