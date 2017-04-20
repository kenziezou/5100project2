//Data sets references are from IUCN Red List of Threatened Species (http://www.iucnredlist.org)
//Consulted the following reference http://bl.ocks.org/juan-cb/1984c7f2b446fffeedde

d3.select("input[value=\"total\"]").property("checked", true);

var svg3 = d3.select("body")
  .append("svg")
    .attr("width", 960)
    .attr("height", 500)
  .append("g")

svg3.append("g")
  .attr("class", "slices");
svg3.append("g")
  .attr("class", "labelName");
svg3.append("g")
  .attr("class", "labelValue");
svg3.append("g")
  .attr("class", "lines");

var width = 960,
    height = 450,
  radius = Math.min(width, height) / 2;

var pie = d3.pie()
  .sort(null)
  .value(function(d) {
    return d.value;
  });

var arc = d3.arc()
  .outerRadius(radius * 0.8)
  .innerRadius(radius * 0.6);

var outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9);

var legendRectSize = (radius * 0.08);
var legendSpacing = radius * 0.02;


var div = d3.select("body").append("div").attr("class", "toolTip");

svg3.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


var colorRange = ["#FFCFB2", "#FFA670", "#FF7F30", 
                "#FF6100", "#CE4F00", "#9E3C00", "#6B2900", 
                "#441A00", "#190900", "#000000"];
var color = d3.scaleOrdinal(d3.schemeCategory20).range(colorRange);

datasetTotal = [
    {label:"Extinct", value:2.86}, 
        {label:"Critically endangered", value:17.60}, 
        {label:"Extinct in wild", value:0.24},
        {label:"Endangered", value:26.04},
        {label:"Vulnerable", value:38.16},
        {label:"Near threatened", value:15.11}
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
            div.html((d.data.label)+"<br>"+(d.data.value)+"%");
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
            return (d.data.label+": "+d.value+"%");
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
            return (d.data.label+": "+d.value+"%");
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