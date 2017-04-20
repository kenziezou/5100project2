//Data sets references are from IUCN Red List of Threatened Species (http://www.iucnredlist.org)
//Consulted the following reference http://bl.ocks.org/juan-cb/1984c7f2b446fffeedde


//First donut chart: animal category at risk
d3.select("input[value=\"total\"]").property("checked", true);

var svg3 = d3.select("body")
    .append("svg")
    .attr("width", 700)
    .attr("height", 400)
    .append("g")

svg3.append("g")
  .attr("class", "slices");
svg3.append("g")
  .attr("class", "labelName");
svg3.append("g")
  .attr("class", "labelValue");
svg3.append("g")
  .attr("class", "lines");

var width = 650,
    height = 380,
  radius = Math.min(width, height) / 2;

var pie = d3.pie()
  .sort(null)
  .value(function(d) {
    return d.value;
  });

var arc = d3.arc()
  .outerRadius(radius * 0.8)
  .innerRadius(radius * 0.5);

var outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9);

var legendRectSize = (radius * 0.08);
var legendSpacing = radius * 0.02;


var div = d3.select("body").append("div").attr("class", "toolTip");

svg3.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


var colorRange = ["#FF7777", "#490000"];
var color = d3.scaleOrdinal(d3.schemeCategory20).range(colorRange);

datasetTotal = [
        {label:"Least concern", value:61.87, definition:"Lowest risk. Does not qualify for a more at-risk category. Widespread and abundant taxa are included in this category.", number:82065},
        {label:"At risk", value:38.13, definition:"Species are classified by the IUCN Red List into nine groups, set through criteria such as rate of decline, population size, area of geographic distribution, and degree of population and distribution fragmentation.", number:31290}
        ];

change(datasetTotal);
d3.selectAll("input")
  .on("change", selectDataset);

function change(data) {

  /* ------- PIE SLICES -------*/
  var slice = svg3.select(".slices").selectAll("path.slice")
        .data(pie(data), function(d){ return d.data.label });

    slice.enter()
        .insert("path")
        .style("fill", function(d) { return color(d.data.label); })
        .attr("class", "slice");

    slice
        .transition().duration(1000)
        .attrTween("d", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                return arc(interpolate(t));
            };
        })
    slice
        .on("mousemove", function(d){
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html((d.data.label)+": "+(d.data.definition)+"Total number: "+(d.data.number)+" species");
        });
    slice
        .on("mouseout", function(d){
            div.style("display", "none");
        });

    slice.exit()
        .remove();

    var legend = svg3.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = -3 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d; });

    /* ------- TEXT LABELS -------*/

    var text = svg3.select(".labelName").selectAll("text")
        .data(pie(data), function(d){ return d.data.label });

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return (d.value+"%");
        });

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text
        .transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        })
        .text(function(d) {
            return (d.value+"%");
        });


    text.exit()
        .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = svg3.select(".lines").selectAll("polyline")
        .data(pie(data), function(d){ return d.data.label });

    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();
};

change(datasetTotal);




//second donut chart

d3.select("input[value=\"total\"]").property("checked", true);

var svg3 = d3.select("body")
    .append("svg")
    .attr("width", 700)
    .attr("height", 400)
    .append("g")

svg3.append("g")
  .attr("class", "slices");
svg3.append("g")
  .attr("class", "labelName");
svg3.append("g")
  .attr("class", "labelValue");
svg3.append("g")
  .attr("class", "lines");

var width = 650,
    height = 380,
  radius = Math.min(width, height) / 2;

var pie = d3.pie()
  .sort(null)
  .value(function(d) {
    return d.value;
  });

var arc = d3.arc()
  .outerRadius(radius * 0.8)
  .innerRadius(radius * 0.5);

var outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9);

var legendRectSize = (radius * 0.08);
var legendSpacing = radius * 0.02;


var div = d3.select("body").append("div").attr("class", "toolTip");

svg3.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


var colorRange = ["#490000","#760000", "#960101","#C30404","#FF2F2F","#FF7777"];
var color = d3.scaleOrdinal(d3.schemeCategory20).range(colorRange);

datasetTotal = [
        {label:"Extinct", value:2.86, definition:"No known individuals remaining.", number:893},
        {label:"Critically endangered", value:17.60, definition:"Extremely high risk of extinction in the wild.", number:5509},  
        {label:"Extinct in wild", value:0.24, definition:"Known only to survive in captivity, or as a naturalized population outside its historic range.", number:74},
        {label:"Endangered", value:26.04, definition:"High risk of extinction in the wild.", number:8150},
        {label:"Vulnerable", value:38.16, definition:"High risk of endangerment in the wild.", number:11941},
        {label:"Near threatened", value:15.11, definition:"Likely to become endangered in the near future.", number:4723}
        ];

change(datasetTotal);
d3.selectAll("input")
  .on("change", selectDataset);
  
function selectDataset()
{
  var value = this.value;
  if (value == "total")
  {
    change(datasetTotal);
  }
  else if (value == "option1")
  {
    change(datasetOption1);
  }
  else if (value == "option2")
  {
    change(datasetOption2);
  }
}

function change(data) {

  /* ------- PIE SLICES -------*/
  var slice = svg3.select(".slices").selectAll("path.slice")
        .data(pie(data), function(d){ return d.data.label });

    slice.enter()
        .insert("path")
        .style("fill", function(d) { return color(d.data.label); })
        .attr("class", "slice");

    slice
        .transition().duration(1000)
        .attrTween("d", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                return arc(interpolate(t));
            };
        })
    slice
        .on("mousemove", function(d){
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html((d.data.label)+": "+(d.data.definition)+"<br>"+"Total number: "+(d.data.number)+" species");
        });
    slice
        .on("mouseout", function(d){
            div.style("display", "none");
        });

    slice.exit()
        .remove();

    var legend = svg3.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = -3 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d; });

    /* ------- TEXT LABELS -------*/

    var text = svg3.select(".labelName").selectAll("text")
        .data(pie(data), function(d){ return d.data.label });

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return (d.value+"%");
        });

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text
        .transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        })
        .text(function(d) {
            return (d.value+"%");
        });


    text.exit()
        .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = svg3.select(".lines").selectAll("polyline")
        .data(pie(data), function(d){ return d.data.label });

    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();
};

change(datasetTotal);