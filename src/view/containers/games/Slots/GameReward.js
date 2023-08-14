import { isMobile } from "react-device-detect";
import { appColor } from "~/settings/constants";
import React, { useEffect, useState } from "react";
import { iconCollection } from "~/settings/config";
import styled, { css, keyframes } from "styled-components";

export function GameSelectorArrow(props) {
  const { lineNumber } = props;
  return (
    <div
      style={{ height: "100%", padding: isMobile ? "10px 5px" : "10px 2px" }}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: lineNumber === 1 ? "center" : "flex-start",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {Array.from(Array(lineNumber).keys()).map((index) => {
          return (
            <div
              key={index}
              style={{
                height: "33%",
                display: "flex",
                fontSize: "20px",
                alignItems: "center",
                justifyContent: "space-between",
                color: appColor.textPrimaryColor,
              }}
            >
              <div
                style={{ position: "relative", fontSize: isMobile ? 25 : 45 }}
                className="animate-toRight"
              >
                <i className="fas fa-caret-right" />
              </div>

              <div
                style={{ position: "relative", fontSize: isMobile ? 25 : 45 }}
                className="animate-toLeft"
              >
                <i className="fas fa-caret-left" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export function GameSelectorLine(props) {
  const { lineNumber } = props;
  return (
    <div
      style={{ height: "100%", padding: isMobile ? "10px 5px" : "10px 2px" }}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: lineNumber === 1 ? "center" : "flex-start",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
          }}
        >
          <LineWrapper>
            {Array.apply(null, Array(3)).map((_, idx) => {
              return <LineDtyle key={idx}>''</LineDtyle>;
            })}
          </LineWrapper>
        </div>
      </div>
    </div>
  );
}

const LineDtyle = styled.div`
  background-image: linear-gradient(
    to right,
    rgba(29, 165, 122, 0.2) 50%,
    rgba(255, 255, 255, 0) 0%
  );
  background-position: top;
  background-size: 20px 1px;
  background-repeat: repeat-x;
  background-position: center;
`;

const LineWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
`;

export function GameHighLight(props) {
  const { highLight } = props;
  const [widthCalc, setWidthCalc] = useState(
    document.querySelector(".current-size") &&
      document.querySelector(".current-size").clientWidth
  );
  const [heightCalc, setHeightCalc] = useState(
    document.querySelector(".current-size") &&
      document.querySelector(".current-size").clientHeight
  );
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => {
        const query = document.querySelector(".current-size");
        if (query) {
          setWidthCalc(query.clientWidth);
          setHeightCalc(query.clientHeight);
        }
      },
      { passive: true }
    );
    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
    <div
      style={{
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: 300,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {highLight.map((mul, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                height: 100,
              }}
            >
              {mul?.length > 0 &&
                mul.map((item, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        width: widthCalc + 10,
                        height: heightCalc + 10,
                        background:
                          item >= 6 ? "transparent" : appColor.bgSecondaryColor,
                      }}
                    >
                      <WrappAnimate
                        style={{
                          overflow: "hidden",
                          opacity: item >= 6 ? 0 : 1,
                          width: heightCalc - 15,
                          height: heightCalc - 15,
                          boxShadow: "0 0 5px 3px #00a99d",
                          borderRadius: "100%",
                          padding: 10,
                        }}
                      >
                        <img
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                          alt="img"
                          src={iconCollection[item]}
                        />
                      </WrappAnimate>
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const WrappAnimate = styled.div`
  animation: ${() =>
    css`
      ${zoomOutAnimated} .1s
    `};
  animation-fill-mode: forwards;
`;

const zoomOutAnimated = () => {
  return keyframes`
  0% {transform: scale(5)}
  100% {transform: scale(1)}
`;
};

export function GameReward(props) {
  const { multiList } = props;
  return (
    <AnimationCenter style={{ height: "100%" }}>
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "column",
        }}
      >
        {multiList.map((mul, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "20px",
                color: appColor.textPrimaryColor,
                height: "33%",
                padding: "0 10px",
                borderTop:
                  index === 1 ||
                  (index === 2 && multiList.some((item) => item === true))
                    ? `1px solid ${appColor.gray}`
                    : 0,
                backgroundColor:
                  mul === 0 ? "transparent" : "rgba(255,255,255, .5)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    textTransform: "uppercase",
                    fontStyle: "italic",
                    color: appColor.textWhiteColor,
                    fontWeight: 600,
                    opacity: mul === 0 ? 0 : 1,
                    textShadow: `4px 4px 8px ${appColor.textPrimaryColor}`,
                  }}
                >
                  x
                </span>
                <span
                  style={{
                    fontSize: 48,
                    textTransform: "uppercase",
                    fontStyle: "italic",
                    color: appColor.textWhiteColor,
                    textShadow: `4px 4px 8px ${appColor.textPrimaryColor}`,
                    fontWeight: 700,
                    opacity: mul === 0 ? 0 : 1,
                  }}
                >
                  {mul}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AnimationCenter>
  );
}

const AnimationCenter = styled.div`
  position: relative;
  animation-name: ${animationCenter};
  animation-duration: 1s;
`;
const animationCenter = keyframes`
 0% {
    opacity: 0;
    width: 0;
    height:0;
  }
  100% {
    opacity: 1;
    width: 100vw;
    height:100vh;
  }`;
