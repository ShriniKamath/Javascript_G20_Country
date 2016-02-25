var linearScale = d3.scale.linear()
                            .domain([0,14367993361622.7])
                            .range([0,1000]);
var margin = {top: 20, right: 10, bottom: 65, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#336E7B", "#67809F"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("../json/inc_popul_purchpow.json", function(error, data) {
	var x0 = Math.max(-d3.min(data), d3.max(data));
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "key"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.ages[d.ages.length - 1].y1;
  });

  //data.sort(function(a, b) { return b.total - a.total; });

  x.domain(data.map(function(d) { return d.key; }));
  y.domain([-10, d3.max(data, function(d) { return d.total; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("dx" , "10px")
      .style("text-anchor" , "end")
      .attr("transform" , "translate(0, 5) rotate(-45)" )
      .append("text")

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var key = svg.selectAll(".key")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.key) + ",0)"; });

  key.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { if (d=='value1')return "Growth of Population "; else { return "Growth of Purchasing power"} });

});
