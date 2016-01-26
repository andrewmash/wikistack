var express = require('express');
var router = express.Router();
var models = require('../models/');
var Page = models.Page;
var User = models.User;

router.get('/', function(request, response) {
	response.redirect('/');
});

router.post('/', function(request, response) {
	var page = new Page({
		title: request.body.title,
		content: request.body.content,
		tags: request.body.tags.split(" ")
		//status: request.body.status.toLowerCase()
	});
	page.save()
	.then(function(newPage){
		response.redirect(newPage.route);
	})
	.then(null, function(error){
		var locals = error;
		console.log(error);
		response.render('error', {error: locals});
	});
});

router.get('/add', function(request, response) {
	response.render('addpage');
});

router.get('/search', function(request, response) {
	var tagsArray = request.query.tags.split(" ");
	Page.findByTag(tagsArray).exec(function(error, pages) {
		if (error) return error;
		console.log(pages);
		response.render('index', {pages: pages});
	});
});

router.get('/:page', function(request, response) {
	Page.findOne({ 'urlTitle': request.params.page }, function (error, page) {
  	if (error) return error;
		response.render('wikipage', {page: page, tags: page.tags.join(" ")});
	});
});



module.exports = router;