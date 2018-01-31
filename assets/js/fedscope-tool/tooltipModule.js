const tooltipModule = function() {
  const formatNumber = d3.format(",d");

  function draw(title, information) {
    d3
      .select("#tooltip")
      .transition()
      .duration(200)
      .style("opacity", 0.9);

    d3
      .select("#tooltip")
      .html(toolTipHtml(title, information))
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY - 28 + "px");

    function toolTipHtml(title, information) {
      return `<h4>${title}</h4>
        <table>
          <tr>
            ${Object.entries(information).map(
              val => `
            <td>${val[0]}: </td>
            <td>${formatNumber(val[1])}</td>
            `
            )}
          </tr>
        </table>`;
    }
  }

  return { draw };
};
