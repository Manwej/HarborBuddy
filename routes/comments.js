var express 	=	require("express");
var router 		= 	express.Router({mergeParams: true});
var Harbor 		= 	require("../models/harbors.js");
var Comment		= 	require("../models/comments.js");
var middleware 	=	require("../middleware");

// INDEX Comment Route not neccessary
// NEW Comment Route
router.get("/harbors/:id/comments/new", middleware.isLoggedIn, function(req, res){
	Harbor.findById(req.params.id, function(err, harbor){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new.ejs", {harbors: harbor});
			
		}
	});
});
//CREATE Comment Route
router.post("/harbors/:id/comments", middleware.isLoggedIn, function(req, res){
	Harbor.findById(req.params.id, function(err, harbor){
		if (err){
			console.log(err);
			res.redirect("/harbors");
		}else{
			Comment.create(req.body.comment, function (err, comment){
				if(err){
					console.log(err);
					req.flash("error", "Something went wrong");
				}else{
					comment.author.id= req.user._id;
					comment.author.username= req.user.username;
					comment.save();
					harbor.comments.push(comment);
					harbor.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/harbors/" + harbor._id);
				}
			});
		}
	});
});
// Comments edit route
router.get("/harbors/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit.ejs", {harbors_id: req.params.id, comment: foundComment})
		}
	});
});
// Comments Update Route
router.put("/harbors/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/harbors/" + req.params.id)
		}
	})
})

// DESTROY Comment Route
router.delete("/harbors/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
 	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment deleted");
			res.redirect("/harbors/" +req.params.id);
		}
	});
});
module.exports = router;