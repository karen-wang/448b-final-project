var margin = { top: 30, right: 0, bottom: 100, left: 100 },
          width = 750 - margin.left - margin.right,
          height = 630 - margin.top - margin.bottom,
          legendspace = 0,
          gridSize = Math.floor(width / 10), //switch basd on num tracks
          legendElementWidth = .9*gridSize,
          buckets = 10,
          colors = colorbrewer.Purples[buckets-1],//["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          tracks = ["AI", "CompEng", "Info", "Theory", "Systems", "Graphics", "HCI"].sort(),
          full_tracknames = ["Artificial Intelligence", "Computer Engineering", "Information", "Theory", "Systems", "Graphics", "Human Computer Interaction"].sort()
          //times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
          datasets = ["track-track.tsv"];

      //should be good
      var heatmap = d3.select("#heatmap").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //looks fine
      var dayLabels = heatmap.selectAll(".dayLabel")
          .data(tracks)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize+2*i })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.7 + ")")
            .attr("class", function (d, i) { return ((i >= 0) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = heatmap.selectAll(".timeLabel")
          .data(tracks)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize+2*i; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 1.9 + ", -6)")
            .attr("class", function(d, i) { 
              return ((i >= 0) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

      var heatmapChart = function(tsvFile, common_classes_for_track) {
        d3.tsv(tsvFile,
        function(d) {
          return {
            day: +d.track1,
            hour: +d.track2,

            value: parseFloat(Math.round(d.similarity * 1000) / 1000).toFixed(3)
          };
        },
        function(error, data) {
          var colorScale = d3.scale.quantile()
              .domain([0, d3.max(data, function (d) { return d.value; })])
              .range(colors);

          var cards = heatmap.selectAll(".hour")
              .data(data, function(d) {return d.day+':'+d.hour;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize+2*d.hour; })
              .attr("y", function(d) { return (d.day - 1) * gridSize+2*d.day; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "hour bordered")
              .attr("width", gridSize)
              .attr("height", gridSize)
              .attr("margin", 1)
              .style("fill", "white")
              .on('mouseover', function(c) {
                
                d3.select('#track1-name').text(full_tracknames[c.hour-1])
                d3.select('#track2-name').text(full_tracknames[c.day-1])
                d3.select('#similarity').text(c.value)
                trackstr = c.hour.toString() + c.day.toString();
                d3.select('#track1-common').text(common_classes_for_track[trackstr]);
                d3.select(this).style({"stroke": "green", "stroke-width": "2px"});
              })
              .on('mouseout', function(c) {
                d3.select(this).style({"stroke": "white", "stroke-width": "2px"});
                d3.select('#track1-name').text("")
                d3.select('#track2-name').text("")
                d3.select('#similarity').text("")
                d3.select('#track1-common').text('')
              });

          cards.transition().duration(1000)
              .style("fill", function(d) { 
                
                var COMPRESS = false
                if (COMPRESS) {
                  console.log(tracks[d.day-1], tracks[d.hour-1], Math.pow(d.value, .6))
                  return colorScale(Math.pow(d.value, .5)); 
                } else {
                  console.log(tracks[d.day-1], tracks[d.hour-1], d.value)
                  return colorScale(d.value); 
                }
              });

          cards.select("title").text(function(d) { return d.value; });
          
          cards.exit().remove();

          var legend = heatmap.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend");

          var LEGEND_SHIFT = 40;

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i-LEGEND_SHIFT; })
            .attr("y", height+legendspace)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .text(function(d) { 
              console.log(d)
              return "≥ " + Math.round(100*Math.pow(d, 1))/100.0; 
            })
            .attr("x", function(d, i) { return legendElementWidth * i-LEGEND_SHIFT; })
            .attr("y", height + gridSize);

          legend.exit().remove();
          console.log('loaded heatmap')
        });  
      };

      


      var readCommonClasses = function(file) {
        d3.tsv(file, 
          function(d) {
            console.log(d.track1, d.track2, d.c1)
            common_classes_for_track[d.track1+d.track2] = d.c1 + ', ' +d.c2 + ', ' + d.c3 + ', '+ d.c4 + ', ' + d.c5;
            return {
              track1: +d.track1,
              track2: +d.track2,
              //classes: [d.c1, d.c2, d.c3, d.c4, d.c5]
            };
          }, function(error, data) {
            console.log('done')
          }
        );

      };


      common_classes_for_track = {}
      readCommonClasses('common_classes.tsv');
      heatmapChart(datasets[0], common_classes_for_track);
      // var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
      //   .data(datasets);

      // datasetpicker.enter()
      //   .append("input")
      //   .attr("value", function(d){ return "Dataset " + d })
      //   .attr("type", "button")
      //   .attr("class", "dataset-button")
      //   .on("click", function(d) {
      //     heatmapChart(d);
      //   });