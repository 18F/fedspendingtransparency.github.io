const barchartModule = function() {
  var svg = d3.select("#barchartSvg"),
    margin = { top: 20, right: 40, bottom: 10, left: 50 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3
      .scaleBand()
      .rangeRound([0, width])
      .padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  function draw(data, { agencies, occupationCategories }) {
    g.selectAll("*").remove();

    const groupedData = Object.values(
      data.reduce((a, c) => {
        if (!a[c.occupationCategoryId]) {
          a[c.occupationCategoryId] = {
            occupationCategoryId: c.occupationCategoryId,
            occupationCategoryName:
              occupationCategories[c.occupationCategoryId].name,
            employeeCount: c.employeeCount
          };
        } else {
          a[c.occupationCategoryId].employeeCount += c.employeeCount;
        }
        return a;
      }, {})
    ).sort((a, b) => b.employeeCount - a.employeeCount);

    x.domain(groupedData.map(d => d.occupationCategoryName));
    y.domain([0, d3.max(groupedData, d => d.employeeCount)]);

    g
      .append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10))
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Employee Count");

    g
      .selectAll(".bar")
      .data(groupedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.occupationCategoryName))
      .attr("y", d => y(d.employeeCount))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.employeeCount));

    g
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "start")
      .attr("dx", ".8em")
      .attr("dy", "-.6em")
      .attr("transform", "rotate(-90)")
      .attr("pointer-events", "none");
  }

  return { draw };
};
