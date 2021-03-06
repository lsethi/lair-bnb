var urlEncodeLocation = function(location){
	return location.replace(/[-]/g, '~').replace(/[ ,\/]/g, '-').replace(/[.]/g, '%252E');
}

var decodeLocationUrl = function(query){
	return query.replace(/--/g, ', ').replace(/-/g, ' ');
}

function prepareSlider (view) {
	view.$("#slider").noUiSlider({
		start: [10, 1000],
		connect: true,
		range: {
			'min': 10,
			'max': 1000
		},
		step: 10,
		format: wNumb({
			decimals: 0
		})
	});

	view.$('#slider').Link('lower').to(view.$('#min-price'));
	view.$('#slider').Link('upper').to(view.$('#max-price'));

}

function initDatePicker(view, dates) {
	function restrictDates(date){
		if(!dates){
			dates = [];
		}
		// var array = ["2014-12-14","2014-12-15","2014-12-16"]; this is the correct format.
		var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
    return [ dates.indexOf(string) == -1 ]
  };

  view.$( "#check-in-date" ).datepicker({
    defaultDate: 0,
    changeMonth: true,
    numberOfMonths: 1,
    minDate: 0,
    beforeShowDay: restrictDates,
    onClose: function( selectedDate ) {
      view.$( "#check-out-date" ).datepicker( "option", "minDate", selectedDate );
      if(!view.$('#check-out-date').val() && view.$('#check-in-date').val()){
      	view.$('#check-out-date').focus();
      }
    }
  });
  view.$( "#check-out-date" ).datepicker({
    defaultDate: "+1D",
    changeMonth: true,
    numberOfMonths: 1,
    beforeShowDay: restrictDates,
    onClose: function( selectedDate ) {
      view.$( "#check-in-date" ).datepicker( "option", "maxDate", selectedDate );
      if(!view.$('#check-in-date').val() && view.$('#check-out-date').val()){
      	view.$('#check-in-date').focus();
      }
    }
  });
};

function fillFields(params, view){
	var priceArr = [null, null];
	$.each(params, function(key, val){
		if(key === 'price_min'){
			priceArr[0] = val;
		}
		else if(key === 'price_max'){
			priceArr[1] = val;
		}
		else if(key === 'lair_type[]'){
		view.$("[value=" + val + "]").prop('checked', true);
		}
		else{
			view.$("[name=" + key + "]").val(val);
		}
	});
	view.$('#slider').val(priceArr);
};

function initImageCarousel(view, size){
	// size is 'mini' or 'main'
	view.$('.lazy').slick({
    // lazyLoad: 'ondemand',
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: '<button type="button" class="left-' + size + ' glyphicon glyphicon-chevron-left"></button>',
    nextArrow: '<button type="button" class="right-' + size + ' glyphicon glyphicon-chevron-right"></button>'
  });
};

function initTripsCarousel(view, containerSelector){
	view.$(containerSelector).slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    onInit: this.show,
    prevArrow: '<button type="button" class="left-trip-arrow glyphicon glyphicon-chevron-left"></button>',
    nextArrow: '<button type="button" class="right-trip-arrow glyphicon glyphicon-chevron-right"></button>'
  });
}

function showAlert(userOptions){
	// alertClasses are 'alert-success', 'alert-info', 'alert-warning', and 'alert-danger'
	var defaults = {
		alertClass: 'alert-warning',
		alertMessage: 'Something went wrong',
		alertLocation: '#alerts-container'
	};
	var options = jQuery.extend({}, defaults, userOptions);
	var $alertsContainer = $(options['alertLocation']);
	var $content = $("<div class='alert " + options['alertClass'] + 
		"' role='alert' style='display:none;'>" + options['alertMessage'] + "</div>");

	$content.hide().appendTo($alertsContainer).slideDown();
	setTimeout(function() {
	  $content.slideUp(600, function(){
	  	$content.remove();
	  });
	}, 3000);
};