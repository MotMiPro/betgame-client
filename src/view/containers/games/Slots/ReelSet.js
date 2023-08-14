import { appColor, Constants } from "~/settings/constants";
import { iconCollection } from "~/settings/config";
import { RootContext } from "~/contextAPI/Authen";
import styled, { css, keyframes } from "styled-components";
import React, { forwardRef, useContext, useImperativeHandle } from "react";

let timerLoop = 0.4;

const ReelSet = forwardRef((props, ref) => {
  const { width, height, handleListenAnimatedEnd, handleListenAnimatedStart } =
    props;
  const { slotsSetting } = useContext(RootContext);
  const coinList = slotsSetting?.winList;
  const isAnimateNumbers = slotsSetting?.isAnimateNumbers;
  const infiniteRun = slotsSetting?.infiniteRun;

  const handleSpin = () => {};

  useImperativeHandle(ref, () => ({
    spin: () => handleSpin(),
  }));

  return (
    <div
      style={{
        height: height,
        overflow: "hidden",
        width: width,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        zIndex: 2,
        position: "relative",
      }}
      id="bit-coin"
    >
      {coinList.map((item, idx) => {
        const heighCal = height / Constants.REELS;
        const widthCal = width / Constants.REELS;
        return (
          <ColCoinWrapper
            style={{
              height: height,
              transition: "all .5s cubic-bezier(0.3, 0, 0, 1)",
            }}
            key={idx}
            timer={timerLoop}
            delay={idx}
            infiniteRun={infiniteRun}
            onAnimationEnd={idx === 2 ? handleListenAnimatedEnd : null}
            onAnimationStart={idx === 0 ? handleListenAnimatedStart : null}
          >
            <CoinWrapper
              style={{
                width: widthCal,
                height: heighCal,
                transition: "all .5s cubic-bezier(0.3, 0, 0, 1)",
              }}
              className={isAnimateNumbers ? "current" : "none"}
            >
              {item.map((coin, i) => {
                return (
                  <ImgWrapper
                    style={{
                      height: heighCal,
                      transition: "all .5s ease",
                      padding: "15px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 3,
                      width: heighCal,
                      backgroundColor: appColor.darkgray,
                    }}
                    key={i}
                  >
                    <div
                      style={{
                        height: (heighCal * 2) / 3,
                        width: "100%",
                      }}
                      className={coin.class}
                    >
                      <img
                        src={getImage(coin.num)}
                        style={{
                          height: "100%",
                          width: "100%",
                        }}
                      />
                    </div>
                  </ImgWrapper>
                );
              })}
            </CoinWrapper>
          </ColCoinWrapper>
        );
      })}
    </div>
  );
});

export default ReelSet;

const ImgWrapper = styled.div`
  margin: 0px auto;
  .coin-current {
  }
`;

const ColCoinWrapper = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  border-right: 1px solid #34363d;
  .current {
    transform-origin: top;
    animation: ${(props) =>
      css`
        ${transByY} ${props.timer}s ${props.infiniteRun} ${props.delay /
        3}s linear
      `};
  }
`;

const CoinWrapper = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const transByY = keyframes`
  0%{
    top: -650px;
  }
  100% {
    top: 0;
  }
`;

const getImage = (num) => {
  switch (parseInt(num)) {
    case 0:
      return iconCollection[0];
    case 1:
      return iconCollection[1];
    case 2:
      return iconCollection[2];
    case 3:
      return iconCollection[3];
    case 4:
      return iconCollection[4];
    case 5:
      return iconCollection[5];

    default:
      return iconCollection[2];
  }
};
