var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongod connection error:'));

var Schema = mongoose.Schema;

var pageSchema = new Schema({
	title: {type: String, required: true},
	urlTitle: {type: String, required: true},
	content: {type: String, required: true},
	date: { type: Date, default: Date.now }, 
	tags: { type: [String] },
	status: {type: String, enum: ['open','closed']}, //true === open, false === close
	author: {type: Schema.Types.ObjectId, ref: 'User'}
});



pageSchema.pre('validate', function(next) {
  if (!this.urlTitle) this.urlTitle = urlTitleMaker(this.title);
  next();
});

pageSchema.virtual('route').get(function(){
    return '/wiki/' + this.urlTitle;
});

var userSchema = new Schema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true}
});



var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

Page.findByTag = function(tagsArray) {
	return Page.find({
		tags: {$in: tagsArray}
	});
};

module.exports = {
	Page: Page,
	User: User
};

function urlTitleMaker (title){
	title = title || "";
	if (title === "") {
			for (var i = 0; i < Math.ceil(Math.random() * 20); i++) {
			title += String.fromCharCode((Math.floor(Math.random() * 128)));
		}
	}
	title = title.replace(" ", "_");
	title = title.replace(/\W/g, "_");
	return title;
}