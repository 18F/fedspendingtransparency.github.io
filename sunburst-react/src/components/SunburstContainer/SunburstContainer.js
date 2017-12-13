import React, { Component } from "react";
import * as d3 from "d3";

import "./SunburstContainer.css";
import sunburstFormattedData from "data/sunburstFormattedData.json";

import Sunburst from "components/Sunburst/Sunburst";

const width = 550,
  height = 700,
  radius = Math.max(width, height) / 2.5 - 30; //change 2.5 to a larger number to make burst smaller

const arc = d3.svg.arc();

const x = d3.scale.linear().range([0, 2 * Math.PI]);
const y = d3.scale.sqrt().range([0, radius]);

const innerRadius = d => Math.max(0, y(d.y));
const outerRadius = d => Math.max(0, y(d.y + d.dy));
const startAngle = d => Math.max(0, Math.min(2 * Math.PI, x(d.x)));
const endAngle = d => Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));

class SunburstContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: []
    };
  }

  componentWillMount = () => {
    const nodes = d3.layout
      .partition()
      .value(x => x.size)
      .nodes(sunburstFormattedData)
      .map(e => {
        const { name, value, depth, parent } = e;
        const d = arc({
          innerRadius: innerRadius(e),
          outerRadius: outerRadius(e),
          startAngle: startAngle(e),
          endAngle: endAngle(e)
        });
        return { d, name, value, depth, parent };
      });
    this.setState({ nodes });
  };

  render() {
    return (
      <div>
        <h4>this is a placeholder for the Sunburst panel</h4>
        <Sunburst nodes={this.state.nodes} />
      </div>
    );
  }
}

export default SunburstContainer;
