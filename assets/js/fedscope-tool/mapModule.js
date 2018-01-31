const mapModule = function() {
  function draw(data, { states, tooltipModuleDraw }) {
    let filteredData = [...data];

    const initialStateData = Object.keys(states).reduce((a, c) => {
      a[c] = 0;
      return a;
    }, {});

    const dataByState = filteredData.reduce((a, c) => {
      a[c.stateAbbreviation] = a[c.stateAbbreviation] + c.employeeCount;
      return a;
    }, initialStateData);

    var color = d3
      .scaleLinear()
      .domain([1, d3.max(Object.values(dataByState), d => d)])
      .range(["rgb(255, 255, 255)", "rgb(66, 134, 244)"])
      .interpolate(d3.interpolateRgb);

    function handleMouseOver(d) {
      const formatNumber = d3.format(",d");
      tooltipModuleDraw(d.name, {
        Employees: formatNumber(dataByState[d.abbreviation])
      });
      d3.select(this).style("fill", "brown");
    }

    function handleMouseOut() {
      tooltipModuleRemove();
      d3.select(this).style("fill", d => color(dataByState[d.abbreviation]));
    }

    function handleMouseMove() {
      tooltipModuleMove();
    }

    d3
      .select("#mapSvg")
      .append("g")
      .attr("transform", "scale(.9375)")
      .selectAll(".state")
      .data(Object.values(states))
      .enter()
      .append("path")
      .attr("class", "state")
      .attr("d", d => d.path)
      .style("fill", d => color(dataByState[d.abbreviation]))
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut);
  }
  return { draw };
};
