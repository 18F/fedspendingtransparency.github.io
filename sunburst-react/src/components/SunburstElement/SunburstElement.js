import React from "react";
import d3 from "d3";

import "./SunburstElement.css";
import colors from "data/colors.json";

const findColor = node => {
  switch (node.depth) {
    case 0: // root
      return "#FFFFFF";
    case 1: // agency
      return colors.find(color => color.name === node.name).color;
    case 2: // subagency
      return d3
        .rgb(colors.find(color => color.name === node.parent.name).color)
        .darker(-0.75);
    case 3: // contractor
      return d3
        .rgb(colors.find(color => color.name === node.parent.parent.name).color)
        .darker(-1.25);
    default:
      return "#FFFFFF";
  }
};

const SunburstElement = ({ node }) => {
  const d = node.d;
  const color = findColor(node);
  return (
    <path d={d} style={{ cursor: "pointer", fill: color }}>
      <title>Click to zoom</title>
    </path>
  );
};

export default SunburstElement;
