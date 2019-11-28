var Harbor = require("../models/harbors.js");
var Comment = require("../models/comments.js");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkHarborOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Harbor.findById(req.params.id, function(err, foundHarbor){
           if(err){
			   req.flash("error", "Campground not found")
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundHarbor.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error", "You do not have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("error", "You don't have permission to do that")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObj;