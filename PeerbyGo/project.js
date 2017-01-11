// Jelle Mul
// 11402148

var map = new google.maps.Map(d3.select("#map").node(), {
  zoom: 14,
  zoomcontrol: true,
  center: new google.maps.LatLng(52.373093, 4.897353),
  mapTypeId: google.maps.MapTypeId.TERRAIN
});

d3.json("../Data/transactions-of-3-random-days.json", function(error, data) {
  if (error) throw error;
  console.log(data)

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
  console.log("hello")
  // Bind our overlay to the map…
  overlay.setMap(map);
});
