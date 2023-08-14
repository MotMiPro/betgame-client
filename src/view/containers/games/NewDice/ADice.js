import React from "react";
import styled, { keyframes } from "styled-components";
import { appColor } from "~/settings/constants";

function ADice({ onTransitionEnd }) {
  return (
    <CubeWrapper className="container" id="container-dice">
      <div id="cube" className="cube" onTransitionEnd={onTransitionEnd}>
        <div className="side front">
          <span className="dot dot1" />
        </div>
        <div className="side back">
          <span className="dot dot1" />
          <span className="dot dot2" />
        </div>
        <div className="side right">
          <span className="dot dot1" />
          <span className="dot dot2" />
          <span className="dot dot3" />
        </div>
        <div className="side left">
          <div className="child">
            <span className="dot dot1" />
            <span className="dot dot2" />
          </div>
          <div className="child">
            <span className="dot dot3" />
            <span className="dot dot4" />
          </div>
        </div>
        <div className="side top">
          <div className="child">
            <span className="dot dot1" />
            <span className="dot dot2" />
          </div>
          <div className="child">
            <span className="dot dot3" />
          </div>
          <div className="child">
            <span className="dot dot4" />
            <span className="dot dot5" />
          </div>
        </div>
        <div className="side bottom">
          <div className="child">
            <span className="dot dot1" />
            <span className="dot dot2" />
            <span className="dot dot3" />
          </div>
          <div className="child">
            <span className="dot dot4" />
            <span className="dot dot5" />
            <span className="dot dot6" />
          </div>
        </div>
      </div>
    </CubeWrapper>
  );
}

export default React.memo(ADice);

const testRoll = keyframes`
	    0% { transform: translate3d(0px,0px,0px) }
	    30% { transform: translate3d(150px,-20px,0px) }
      50% { transform: translate3d(0px,-50px,0px) }
      80% { transform: translate3d(-150px,-20px,0px) }
	    100% { transform: translate3d(0px,0px,0px) }
`;

const CubeWrapper = styled.section`
  width: 100%;
  height: 100%;
  position: relative;
  perspective: 1000px;
  perspective-origin: 50% 100%;
  z-index: 2;
  /* transform-style: preserve-3d;
  animation: ${testRoll} 1s linear;
  .play {
    position: relative;
  } */
  .cube {
    width: 100px;
    height: 100px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 5s cubic-bezier(0.3, 0, 0, 1);
    margin: 0 auto;
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);

    .side {
      position: absolute;
      width: 100%;
      height: 100%;
      padding: 15px;
      border-radius: 15px;
      box-shadow: inset 0px 0px 40px rgb(102 102 102 / 50%);
      background: ${appColor.textPrimaryColor};
      /* border: 2px solid ${appColor.textPrimaryColor}; */
      .dot {
        align-self: center;
        background-color: whitesmoke;
        border-radius: 50%;
        box-shadow: inset -0.15rem 0.15rem 0.25rem rgb(0 0 0 / 50%);
        display: block;
        height: 1.15rem;
        justify-self: center;
        width: 1.15rem;
      }
    }

    .front {
      transform: rotateY(0deg) translateZ(50px);
      display: flex;
      justify-content: center;
    }
    .back {
      transform: rotateX(-180deg) translateZ(50px);
      display: flex;
      justify-content: space-between;
      flex-direction: column;

      span {
        display: block;
        &:nth-child(1) {
          align-self: flex-end;
        }
        &:nth-child(2) {
          align-self: flex-start;
        }
      }
    }
    .right {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      span {
        &:nth-child(1) {
          align-self: flex-end;
        }

        &:nth-child(3) {
          align-self: flex-start;
        }
      }
      transform: rotateY(90deg) translateZ(50px);
    }
    .left {
      display: flex;
      justify-content: space-between;
      .child {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      transform: rotateY(-90deg) translateZ(50px);
    }
    .top {
      display: flex;
      justify-content: space-between;
      .child {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        &:nth-child(2) {
          justify-content: center;
        }
      }

      transform: rotateX(90deg) translateZ(50px);
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      position: relative;
      .child {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      transform: rotateX(-90deg) translateZ(50px);
    }
  }
`;
