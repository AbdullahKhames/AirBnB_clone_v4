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
  const status_view = $('#api_status');    
  status_view.removeClass('available');
  $.get("http://localhost:5001/api/v1/status/", function (data) {
    const status = data.status;  
    if (status === 'OK') {
      status_view.addClass('available');
    } else {
      status_view.removeClass('available');
    }
  });
  $.ajax({
    type: "POST",
    url: "http://localhost:5001/api/v1/places_search/",
    data: JSON.stringify({}),
    headers: {
      "Content-Type": "application/json"
    },
    success: function(data) {
      // Loop through the places data and fetch user data for each place
      const promises = data.map(function (place) {
        return new Promise(function (resolve) {
          $.get(`http://localhost:5001/api/v1/users/${place.user_id}`, function (user) {
            place.user = user;
            resolve();
          });
        });
      });
      const places_section = $(' section.places ')
      Promise.all(promises).then(function () {
      for (const place of data) {
        places_section.append(`
        <article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
          </div>
          <div class="user">
            <b>Owner:</b> ${place.user.first_name} ${place.user.last_name}
          </div>
          <div class="description">
            ${place.description}
          </div>
        </article>
      `);
      }
    });
    },
    error: function(xhr, status, error) {
      console.log("Error:", status, error);
    }
  });
});
