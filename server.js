var   express = require('express')
	, app = express()
	, bodyParser = require('body-parser')
	, cors = require('cors')
	, port = 3000
	, passport = require('passport')
	, FamilySearchStrategy = require('passport-familysearch').Strategy;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());

passport.serializeUser(function( user, done ) {
	done(null, user);
});

passport.deserializeUser(function( obj, done ) {
	done(null, obj);
});

passport.use(new FamilySearchStrategy({
	  authorizationURL: 'https://sandbox.familysearch.org/cis-web/oauth2/v3/authorization'
	, tokenURL: 'https://sandbox.familysearch.org/cis-web/oauth2/v3/token'
	, devKey: 'a02j000000BpxDpAAJ'
	, callbackURL: 'http://localhost:3000/auth/callback'
}, function( accessToken, refreshToken, profile, done ) {
	console.log(accessToken);
	return done(null, profile);
}));

app.get('/auth/familysearch', passport.authenticate('familysearch'));

app.get('/auth/callback', passport.authenticate('familysearch', { failureRedirect: '/' }), function( req, res ) {
	console.log(req.body);
	res.redirect('/');
});


app.listen(port, function() {
	console.log('Listening on ' + port);
});