import React from "react";
import { isMobile } from "react-device-detect";

export function MutualWrap(props) {
  const { style } = props;
  return (
    <section style={{ padding: isMobile ? 0 : "5px 6px", ...style }}>
      {props.children}
    </section>
  );
}
