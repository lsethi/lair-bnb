LairBnB.Views.Main = Backbone.CompositeView.extend({
	initialize: function(options){
    var filters = this.parseParams(options.params);
    var decodedLocation = undefined;
    if(options.location){
      decodedLocation = decodeLocationUrl(options.location);
    } 
    this.collectionFilterParams = $.extend({}, {location: decodedLocation}, filters);
    this.router = options.router;

		var navView = new LairBnB.Views.Nav({
      locationField: decodedLocation
    });
    this.addSubview('#nav-container', navView);

		var mapView = new LairBnB.Views.Map();
		this.addSubview('#map-container', mapView);

		var sidebarView = new LairBnB.Views.Sidebar({
      params: filters
    });
		this.addSubview('#sidebar-container', sidebarView);
	},

  events: {
    'change .filter-input-item': 'handleUpdate',
    'change input.date-filter': 'handleUpdate',
    'change input#location-search': 'handleUpdate',
    'change #slider': 'handleUpdate',
    'change #guests': 'handleUpdate',
    'click .pagination': 'handleUpdate'
  },

  template: JST['main'],

  id: 'main-content',

  render: function(){
    var content = this.template({
      query: this.query
    });
    this.$el.html(content);
    this.attachSubviews();
    this.updateCollection();
    return this;
  },

  handleUpdate: function(event){
    event.preventDefault();
    var $field = $(event.currentTarget);
    // if it's a date and either but not both are empty, ignore it
    var checkIn = $('#check-in-date');
    var checkOut = $('#check-out-date');
    if($field.attr('class').indexOf('date-filter') >= 0 && 
      ((!checkIn.val() || !checkOut.val()) && !(!checkIn.val() && !checkOut.val()))){
      return;
    }
    var inputHash = this.inputParser($field);
    this.updateViewVariables(inputHash);
    this.updateURI();
    this.updateCollection();
  },

  inputParser: function($field){
    // inputs: location, lair_type, price_range, checkin, checkout, guests, page
    var key = $field.attr('name');
    var output = {};

    if(key === 'price_range'){
      var pricesArr = $field.val();
      output['price_min'] = parseInt(pricesArr[0], 10);
      output['price_max'] = parseInt(pricesArr[1], 10);

    } else if(key === 'lair_type'){
     var val = $("[name='lair_type']:checked").map(function(){ 
        return $(this).val()
      }).get(); // array
      output[key] = val;

    } else if(key === 'pagination'){
      var currentPage = parseInt(this.collectionFilterParams['page'], 10) || 1;
      var val = $field.val();
      var lairsSeen = ((currentPage - 1) * LairBnB.lairs.per_page) + LairBnB.lairs.length
      if(val === 'prev' && currentPage > 1){
        output['page'] = currentPage - 1;
      } else if (val === 'next' && (lairsSeen < LairBnB.lairs.total_entries)) {
        output['page'] = currentPage + 1;
      };

    } else if(key === 'check_in_date' || key === 'check_out_date'){
      output['check_in_date'] = $('#check-in-date').val();
      output['check_out_date'] = $('#check-out-date').val();
    } else if (!!key) {
      output[key] = $field.val();
    };

    if(key !== 'pagination'){
      output['page'] = 1;
    };
    
    return output; 
  },

  updateCollection: function(){
    var collectionParams = this.collectionFilterParams;
    LairBnB.lairs.fetch({
      data: {
        search: collectionParams
      }
    })
    LairBnB.lairs.currentPage = this.collectionFilterParams['page'];
  },

  parseParams: function(params){
    var output = {};
    // check if params is not null, undefined, or empty
    if(!!params){
      paramsArr = params.split('&');
      for(var i = 0; i < paramsArr.length ; i++){
        var urlDecodedParam = decodeURIComponent(paramsArr[i]);
        var paramPair = urlDecodedParam.split('=');
        // output[paramPair[0]] = paramPair[1];
        var key = paramPair[0];
        var val = paramPair[1];
        if(key === 'lair_type[]'){
          if(!!output['lair_type']){
            output['lair_type'].push(val);
          }else{
            output['lair_type'] = [val];
          }
        }else{
          output[key] = val;
        }
      }
    }
    return output;
  },

  updateViewVariables: function(inputObj){
    for(i in inputObj){
      if(!!inputObj[i]){ 
        this.collectionFilterParams[i] = inputObj[i];
      } else {
        delete this.collectionFilterParams[i];
      }
    }
  },

  updateURI: function(){
    var locationStr;
    if(!!this.collectionFilterParams['location']){
      locationStr = urlEncodeLocation(this.collectionFilterParams['location']);
    } 
    // append all params except location
    var tempParams = jQuery.extend({}, this.collectionFilterParams);
    delete tempParams['location'];
    var filterParamsStr = $.param(tempParams); 
    if(!!filterParamsStr){
      filterParamsStr = '?' + filterParamsStr;
    };
    if(!!locationStr){
      this.router.navigate('/search/' + locationStr + filterParamsStr, { trigger: false });
    } else {
      this.router.navigate('/search/' + filterParamsStr, { trigger: false });
    }    
  }
});