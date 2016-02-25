/*

My Custom JS
============

Author:  Shrinivas Kamath
Updated: Feb 2016

*/
var margin={top:20,right:10,bottom:100,left:75}

var w = 1200-margin.right-margin.left;
var h = 430-margin.top-margin.bottom;

var xScale = d3.scale.ordinal()
.rangeRoundBands([0, w], 0.2,.10);

var yScale = d3.scale.linear()
.range([h, 0]);

var xaxis=d3.svg.axis()
.scale(xScale)
.orient("bottom");

var yaxis=d3.svg.axis()
.scale(yScale)
.orient("left");

d3.json("../json/output.json",function(json){
	var data=json;
	var svg = d3.select(".graph_div")
	.append("svg")
	.attr("width", w + margin.right+ margin.left)
	.attr("height", h + margin.top+ margin.bottom)
	.append("g")
	.attr("transform","translate("+margin.left+','+margin.right+")");

	var colorscale = d3.scale.linear()
	.domain([0,d3.max(data, function(d) {return d.value2;})])
	.range(["red","green","lightblue"]);

	data.sort(function (a, b) {
		return b.value2 - a.value2;
	});

	xScale.domain(data.map(function(d){return d.key;}));
	yScale.domain([0, d3.max(data, function(d) {return d.value2*1.1;})]);


	svg.selectAll("rect")
	.data(data)
	.enter()
	.append("rect")
	.attr("height",0)
	.attr("y",h)
	.transition().duration(1000)
	.delay(function(d,i){return i*20;})
	.attr("x", function(d, i) {
		return xScale(d.key);
	})
	.attr("y", function(d) {
		return yScale(d.value2);
	})
	.attr("width", xScale.rangeBand())
	.attr("height", function(d) {
		return h-yScale(d.value2);
	})
	.attr("fill", "steelblue")
	.style("backgroung","1px dotted black");

	svg.append("g")
	.attr("class","x axis")
	.attr("transform","translate(0,"+ h +")")
	.call(xaxis)
	.selectAll("text")
	.attr("transform","rotate(-60)")
	.attr("dx","-.8em")
	.attr("dy",".25em")
	.style("text-anchor","end")

	svg.append("g")
	.attr("class","y axis")
	.call(yaxis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("dx","-6em")
	.attr("dy", "-4em")
	.style("text-anchor", "end")
	.text("Value in Billion Dollars");
});
