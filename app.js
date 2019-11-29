require('dotenv').config();
var express 			= 	require("express");
var app 				= 	express();
var mongoose 			= 	require("mongoose");
var bodyParser    		= 	require("body-parser");
var Harbor 				= 	require("./models/harbors.js");
var methodOverride		=	require("method-override");
var Comment				=	require("./models/comments.js");
var LocalStrategy		=	require("passport-local");
var passport			=	require("passport");
var User				=	require("./models/user.js");
var flash				=	require("connect-flash");


mongoose.connect("mongodb+srv://manwej:tomate@harborbuddy-f8rbx.mongodb.net/harbor_buddy?retryWrites=true&w=majority", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
//app.use(session({ secret: 'session secret key' }));
app.use(methodOverride("_method"));
app.use(flash());


var authRoutes 		= 	require("./routes/index.js");
var harborRoutes 	= 	require("./routes/harbors.js");
var commentRoutes	=	require("./routes/comments.js");


//Passport configuration
app.use(require("express-session")({
	secret: "Rusty is chubby",
	resave: false,
	saveUninitialized: false
}));

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // user.authenticate comes from passport-local-mongoose
passport.serializeUser(User.serializeUser()); // user.authenticate comes from passport-local-mongoose
passport.deserializeUser(User.deserializeUser());// user.authenticate comes from passport-local-mongoose

app.use(function(req,res,next){
	res.locals.currentUser= req.user;
	res.locals.error =req.flash("error");
	res.locals.success =req.flash("success");
	next();
});


// Use of Main Routes
app.use(authRoutes);
app.use(harborRoutes);
app.use(commentRoutes);



app.listen(process.env.PORT || 3000, function(){
	console.log("HB has started");
});