Websites = new Mongo.Collection("websites");

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('website_list', {
    to:"main"
  });
});

Router.route('/details/:_id', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('details', {
    to:"main", 
    data:function(){
      return Websites.findOne({_id:this.params._id});
    }
  });
});


if (Meteor.isClient) {

	Meteor.subscribe("websites");

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
	});


	/////
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({}, {sort:{votes:-1}});
		}
	});


	/////
	// template events 
	/////

	Template.buttons.events({
		"click .js-upvote":function(event){

			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			
			Websites.update(this._id, {$inc: {votes:+1}});

			return false;// prevent the button from reloading the page
		},
		"click .js-downvote":function(event){

			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			Websites.update(this._id, {$inc: {votes:-1}});

			return false;// prevent the button from reloading the page
		},
	});

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){
			var title, description;

			title = event.target.title.value;
			description = event.target.description.value;
			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			console.log("The url they entered is: "+url);
			
			if (Meteor.user()){
	      	Websites.insert({
	       	url:url, 
	        title:title, 
	        description:description,
	        createdOn: moment().format('DD-M-YY, HH:mm:ss'),
	        votes: 0
      	});
    }
    $("#website_form").modal('hide');
		return false;// stop the form submit from reloading the page
		},
	});

	Template.comments.events({
		"submit .js-save-website-comments":function(event){

			var comments = event.target.comments.value;
			console.log("O comentario foi " + comments);

	    Websites.update(this._id, {$set: {comments}});

	  	$("#comments").modal('hide');
			return false;// stop the form submit from reloading the page
		},
	});
}


if (Meteor.isServer) {

	Meteor.publish('websites', function() {
    return Websites.find();
  });
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Viajantes.com", 
    		url:"http://www.viajantes.com/", 
    		description:"Site for travel destiny search.", 
    		createdOn:moment().format('DD-M-YY, HH:mm:ss'),
    		votes: 0
    	});
    	 Websites.insert({
    		title:"Turista Profissional", 
    		url:"http://www.turistaprofissional.com", 
    		description:"Website about travel and tips.", 
    		createdOn:moment().format('DD-M-YY, HH:mm:ss'),
    		votes: 0
    	});
    	 Websites.insert({
    		title:"Nomades Digitais", 
    		url:"http://nomadesdigitais.com", 
    		description:"Website from a couple that travel and work digitally.", 
    		createdOn:moment().format('DD-M-YY, HH:mm:ss'),
    		votes: 0
    	});
    	Websites.insert({
    		title:"Google", 
    		url:"http://www.google.com", 
    		description:"Popular search engine.", 
    		createdOn:moment().format('DD-M-YY, HH:mm:ss'),
    		votes: 0
    	});
    }
  });
}
