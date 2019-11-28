var mongoose =require("mongoose");


var harborSchema = new mongoose.Schema({
	name: String,
	image: String, 
	description: String,
	price: Number,
   	location: String,
   	lat: Number,
   	lng: Number,
	createdAt: { type: Date, default: Date.now },
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
	}
});

var Harbor = mongoose.model("Harb", harborSchema);

module.exports = mongoose.model("Harbor", harborSchema);