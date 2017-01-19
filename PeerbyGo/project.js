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
  zoom: 9,
  zoomcontrol: true,
  center: new google.maps.LatLng(52.161555, 4.859314),
  mapTypeId: google.maps.MapTypeId.TERRAIN,
  scrollwheel: false
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
            categorie = data2[j].categories[k].split(' ').join('_')
            categorie = categorie.split('-').join('_')
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

    total_transactions = []

    function sum( obj ) {
      var sum = 0;
      for( var el in obj ) {
        if( obj.hasOwnProperty( el ) ) {
          sum += parseFloat( obj[el] );
        }
      }
      return sum;
    }

    // function check(obj) {
    //   if
    // }

    for (i = 0; i < timedata.length; i++) {
      total_transactions[i] = sum(timedata[i].categories)
    }
    function dashboard(id, fData){
      var barColor = 'lightgreen';
      function segColor(c){ return {Christmas:"#a6cee3", Cooking:"#1f78b4", Cycling:"#b2df8a", Electronics:"#33a02c", Entertainment:"#33a02c", Garden: "#fb9a99", Home_improvement:"#e31a1c", Ironwork:"#e31a1c", Kitchen:"#fdbf6f", Moving:"#ff7f00", Office:"#cab2d6", Party:"#6a3d9a", Photo:"#6a3d9a", TV:"#ffff99", Video:"#b15928", Woodwork:"#a6cee3", boormachine:"#a6cee3", festival:"#1f78b4", game_night:"#b2df8a", going_outside:"#33a02c", koningsdag:"#fb9a99", oktoberfest:"#e31a1c", partytent:"#fdbf6f", sinterklaas:"#ff7f00"}[c]; }

      // compute total for each state.
      fData.forEach(function(d){d.total = sum(d.categories)});
      // function to handle histogram.
      function histoGram(fD){
          var hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
          hGDim.w = 550 - hGDim.l - hGDim.r,
          hGDim.h = 300 - hGDim.t - hGDim.b;

          //create svg for histogram.
          var hGsvg = d3.select(id).append("svg")
              .attr("width", hGDim.w + hGDim.l + hGDim.r)
              .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
              .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

          // create function for x-axis mapping.
          var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                  .domain(fD.map(function(d) { return d[0]; }));

          // Add x-axis to the histogram svg.
          hGsvg.append("g").attr("class", "x axis")
              .attr("transform", "translate(0," + hGDim.h + ")")
              .call(d3.svg.axis().scale(x).orient("bottom"));

          // Create function for y-axis map.
          var y = d3.scale.linear().range([hGDim.h, 0])
                  .domain([0, d3.max(fD, function(d) { return d[1]; })]);

          // Create bars for histogram to contain rectangles and freq labels.
          var bars = hGsvg.selectAll(".bar").data(fD).enter()
                  .append("g").attr("class", "bar");

          //create the rectangles.
          bars.append("rect")
              .attr("x", function(d) { return x(d[0]); })
              .attr("y", function(d) { return y(d[1]); })
              .attr("width", x.rangeBand())
              .attr("height", function(d) { return hGDim.h - y(d[1]); })
              .attr('fill',barColor)
              .on("mouseover",mouseover)// mouseover is defined below.
              .on("mouseout",mouseout);// mouseout is defined below.

          //Create the frequency labels above the rectangles.
          bars.append("text").text(function(d){ return d3.format(",")(d[1])})
              .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
              .attr("y", function(d) { return y(d[1])-5; })
              .attr("text-anchor", "middle");

          function mouseover(d){  // utility function to be called on mouseover.
              // filter for selected state.
              var st = fData.filter(function(s){ return s.time == d[0];})[0]
              typeList = [];
              for (var key in st.categories) {
                if (typeList.indexOf(key) == -1) {
                  typeList.push(key)
                };
              };
              typeList.sort();

              var nD = typeList.map(function(d){
                if (st.categories[d] != 0) {
                  return {type:d, freq: st.categories[d]}
                }
              });

              for (i = 0; i < nD.length; i++) {
                if (nD[i] == undefined) {
                  nD.splice(i, 1);
                  i--;
                }
              }

              // call update functions of pie-chart and legend.
              pC.update(nD);
              leg.update(nD);
          }

          function mouseout(d){    // utility function to be called on mouseout.
              // reset the pie-chart and legend.
              pC.update(tF);
              leg.update(tF);
          }

          // create function to update the bars. This will be used by pie-chart.
          hG.update = function(nD, color){
              // update the domain of the y-axis map to reflect change in frequencies.
              y.domain([0, d3.max(nD, function(d) { return d[1]; })]);

              // Attach the new data to the bars.
              var bars = hGsvg.selectAll(".bar").data(nD);

              // transition the height and color of rectangles.
              bars.select("rect").transition().duration(500)
                  .attr("y", function(d) {return y(d[1]); })
                  .attr("height", function(d) { return hGDim.h - y(d[1]); })
                  .attr("fill", color);

              // transition the frequency labels location and change value.
              bars.select("text").transition().duration(500)
                  .text(function(d){ return d3.format(",")(d[1])})
                  .attr("y", function(d) {return y(d[1])-5; });
          }
          return hG;
      }

      // function to handle pieChart.
      function pieChart(pD){
          var pC ={},    pieDim ={w:300, h: 300};
          pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

          // create svg for pie chart.
          var piesvg = d3.select(id).append("svg")
              .attr("id", "piechart")
              .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
              .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");

          // create function to draw the arcs of the pie slices.
          var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

          // create a function to compute the pie slice angles.
          var pie = d3.layout.pie().sort(null).value(function(d) { return d.freq; });

          // Draw the pie slices.
          piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
              .each(function(d) { this._current = d; })
              .style("fill", function(d) { return segColor(d.data.type); })
              .on("mouseover",mouseover).on("mouseout",mouseout);

          // create function to update pie-chart. This will be used by histogram.
          pC.update = function(nD){
            var Parent = document.getElementById("piechart");
            if (Parent != null) {
              while(Parent.hasChildNodes())
              {
               Parent.removeChild(Parent.firstChild);
              }
            };

            var piesvg = d3.select('#piechart')
                .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
                .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");

            // Draw the pie slices.
            piesvg.selectAll("path").data(pie(nD)).enter().append("path").attr("d", arc)
                .each(function(d) { this._current = d; })
                .style("fill", function(d) { return segColor(d.data.type); })
                .on("mouseover",mouseover).on("mouseout",mouseout)
          }

          // Utility function to be called on mouseover a pie slice.
          function mouseover(d){
              // call the update function of histogram with new data.
              hG.update(fData.map(function(v){
                if (v.categories[d.data.type] == undefined) {
                  v.categories[d.data.type] = 0
                }
                  return [v.time,v.categories[d.data.type]];}),segColor(d.data.type));
          }
          //Utility function to be called on mouseout a pie slice.
          function mouseout(d){
              // call the update function of histogram with all data.
              hG.update(fData.map(function(v){
                  return [v.time,v.total];}), barColor);
          }
          // Animating the pie-slice requiring a custom function which specifies
          // how the intermediate paths should be drawn.
          function arcTween(a) {
              var i = d3.interpolate(this._current, a);
              this._current = i(0);
              return function(t) { return arc(i(t));    };
          }
          return pC;
      }

      // function to handle legend.
      function legend(lD){
          var leg = {};

          // create table for legend.
          var legend = d3.select(id).append("table").attr('id', 'legenda').attr('class','legend');

          // create one row per segment.s
          var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

          // create the first column for each segment.
          tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
              .attr("width", '16').attr("height", '16')
  			      .attr("fill",function(d){ return segColor(d.type); });

          // create the second column for each segment.
          tr.append("td").attr("class",'LegendName')
              .text(function(d){ return d.type;});

          // create the third column for each segment.
          tr.append("td").attr("class",'legendFreq')
              .text(function(d){ return d3.format(",")(d.freq);});

          // create the fourth column for each segment.
          tr.append("td").attr("class",'legendPerc')
              .text(function(d){ return getLegend(d,lD);});

          // Utility function to be used to update the legend.
          leg.update = function(nD){
              var Parent = document.getElementById("legenda");
              if (Parent != null) {
                while(Parent.hasChildNodes())
                {
                 Parent.removeChild(Parent.firstChild);
                }
              };
              // update the data attached to the row elements.
              var tr = legend.append("tbody").selectAll("tr").data(nD).enter().append("tr");

              tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
                  .attr("width", '16').attr("height", '16')
      			      .attr("fill",function(d){ return segColor(d.type); });

              // create the second column for each segment.
              tr.append("td").attr("class",'LegendName')
                  .text(function(d){ return d.type;});

              // create the third column for each segment.
              tr.append("td").attr("class",'legendFreq')
                  .text(function(d){ return d3.format(",")(d.freq);});

              // create the fourth column for each segment.
              tr.append("td").attr("class",'legendPerc')
                  .text(function(d){ return getLegend(d,nD);});
          }

          function getLegend(d,aD){ // Utility function to compute percentage.
              return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
          }

          return leg;
      }

      // calculate total frequency by segment for all state.

      counter = 1

      function typesToArray(data) {
        typeList = [];
        for (i = 0; i < data.length; i++){
          for (var key in data[i].categories) {
            if (typeList.indexOf(key) == -1) {
              typeList.push(key)
            };
          };
        };
        typeList.sort();
        return {typeList}
      };

      typesToArray(fData)
      var tF = typeList.map(function(d){
          return {type:d, freq: d3.sum(fData.map(function(t){
            if (d in t.categories) {
              // console.log(d)
              // console.log(t.categories, counter)
              // counter++;
              // console.log(t.categories[d], counter)
              return t.categories[d]
            }
            ;}))};
      });

      // calculate total frequency by state for all segment.
      var sF = fData.map(function(d){return [d.time,d.total];});

      var hG = histoGram(sF), // create the histogram.
          pC = pieChart(tF), // create the pie-chart.
          leg= legend(tF);  // create the legend.
    }
    var overlay = new google.maps.OverlayView();

    // Add the container when the overlay is added to the map.
    overlay.onAdd = function() {
      var layer = d3.select(this.getPanes().overlayLayer).append("div")
          .attr("class", "transactions");

      // Draw each marker as a separate SVG element.
      // We could use a single SVG, but what size would it have?
      overlay.draw = function() {
        var projection = this.getProjection(),
            padding = 10;

        console.log(data)
        var marker = layer.selectAll("svg")
          .data(d3.entries(data))
          .each(transform) // update existing markers
        .enter().append("svg")
          .each(transform)
          .attr("class", "marker")

        var marker2 = layer.selectAll("svg")
          .data(d3.entries(data))
          .each(transform2) // update existing markers
        .enter().append("svg")
          .each(transform2)
          .attr("class", "marker2");

        // Add a image.
        marker.append("image")
        .attr('class','mark')
        .attr('width', 20)
        .attr('height', 20)
        .attr("xlink:href",'../doc/imageedit_10_7072605565.png')

        marker2.append("image")
        .attr('class','mark2')
        .attr('width', 20)
        .attr('height', 20)
        .attr("xlink:href",'../doc/rsz_red-pin-no-shadow-clip-art.png')

        // Add a label.
        marker.append("text")
          .attr("x", padding + 7)
          .attr("y", padding)
          .attr("dy", ".31em")
          .text(function(d) { return d.value.productArchetype.locales.nl_NL[0]; });

        marker2.append("text")
          .attr("x", padding + 7)
          .attr("y", padding)
          .attr("dy", ".31em")
          .text(function(d) { return d.value.productArchetype.locales.nl_NL[0]; });

        function transform(d) {
          e = new google.maps.LatLng(d.value.contactInfo.geolocation.lat, d.value.contactInfo.geolocation.lng);
          e = projection.fromLatLngToDivPixel(e);
          return d3.select(this)
              .style("left", (e.x - padding) + "px")
              .style("top", (e.y - padding) + "px")
        };

        function transform2(d) {
          f = new google.maps.LatLng(d.value.suppliers[0].user.geolocation.lat, d.value.suppliers[0].user.geolocation.lng);
          f = projection.fromLatLngToDivPixel(f);
          console.log(this)
          return d3.select(this)
            .style("left", (f.x - padding) + "px")
            .style("top", (f.y - padding) + "px");
        };


      };
    }
    dashboard('#dashboard',timedata);
    // Bind our overlay to the map…
    overlay.setMap(map);
  });
});
