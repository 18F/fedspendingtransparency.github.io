const tooltipModule = function() {
  function draw(title, information) {
    d3
      .select("#tooltip")
      .transition()
      .duration(200)
      .style("opacity", 0.9);

    d3
      .select("#tooltip")
      .html(toolTipHtml(title, information))
      .style("left", `${d3.event.pageX}px`)
      .style("top", `${d3.event.pageY}px`);

    function toolTipHtml(title, information) {
      return `<h4>${title}</h4>
        <table>
          <tr>
            ${Object.entries(information).map(
              val => `
            <td>${val[0]}: </td>
            <td>${val[1]}</td>
            `
            )}
          </tr>
        </table>`;
    }
  }

  function remove() {
    d3
      .select("#tooltip")
      .transition()
      .duration(500)
      .style("opacity", 0);
  }

  function move() {
    d3
      .select("#tooltip")
      .style("left", `${d3.event.pageX}px`)
      .style("top", `${d3.event.pageY}px`);
  }

  return { draw, remove, move };
};
