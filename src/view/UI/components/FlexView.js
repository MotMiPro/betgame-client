import React from "react";

const FlexView = (props) => {
  const { direction = "row", justify = "space-between", style } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: justify,
        flexDirection: direction,
        alignItems: "center",
        flexWrap: "wrap",
        ...style,
      }}
    >
      {props.children}
    </div>
  );
};
export default FlexView;
