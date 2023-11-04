$(document).ready(function() {
  const amenities_checked = {};

  $('.amenities div ul li input[type="checkbox"]').on('change', function(event) {
    const amenity_id = $(this).data("id");
    const amenity_name = $(this).data('name');
    console.log("Data attributes:", $(this).data());
    if ($(this).is(':checked')) { 
      amenities_checked[amenity_id] = amenity_name;
    } else {
      delete amenities_checked[amenity_id];
    }

    const selected_amenities = $('.amenities h4');
    if ( Object.values(amenities_checked).length > 0 ) {
      selected_amenities.text(Object.values(amenities_checked).join(', '));
    }
  });
});
