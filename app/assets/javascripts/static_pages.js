
// // Google autocomplete 
// function initialize() {
// 	var input = /** @type {HTMLInputElement} */(
//       document.getElementById('location-search'));
//   var autocomplete = new google.maps.places.Autocomplete(input);
//   autocomplete.setTypes(['geocode']);
//   var place = autocomplete.getPlace();
//   var address = '';

//   google.maps.event.addListener(autocomplete, 'place_changed', function () {
//         place = autocomplete.getPlace();
//         if (place.address_components) {
// 			    address = [
// 			      (place.address_components[0] && place.address_components[0].short_name || ''),
// 			      (place.address_components[1] && place.address_components[1].short_name || ''),
// 			      (place.address_components[2] && place.address_components[2].short_name || '')
// 			    ].join(' ');
// 			  }
//         console.log(place);
//     });
// };
// window.onload = function(){ initialize() }

// $(function() {
//   $('form').submit(function(event) {
//   	event.preventDefault()
//     console.log('Input 1: ' + $('input[name="location"]').val()); // etc.
//   });
// });
var urlEncodeLocation = function(location){
	return location.replace(/[-]/g, '~').replace(/[ ,\/]/g, '-').replace(/[.]/g, '%252E');
}

var decodeLocationUrl = function(query){
	return query.replace(/--/g, ', ').replace(/-/g, ' ');
}