import React, { Fragment } from "react";
export const formatView = (item) => {
  return !item || item === "0" ? (
    `_`
  ) : (
    <Fragment>
      <span style={{ fontSize: 10 }}>x</span>
      <span style={{ fontSize: 16 }}>{item}</span>
    </Fragment>
  );
};
