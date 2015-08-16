'use strict';

module.exports = {
	//db: 'mongodb://arquitetaweb:arqw3b@ds043082.mongolab.com:43082/heroku_app37384508',
	db: 'mongodb://localhost/iot',
	app: {
		title: 'Sensorizacao - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '907569132639066',
		clientSecret: process.env.FACEBOOK_SECRET || '2b239864494257d74bba60509ad7047e',
		callbackURL: '/auth/facebook/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '64358772177-lqtq513bcp3kuve4rqn91gvqdrrbefel.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'LWyL8-_RDOsyfm9BeMOI3BDj',
		callbackURL: '/auth/google/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
