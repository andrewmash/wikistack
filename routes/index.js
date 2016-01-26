var express = require('express');
var router = express.Router();
var models = require('../models/');
var Page = models.Page;
var User = models.User;


router.get('/', function(request, response) {
	Page.find({},function(error, pages){
		if (error) return error;
		response.render('index', {pages: pages});
	});
});

module.exports = router;