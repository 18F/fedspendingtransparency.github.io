import React, { Component } from "react";

import "./Sunburst.css";
import SunburstElement from "components/SunburstElement/SunburstElement";

class Sunburst extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <svg width="550" height="700">
        <g transform="translate(255,250)">
          {this.props.nodes.map((node, i) => (
            <SunburstElement key={i} node={node} />
          ))}
        </g>
      </svg>
    );
  }
}

export default Sunburst;
