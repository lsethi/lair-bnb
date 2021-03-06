LairBnB.Views.Home = Backbone.CompositeView.extend({
	initialize: function(){
		var navView = new LairBnB.Views.HomeNav();
    this.addSubview('#nav-container-home', navView);
	},
	className: 'front-page',

	template: JST['home'],

	events: {
		'submit form.main-form-collection': 'handleSubmit'
	},

	render: function(){
		var content = this.template();
		this.$el.html(content);
		this.initSearch();
  	
  	this.attachSubviews();
  	this.$('[data-toggle="tooltip"]').tooltip();
		return this;
	},

	handleSubmit: function(event){
		event.preventDefault();
		var formContent = $(event.currentTarget).serializeJSON();
		var encodedLocation = urlEncodeLocation(formContent['location']);
		Backbone.history.navigate('/search/' + encodedLocation, {trigger: true} )

	},

	initSearch: function(){
		var input = this.$('#location-search');
  	autocomplete = new google.maps.places.Autocomplete(input[0], {types: ['geocode']});
  	var that = this;
  	google.maps.event.addListener(autocomplete, 'place_changed', function () {
  		var locationObj = autocomplete.getPlace();
  		// that.updateSearchLocation(locationObj);
  	});
	},
});