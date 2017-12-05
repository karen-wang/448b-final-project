var margin = { top: 50, right: 0, bottom: 100, left: 100 },
          width = 960 - margin.left - margin.right,
          height = 570 - margin.top - margin.bottom,
          legendspace = 0,
          gridSize = Math.floor(width / 12), //switch basd on num tracks
          legendElementWidth = .8*gridSize,
          buckets = 8,
          colors = colorbrewer.Purples[buckets],//["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
          days = ["AI", "CompEng", "Info", "Theory", "Systems"],
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
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = heatmap.selectAll(".timeLabel")
          .data(days)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function(d, i) { 
              return ((i >= 0) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

      var heatmapChart = function(tsvFile) {
        d3.tsv(tsvFile,
        function(d) {
          return {
            day: +d.track1,
            hour: +d.track2,
            value: parseFloat(d.similarity)
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
              .attr("x", function(d) { return (d.hour - 1) * gridSize; })
              .attr("y", function(d) { return (d.day - 1) * gridSize; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "hour bordered")
              .attr("width", gridSize)
              .attr("height", gridSize)
              .style("fill", "white");

          cards.transition().duration(1000)
              .style("fill", function(d) { 
                
                var COMPRESS = true
                if (COMPRESS) {
                  return colorScale(Math.pow(d.value, .6)); 
                } else {
                  return colorScale(d.value); 
                }
                
              });

          cards.select("title").text(function(d) { return d.value; });
          
          cards.exit().remove();

          var legend = heatmap.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend");

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height+legendspace)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .text(function(d) { 
              console.log(d)
              return "≥ " + Math.round(10*d)/10.0; 
            })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize);

          legend.exit().remove();

        });  
      };

      heatmapChart(datasets[0]);
      
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