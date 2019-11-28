var express =require("express");
var router = express.Router();
var Harbor = require("../models/harbors.js");
var middleware =require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// INDEX Harbor Route
router.get("/harbors", function(req, res){
	Harbor.find({}, function(err, allharbors){ //call bei mongodb
		if(err){
			//console.log(err);
			console.log("it is fucked 2")
		}else{
			res.render("harbors/index.ejs", {harbors: allharbors, currentUser: req.user});
		}
	})
	
	//display all harbors from database
});

// NEW Harbor Route
router.get("/harbors/new", middleware.isLoggedIn, function(req, res){
	//if logged In display form to make new harbor
	res.render("harbors/new.ejs");
});
//CREATE - add new harbor to DB
router.post("/harbors", middleware.isLoggedIn, function(req, res){
  // get data from form and add to harbor array
  	var name = req.body.name;
  	var image = req.body.image;
  	var price= req.body.price;
	var description =req.body.description;
  	var author = {
      id: req.user._id,
      username: req.user.username
  };
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newHarbor = {name: name, image: image, description: description, author:author, location: location, lat: lat, lng: lng};
    // Create a new harbor and save to DB
    Harbor.create(newHarbor, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to harbors page
            console.log(newlyCreated);
            res.redirect("/harbors");
        }
    });
  });
});

//SHOW Harbor Route
router.get("/harbors/:id", function(req, res){
	Harbor.findById(req.params.id).populate("comments").exec(function(err, foundHarbor){
		if(err){
			console.log(err);
		}else{
			res.render("harbors/show.ejs", {harbors: foundHarbor});
		}
	});
	
});

//EDIT Harbor Route
router.get("/harbors/:id/edit", middleware.checkHarborOwnership, function(req, res){
	Harbor.findById(req.params.id, function (err, foundHarbor){
		res.render("./harbors/edit.ejs", {harbors: foundHarbor});
});
});

//Update Route
router.put("/harbors/:id", middleware.checkHarborOwnership, function(req, res){
	Harbor.findByIdAndUpdate(req.params.id, req.body.harbors, function(err, updatedHarbor){
		if(err){
			res.redirect("/harbors");
		}else{
			res.redirect("/harbors/" + req.params.id);
		}
	});
});
// UPDATE ROUTE
router.put("/harbors/:id", middleware.checkHarborOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.harbors.lat = data[0].latitude;
    req.body.harbors.lng = data[0].longitude;
    req.body.harbors.location = data[0].formattedAddress;

    Harbor.findByIdAndUpdate(req.params.id, req.body.harbors, function(err, updatedHarbor){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/harbors/" + harbors._id);
        }
    });
  });
});


//DELETE Route
router.delete("/harbors/:id", middleware.isLoggedIn, function(req, res){
	Harbor.findByIdAndDelete(req.params.id, function(err){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/harbors");
		}
	});
});

module.exports = router;