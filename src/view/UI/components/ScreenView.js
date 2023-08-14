import React from "react";
import { isMobile } from "react-device-detect";
import styled, { keyframes } from "styled-components";
import { appColor } from "../../../settings/constants";

const ScreenView = (props) => {
  const { bgColor, className, style } = props;
  return (
    <WrappView
      style={{
        width: "100%",
        height: "100%",
        padding: isMobile ? 0 : 10,
        ...style,
      }}
      bgColor={bgColor}
      className={className}
    >
      {props.children}
    </WrappView>
  );
};

export default ScreenView;

const WrappView = styled.section`
  animation-name: ${animatebottom};
  animation-duration: 0.5s;
  position: relative;
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : appColor.bgSecondaryColor};
  .ant-card-head {
    padding: 10px !important;
  }
  /* overflow: hidden; */
`;

const animatebottom = keyframes`
from {
    bottom: -50px;
    opacity: 0;
  }
  to {
    bottom: 0;
    opacity: 1;
  }
`;
