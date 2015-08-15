'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Garcom = mongoose.model('Garcom'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, garcom;

/**
 * Garcom routes tests
 */
describe('Garcom CRUD tests', function() {
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

		// Save a user to the test db and create new Garcom
		user.save(function() {
			garcom = {
				name: 'Garcom Name'
			};

			done();
		});
	});

	it('should be able to save Garcom instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Garcom
				agent.post('/garcoms')
					.send(garcom)
					.expect(200)
					.end(function(garcomSaveErr, garcomSaveRes) {
						// Handle Garcom save error
						if (garcomSaveErr) done(garcomSaveErr);

						// Get a list of Garcoms
						agent.get('/garcoms')
							.end(function(garcomsGetErr, garcomsGetRes) {
								// Handle Garcom save error
								if (garcomsGetErr) done(garcomsGetErr);

								// Get Garcoms list
								var garcoms = garcomsGetRes.body;

								// Set assertions
								(garcoms[0].user._id).should.equal(userId);
								(garcoms[0].name).should.match('Garcom Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Garcom instance if not logged in', function(done) {
		agent.post('/garcoms')
			.send(garcom)
			.expect(401)
			.end(function(garcomSaveErr, garcomSaveRes) {
				// Call the assertion callback
				done(garcomSaveErr);
			});
	});

	it('should not be able to save Garcom instance if no name is provided', function(done) {
		// Invalidate name field
		garcom.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Garcom
				agent.post('/garcoms')
					.send(garcom)
					.expect(400)
					.end(function(garcomSaveErr, garcomSaveRes) {
						// Set message assertion
						(garcomSaveRes.body.message).should.match('Please fill Garcom name');
						
						// Handle Garcom save error
						done(garcomSaveErr);
					});
			});
	});

	it('should be able to update Garcom instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Garcom
				agent.post('/garcoms')
					.send(garcom)
					.expect(200)
					.end(function(garcomSaveErr, garcomSaveRes) {
						// Handle Garcom save error
						if (garcomSaveErr) done(garcomSaveErr);

						// Update Garcom name
						garcom.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Garcom
						agent.put('/garcoms/' + garcomSaveRes.body._id)
							.send(garcom)
							.expect(200)
							.end(function(garcomUpdateErr, garcomUpdateRes) {
								// Handle Garcom update error
								if (garcomUpdateErr) done(garcomUpdateErr);

								// Set assertions
								(garcomUpdateRes.body._id).should.equal(garcomSaveRes.body._id);
								(garcomUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Garcoms if not signed in', function(done) {
		// Create new Garcom model instance
		var garcomObj = new Garcom(garcom);

		// Save the Garcom
		garcomObj.save(function() {
			// Request Garcoms
			request(app).get('/garcoms')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Garcom if not signed in', function(done) {
		// Create new Garcom model instance
		var garcomObj = new Garcom(garcom);

		// Save the Garcom
		garcomObj.save(function() {
			request(app).get('/garcoms/' + garcomObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', garcom.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Garcom instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Garcom
				agent.post('/garcoms')
					.send(garcom)
					.expect(200)
					.end(function(garcomSaveErr, garcomSaveRes) {
						// Handle Garcom save error
						if (garcomSaveErr) done(garcomSaveErr);

						// Delete existing Garcom
						agent.delete('/garcoms/' + garcomSaveRes.body._id)
							.send(garcom)
							.expect(200)
							.end(function(garcomDeleteErr, garcomDeleteRes) {
								// Handle Garcom error error
								if (garcomDeleteErr) done(garcomDeleteErr);

								// Set assertions
								(garcomDeleteRes.body._id).should.equal(garcomSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Garcom instance if not signed in', function(done) {
		// Set Garcom user 
		garcom.user = user;

		// Create new Garcom model instance
		var garcomObj = new Garcom(garcom);

		// Save the Garcom
		garcomObj.save(function() {
			// Try deleting Garcom
			request(app).delete('/garcoms/' + garcomObj._id)
			.expect(401)
			.end(function(garcomDeleteErr, garcomDeleteRes) {
				// Set message assertion
				(garcomDeleteRes.body.message).should.match('User is not logged in');

				// Handle Garcom error error
				done(garcomDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Garcom.remove().exec();
		done();
	});
});