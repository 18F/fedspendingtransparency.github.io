const barchartModule = function() {
  var svg = d3.select("#barchartSvg"),
    margin = { top: 20, right: 80, bottom: 100, left: 50 },
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

  function findFillCollor(type) {
    switch (type) {
      case "Blue Collar":
        return "rgb(66, 134, 244)";
      case "White Collar":
        return "white";
      case "Other":
        return "green";
    }
  }

  function draw(data, { agencies, occupationCategories }) {
    console.log({ data });

    g.selectAll("*").remove();

    const groupedData = Object.values(
      data.reduce((a, c, i) => {
        if (!a[c.occupationCategoryId]) {
          a[c.occupationCategoryId] = {
            occupationCategoryId: c.occupationCategoryId,
            occupationCategoryName:
              occupationCategories[c.occupationCategoryId].shortenedName,
            employeeCount: c.employeeCount,
            occupationCategoryType: c.occupationType
          };
        } else {
          a[c.occupationCategoryId].employeeCount += c.employeeCount;
        }
        return a;
      }, {})
    )
      .sort((a, b) => b.employeeCount - a.employeeCount)
      .reduce((a, c, i) => {
        if (i < 25) {
          a.push(c);
        } else if (i === 25) {
          a.push({
            occupationCategoryId: 99,
            occupationCategoryName: "All Other Occupations",
            occupationCategoryType: "Other",
            employeeCount: c.employeeCount
          });
        } else if (i > 25) {
          a[25].employeeCount += c.employeeCount;
        }
        return a;
      }, []);

    console.log({ groupedData });

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
      .attr("height", d => height - y(d.employeeCount))
      .attr("fill", d => findFillCollor(d.occupationCategoryType))
      .attr("stroke", "rgb(0,0,0)")
      .attr("stroke-width", "1")
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut);

    g
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(1,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "start")
      .attr("dx", ".5em")
      .attr("dy", ".3em")
      .attr("transform", "rotate(45)")
      .attr("pointer-events", "none");

    function handleMouseOver(d) {
      const formatNumber = d3.format(",d");
      tooltipModuleDraw(d.occupationCategoryName, {
        Employees: formatNumber(d.employeeCount)
      });
    }

    function handleMouseOut() {
      tooltipModuleRemove();
    }

    function handleMouseMove() {
      tooltipModuleMove();
    }
  }

  return { draw };
};
