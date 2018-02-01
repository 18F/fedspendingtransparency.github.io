const treemapModule = function() {
  var svg = d3.select("#treemapSvg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  const format = d3.format(",d");

  var treemap = d3
    .treemap()
    .tile(d3.treemapResquarify)
    .size([width, height])
    .round(true)
    .paddingInner(1);

  function draw(data, { agencies }) {
    var root = d3
      .hierarchy(data)
      .sum(d => d.obligations)
      .sort((a, b) => b.height - a.height || b.value - a.value);

    treemap(root);

    var cell = svg
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    cell
      .append("rect")
      .attr("id", d => d.data.agencyId)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", "rgb(66, 134, 244)")
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut);

    cell
      .append("clipPath")
      .attr("id", d => `clip-${d.data.agencyId}`)
      .append("use")
      .attr("xlink:href", d => `#${d.data.agencyId}`);

    cell
      .append("text")
      .text(d => agencies[d.data.agencyId].abbreviation)
      .attr("dy", 12)
      .attr("dx", 2)
      .attr("pointer-events", "none");

    function handleMouseOver(d) {
      const formatNumber = d3.format("$,d");
      tooltipModuleDraw(agencies[d.data.agencyId].name, {
        "Employee Salaries": formatNumber(d.value)
      });
      d3.select(this).style("fill", "brown");
    }

    function handleMouseOut() {
      tooltipModuleRemove();
      d3.select(this).style("fill", "rgb(66, 134, 244)");
    }

    function handleMouseMove() {
      tooltipModuleMove();
    }
  }

  return { draw };
};
