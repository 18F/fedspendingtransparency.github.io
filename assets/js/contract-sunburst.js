let state = {};

for (let i = 0; i < 4; i++) {
  d3
    .select("#legend_scaleKey")
    .append("circle")
    .attr("r", 25 + i * 10)
    .attr("class", "legend_scaleKeyCircle")
    .attr("cx", 60)
    .attr("cy", 65);
}

var width = 550,
  height = 700,
  radius = Math.max(width, height) / 2.5 - 30; //change 2.5 to a larger number to make burst smaller

var formatNumber = d3.format("$,f");

var x = d3.scale.linear().range([0, 2 * Math.PI]);
var y = d3.scale.sqrt().range([0, radius]);

var partition = d3.layout.partition().value(d => d.size);

var legend = d3.select("#sunburst-panel");

var arc = d3.svg
  .arc()
  .startAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x))))
  .endAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))))
  .innerRadius(d => Math.max(0, y(d.y)))
  .outerRadius(d => Math.max(0, y(d.y + d.dy)));

var svg = d3
  .select("#sunburst")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2 - 20},${height / 2 - 100})`);

function findColor(d) {
  switch (d.depth) {
    case 0: // root
      return "#FFFFFF";
    case 1: // agency
      return state.colors.find(function(color) {
        return color.name === d.name;
      }).color;
    case 2: // subagency
      return d3
        .rgb(
          state.colors.find(function(color) {
            return color.name === d.parent.name;
          }).color
        )
        .darker(-0.75);
    case 3: // contractor
      return d3
        .rgb(
          state.colors.find(function(color) {
            return color.name === d.parent.parent.name;
          }).color
        )
        .darker(-1.25);
  }
}

var spinnerOpts = {
  lines: 9, // The number of lines to draw
  length: 9, // The length of each line
  width: 5, // The line thickness
  radius: 14, // The radius of the inner circle
  color: "#EE3124", // #rgb or #rrggbb or array of colors
  speed: 1.9, // Rounds per second
  trail: 40, // Afterglow percentage
  className: "spinner" // The CSS class to assign to the spinner
};

var target = document.getElementById("sunburst");

function createTableTitle(legend, d) {
  $("#sunburst-panel").empty();
  legend
    .append("div")
    .attr("id", "tab")
    .attr("height", 169)
    .attr("width", 422)
    .html(
      `<h1 class='panel_title'>
        ${d.name}
        </h1>
        <h3 class='panel_desc'>
        ${formatNumber(d.value)}
        <br />
        </h3>`
    );
}

function createFillTable(legend, d) {
  for (let k = 0; k < 5; k++) {
    createFillTableRow(legend, d.children, "value", k);
  }
}

function createFillTableRow(legend, child, amt, k) {
  console.log({ legend, child, amt, k });
  legend
    .append("div")
    .attr("id", "tab_2")
    .attr("height", 169)
    .attr("width", 422)
    .style("margin-bottom", "2px")
    .html(
      `<table class ='icon'>
        <tr>
        <td class='val'>
        ${formatNumber(child[k][amt])}
        </td>
        <td class='name'>
        ${child[k].name}
        </td>
        </tr>
        </table>`
    );
}

// trigger loader
var spinner = new Spinner(spinnerOpts).spin(target);

function formatData(data) {
  const hierarchy = {
      name: "FY17 Q3 Contract Awards",
      children: []
    },
    data2 = data.map(c => {
      c.path = [c.Agency, c.Subagency, c.Recipient];
      return c;
    });

  let parent = hierarchy.children;
  const pathLength = data2[0].path.length;

  data2.forEach(c => {
    parentContainer = hierarchy.children;
    c.path.forEach((level, i) => {
      if (i === pathLength - 1) {
        // outermost ring
        parentContainer.push({ name: level, size: c.Obligation });
      }
      parentTemp = parentContainer.find(e => e.name === level);
      if (!parentTemp) {
        // branch hasn't been created yet
        const newObj = { name: level, children: [] };
        parentContainer.push(newObj);
        parentContainer = newObj.children;
      } else {
        // branch has been created
        parentContainer = parentTemp.children;
      }
    });
  });
  return hierarchy;
}

function createAgencyTitle(legend, d, title) {
  $("#sunburst-panel").empty();
  legend
    .append("div")
    .attr("id", "tab")
    .attr("height", 169)
    .attr("width", 465)
    .html(
      `<h2 class='title'>
        ${d.name} 
        </h2><h1> 
        ${formatNumber(d.value)} 
        </h1> 
        <h4> 
        ${title} 
        </h4>`
    );
}

function update_legend(d) {
  const { details, recip } = state;
  // Create central node panel --- Top 10 Agencies
  if (d.depth === 0) {
    createTableTitle(legend, d);
    createFillTable(legend, d);
  } else if (d.depth === 3 && d.name != "Other") {
    // Contractors
    for (var i = 0; i < details.length; i++) {
      if (d.name === details[i].name) {
        $("#sunburst-panel").empty(); //new
        legend
          .append("div") //new
          .attr("id", "tab") //new
          .attr("height", 169) //new
          .attr("width", 422) //new
          .html(
            `<h2 class='title'>
              ${d.name.toLowerCase()}
            </h2>
            <h1>
              ${formatNumber(d.value)}
            </h1>
            <p>
              ${details[i].city.toLowerCase()},
              ${details[i].state.toLowerCase()}
            </p>
            <h3> has been awarded a net total of
              ${formatNumber(details[i].size)}
            in contracts in Q3 2017</h3>`
          );

        for (var q = 0; q < recip.length; q++) {
          if (
            d.parent.name === recip[q].Subagency &&
            d.name === recip[q].Recipient
          ) {
            var g = legend
              .append("div")
              .attr("id", "psc_panel")
              .attr("height", 155)
              .attr("width", 465)
              .style("margin", "[0,0,0,0]");

            g
              .append("img")
              .attr("src", function() {
                return `/data-lab-data/Sunburst_Icons_SVGs/${recip[q].icon}`;
              })
              .attr("class", "icon_svg");

            g
              .append("div")
              .attr("id", "psc")
              .attr("height", 10)
              .attr("width", 50)
              .html(
                `<table class ='icon_x'>
                  <tr>
                    <td class='name'>${recip[q].PSC}</td> 
                  </tr>
                </table>`
              );

            if (recip[q].Obligation >= 0) {
              g
                .append("div")
                .attr("id", "obligation")
                .attr("height", 10)
                .attr("width", 50)
                .html(
                  `<table class ='icon_x'>
                    <tr>
                      <td class='val'>
                        ${formatNumber(recip[q].Obligation)}
                      </td>
                    </tr>
                    </table>`
                );
            } else {
              g
                .append("div")
                .attr("id", "obligation")
                .attr("height", 10)
                .attr("width", 50)
                .html(
                  `<table class ='icon_x'>
                    <tr>
                      <td class='neg_val'>
                        ${formatNumber(recip[q].Obligation)}
                      </td>
                    </tr>
                  </table>`
                );
            }
          }
        }
      }
    }
  } else if (d.depth === 3 && d.name == "Other") {
    $("#sunburst-panel").empty();
    //Contractors < $1,000,000
    legend
      .append("div")
      .attr("id", "tab")
      .attr("height", 169)
      .attr("width", 465)
      .html(
        `<h3>Other Contractors Supporting the
          ${d.parent.name}
          with Contract Values Less Than $1,000,000
        </h3>
        <h4>
          These Contracts are Worth a Total Value of 
          ${formatNumber(d.value)}
        </h4>
        <h4>Top Contractors</h4>`
      );

    for (var l = 0; l < other.length; l++) {
      if (d.parent.name === other[l].sub) {
        createFillTableRow(legend, other, "size", l);
      }
    }
  } else if (d.depth === 1) {
    //Agencies
    createAgencyTitle(legend, d, "Agencies");

    var t = Math.min(d.children.length, 5);

    for (var k = 0; k < t; k++) {
      createFillTableRow(legend, d.children, "value", k); // 465 width
    }
    legend
      .transition()
      .duration(500)
      .style("opacity", "1");
  } else {
    //Subagencies
    createAgencyTitle(legend, d, "Contractors");

    var t = Math.min(d.children.length, 5);

    for (let k = 0; k < t; k++) {
      createFillTableRow(legend, d.children, "value", k); // 465 with
    }
    legend
      .transition()
      .duration(500)
      .style("opacity", "1");
  }
}

function remove_legend(d) {
  legend
    .transition()
    .duration(1000)
    .style("opacity", "1");
}

function drawSunburst(data) {
  const hierarchy = formatData(data);
  const root = partition.nodes(hierarchy);

  state.hierarchy = hierarchy;
  state.root = root;

  const paths = svg.selectAll("path").data(root);

  paths
    .enter()
    .append("path")
    .attr("d", arc)
    .on("mouseover", update_legend)
    .on("mouseout", remove_legend)
    .style("cursor", "pointer")
    .style("fill", d => findColor(d))
    .on("click", click)
    .append("title")
    .text(
      d =>
        d.depth === 0 ? `${d.name}\n${formatNumber(d.value)}` : "Click to zoom"
    );

  paths.exit().remove();
}

function click(selected) {
  console.log({ selected });
  let filteredData;

  switch (selected.depth) {
    case 0: // root
      filteredData = [...newData];
      break;
    case 1: // agency
      filteredData = newData.filter(d => d.Agency === selected.name);
      break;
    case 2: // subagency
      filteredData = newData.filter(d => d.Subagency === selected.name);
      break;
    case 3: // contractor
      filteredData = newData.filter(d => d.Recipient === selected.name);
      break;
  }

  // const hierarchy = formatData(filteredData);
  // const root = partition.nodes(hierarchy);

  // svg
  //   .selectAll("path")
  //   .data(root)
  //   .enter()
  //   .append("path")
  //   .attr("d", arc)
  //   .on("mouseover", update_legend)
  //   .on("mouseout", remove_legend)
  //   .style("cursor", "pointer")
  //   .style("fill", d => findColor(d, colors))
  //   .on("click", click)
  //   .append("title")
  //   .text(
  //     d =>
  //       d.depth === 0
  //         ? `${d.name}\n${formatNumber(d.value)}`
  //         : "Click to zoom"
  //   );

  /*
  svg
    .transition()
    .duration(750)
    .tween("scale", function() {
      var xd = d3.interpolate(x.domain(), [
          selected.x,
          selected.x + selected.dx
        ]),
        yd = d3.interpolate(y.domain(), [selected.y, 1]),
        yr = d3.interpolate(y.range(), [selected.y ? 20 : 0, radius]);
      return function(t) {
        x.domain(xd(t));
        y.domain(yd(t)).range(yr(t));
      };
    })
    .selectAll("path")
    // .data(root)
    .attrTween("d", function(d) {
      // console.log({ d });
      return function() {
        return arc(d);
      };
    });
    */
}

function createSunburst(newData, recip, details, other, colors) {
  spinner.stop();

  drawSunburst(state.newData);

  createTableTitle(legend, state.hierarchy);

  createFillTable(legend, state.hierarchy);
}

d3.csv("/data-lab-data/awards_contracts.csv", function(error, newData) {
  d3.csv("/data-lab-data/PSC_by_Recip.csv", function(error, recip) {
    d3.csv("/data-lab-data/Recip_Details.csv", function(error, details) {
      d3.csv("/data-lab-data/others.csv", function(error, other) {
        d3.csv("/data-lab-data/colors.csv", function(error, colors) {
          state = { newData, recip, details, other, colors };
          createSunburst(newData, recip, details, other, colors);
        });
      });
    });
  });
});

d3.select(self.frameElement).style("height", height + "px");
//new
