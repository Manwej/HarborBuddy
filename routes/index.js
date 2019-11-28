var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Harbor = require("../models/harbors");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

//ROOT Route
router.get("/", function(req, res){
	res.render("landing.ejs");
});

//Show Register Form
router.get("/register", function(req,res){
	res.render("register.ejs");
});
// handle Signup Logic
router.post("/register", function(req, res){
	var newUser= new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
    	console.log(err);
		req.flash("error", err.message);
    	return res.render("register.ejs");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to HarborBuddy " + user.username);
			res.redirect("/harbors");
		});
	});
});
// Show Login Form
router.get("/login", function(req, res){
	res.render("login.ejs");
});
//handling Login logic
router.post("/login", passport.authenticate("local", 
		{
		successRedirect:"/harbors",
		failureRedirect:"/login",
		failureFlash: true
		}), function(req,res){
});
//Logout Route
router.get("/logout", function (req,res){
	req.logout();
	req.flash("success", "You are logged out successfully!")
	res.redirect("/harbors");
});
// Impressum und Datenschutz
router.get("/impressum", function(req, res){
	res.render("impressum.ejs");
});
router.get("/Datenschutz", function(req, res){
	res.render("datenschutz.ejs");
})

module.exports = router;