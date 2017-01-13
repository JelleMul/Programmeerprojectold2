// Jelle Mul
// 11402148
var timedata =  [{time: "30-07 00:00", categories:{}},
                {time: "30-07 06:00", categories:{}},
                {time: "30-07 12:00", categories:{}},
                {time: "30-07 18:00", categories:{}},
                {time: "31-07 00:00", categories:{}},
                {time: "31-07 06:00", categories:{}},
                {time: "31-07 12:00", categories:{}},
                {time: "31-07 18:00", categories:{}}]

var map = new google.maps.Map(d3.select("#map").node(), {
  zoom: 14,
  zoomcontrol: true,
  center: new google.maps.LatLng(52.373093, 4.897353),
  mapTypeId: google.maps.MapTypeId.TERRAIN
});

d3.json("../Data/transactions-of-3-random-days.json", function(error, data) {
  if (error) throw error;
  d3.json("../Data/archetypes-of-3-random-days.json", function(error, data2) {
    if (error) throw error;
    timeindex = 0
    for (i = 0; i < data.length; i++) {
      for (j = new Date("2011-07-30T06:00:00.000Z"), counter = 0; j < new Date("2011-08-01T00:00:00.000Z"); j.setHours(j.getHours() + 6)) {
        if (new Date(data[i].delivery.start) < j) {
          timeindex = counter
          break;
        }
        counter++
      }
      for (j = 0; j < data2.length; j++){
        if (data[i].productArchetype.id == data2[j].id) {
          for (k = 0; k < data2[j].categories.length; k++) {
            categorie = data2[j].categories[k]
            if (categorie in timedata[0].categories) {
              timedata[timeindex].categories[categorie] += 1
            } else {
            timedata[timeindex].categories[categorie] = 1
            }
          };
        }
      }
    }

    // compute total for each state.
    fData.forEach(function(d){d.total = sum(d.categories)});

    var overlay = new google.maps.OverlayView();

    // Add the container when the overlay is added to the map.
    overlay.onAdd = function() {
      var layer = d3.select(this.getPanes().overlayLayer).append("div")
          .attr("class", "stations");

      // Draw each marker as a separate SVG element.
      // We could use a single SVG, but what size would it have?
      overlay.draw = function() {
        var projection = this.getProjection(),
            padding = 10;
      };
    };
    // Bind our overlay to the map…
    overlay.setMap(map);
  });
});
