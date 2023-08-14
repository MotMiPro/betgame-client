import React from "react";
import { useIntl } from "react-intl";
import styled, { css, keyframes } from "styled-components";
import translationsComponents from "~/languageProvider/translateKeys";
import { appColor } from "~/settings/constants";

export const GameResult = ({ timeRoll }) => {
  const intl = useIntl();
  return (
    <ResultWrapper>
      <div className="round">
        <RollLabel>
          {`${intl.formatMessage(
            translationsComponents.BUTTON_ROLL_LABEL
          )} 1 :`}
        </RollLabel>
        {!!timeRoll[0] ? (
          <TurnDiceFace number={timeRoll[0]} />
        ) : (
          <span>
            <i className="fab fa-users" />
          </span>
        )}
      </div>
      <div className="round">
        <RollLabel>{`${intl.formatMessage(
          translationsComponents.BUTTON_ROLL_LABEL
        )} 2 :`}</RollLabel>
        {!!timeRoll[1] ? (
          <TurnDiceFace number={timeRoll[1]} />
        ) : (
          <span>
            <i className="fab fa-users" />
          </span>
        )}
      </div>
      <div className="round">
        <RollLabel>{`${intl.formatMessage(
          translationsComponents.BUTTON_ROLL_LABEL
        )} 3 :`}</RollLabel>
        {!!timeRoll[2] ? (
          <TurnDiceFace number={timeRoll[2]} />
        ) : (
          <span>
            <i className="fab fa-users" />
          </span>
        )}
      </div>
    </ResultWrapper>
  );
};

export const GameWin = ({ multiplier, isAbsoluteWin }) => {
  return (
    <div
      style={{
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        height: "100%",
        position: "absolute",
      }}
    >
      <div
        style={{
          fontSize: 22,
          height: "100%",
          color: "white",
          display: "flex",
          fontWeight: 700,
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,.5)",
        }}
      >
        <div style={{ textTransform: "uppercase", letterSpacing: 2 }}>
          {isAbsoluteWin === "WIN" && (
            <WinEffect>
              <div>you win</div>
              <div>
                <span>x</span>
                <span style={{ fontSize: 30 }}>{multiplier ?? 0}</span>
              </div>
            </WinEffect>
          )}
          {isAbsoluteWin === "LOSE" && <LoseEffect>you lose</LoseEffect>}
        </div>
      </div>
    </div>
  );
};

export const RollUnderOver = (props) => {
  const { getSum } = props;
  const intl = useIntl();
  return (
    <div>
      <RollStyleWrapper>
        <RoolStyle className={getSum > 6 ? "over" : "default"}>
          {intl.formatMessage(translationsComponents.OVER_LABEL)}
        </RoolStyle>
        <RoolStyle className={getSum <= 6 && getSum > 0 ? "under" : "default"}>
          {intl.formatMessage(translationsComponents.UNDER_LABEL)}
        </RoolStyle>
      </RollStyleWrapper>
    </div>
  );
};

export const GameDiceRule = (props) => {
  const intl = useIntl();
  const { activeValue = 0 } = props;
  return (
    <section>
      <MultiWrapper>
        {multis.map(({ label }, idx) => {
          return (
            <ChildMulti key={idx}>
              <FlexChild className={activeValue === label ? "active" : ""}>
                <h3>
                  {`${idx + 1} ${intl.formatMessage(
                    translationsComponents.BUTTON_ROLL_LABEL
                  )}`}{" "}
                </h3>
                <div className="btn">
                  <span>x</span>
                  <span style={{ marginLeft: 3 }}>{label}</span>
                </div>
              </FlexChild>
            </ChildMulti>
          );
        })}
      </MultiWrapper>
    </section>
  );
};

const RollLabel = styled.span`
  white-space: nowrap;
  margin-left: 10px;
  padding: 10px 5px;
  font-size: 12px;
  font-weight: 700;
`;

const RollStyleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  gap: 2px;
  .default {
    background-color: ${appColor.bgSecondaryColor};
  }
  .over {
    background-color: ${appColor.orangehighlight};
    box-shadow: 0 0 10px ${appColor.orangehighlight},
      0 0 40px ${appColor.orangehighlight}, 0 0 80px ${appColor.orangehighlight};
  }
  .under {
    background-color: ${appColor.orangehighlight};
    box-shadow: 0 0 10px ${appColor.orangehighlight},
      0 0 40px ${appColor.orangehighlight}, 0 0 80px ${appColor.orangehighlight};
  }
`;

const RoolStyle = styled.div`
  /* margin: 2px 0; */
  height: 100%;
  padding: 7px 15px;
  text-align: center;
  color: white;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
  border-radius: 3px 0 0 3px;
  transition: all 0.5s ease-in-out;
`;

const multis = [
  {
    label: 3.5,
  },
  {
    label: 1.95,
  },
  {
    label: 0.8,
  },
];

const MultiWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  gap: 10px;
`;

const FlexChild = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: whitesmoke;
  h3 {
    color: whitesmoke;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
  }
  .btn {
    /* border: 1px solid white; */
    padding: 2px 30px;
    border-radius: 3px;
    transition: all 0.2s ease-in-out;
    background-color: ${appColor.bgSecondaryColor};
    span {
      &:last-child {
        font-size: 20px;
      }
    }
  }
`;

const ChildMulti = styled.div`
  .active {
    .btn {
      background-color: ${appColor.orangehighlight};
      border: 1px solid ${appColor.orangehighlight};
      box-shadow: 0 0 10px ${appColor.orangehighlight},
        0 0 40px ${appColor.orangehighlight},
        0 0 80px ${appColor.orangehighlight};
    }
  }
`;

const WinEffect = styled.div`
  position: relative;
  text-align: center;
  text-shadow: 0 0 7px ${appColor.textPrimaryColor},
    0 0 10px ${appColor.textPrimaryColor}, 0 0 21px ${appColor.textPrimaryColor},
    0 0 42px #0fa, 0 0 82px #0fa, 0 0 92px #0fa, 0 0 102px #0fa, 0 0 151px #0fa;
  animation: ${() =>
    css`
      ${winAnimate} 1s
    `};
  animation-fill-mode: forwards;
`;
const LoseEffect = styled.div`
  position: relative;
  text-shadow: 0 0 7px ${appColor.sky}, 0 0 10px ${appColor.sky},
    0 0 21px ${appColor.sky}, 0 0 42px #0fa, 0 0 82px #0fa, 0 0 92px #0fa,
    0 0 102px #0fa, 0 0 151px #0fa;
  animation: ${() =>
    css`
      ${loseAnimate} 1s .8s
    `};
  animation-fill-mode: forwards;
`;

const winAnimate = keyframes`
0% {
  transform: scale(30);
  opacity: 0;
  }
100% {
    transform: scale(2);
    opacity: 1;
  }
`;
const loseAnimate = keyframes`
0% {
  transform: scale(1);
  opacity: 1;
  }
100% {
    transform: scale(30);
    opacity: 0;
  }
`;

const ResultWrapper = styled.div`
  display: flex;
  font-weight: 600;
  justify-content: center;
  color: ${appColor.white};
  text-transform: uppercase;
  flex-direction: column;
  .round {
    position: relative;
    display: flex;
    align-items: center;
    background-color: ${appColor.bgSecondaryColor};
    padding-right: 10px;
    margin-bottom: 1px;
    border-radius: 0 3px 3px 0;
  }
`;

export const TurnDiceFace = ({ number }) => {
  switch (number) {
    case 1:
      return <OnePoint />;
    case 2:
      return <TwoPoint />;
    case 3:
      return <ThreePoint />;
    case 4:
      return <FourPoint />;
    case 5:
      return <FivePoint />;
    case 6:
      return <SixPoint />;

    default:
      break;
  }
};

const SixPoint = () => {
  return (
    <FaceWrapp>
      <div className="flex-child">
        <div className="child">
          <DotStyle />
          <DotStyle />
          <DotStyle />
        </div>
        <div className="child">
          <DotStyle />
          <DotStyle />
          <DotStyle />
        </div>
      </div>
    </FaceWrapp>
  );
};
const FivePoint = () => {
  return (
    <FaceWrapp>
      <div className="flex-child">
        <div className="child">
          <DotStyle />
          <DotStyle />
        </div>
        <div className="child five">
          <DotStyle />
        </div>
        <div className="child">
          <DotStyle />
          <DotStyle />
        </div>
      </div>
    </FaceWrapp>
  );
};
const FourPoint = () => {
  return (
    <FaceWrapp>
      <div className="flex-child">
        <div className="child">
          <DotStyle />
          <DotStyle />
        </div>

        <div className="child">
          <DotStyle />
          <DotStyle />
        </div>
      </div>
    </FaceWrapp>
  );
};
const ThreePoint = () => {
  return (
    <FaceWrapp>
      <div className="flex-child">
        <div className="child end">
          <DotStyle />
        </div>
        <div className="child center">
          <DotStyle />
        </div>
        <div className="child start">
          <DotStyle />
        </div>
      </div>
    </FaceWrapp>
  );
};
const OnePoint = () => {
  return (
    <FaceWrapp>
      <div className="flex-child" style={{ justifyContent: "center" }}>
        <div className="center">
          <DotStyle />
        </div>
      </div>
    </FaceWrapp>
  );
};
const TwoPoint = () => {
  return (
    <FaceWrapp>
      <div className="flex-child">
        <div className="child start">
          <DotStyle />
        </div>
        <div className="child end">
          <DotStyle />
        </div>
      </div>
    </FaceWrapp>
  );
};

const FaceWrapp = styled.div`
  position: relative;
  transition: all.3s ease-in-out;
  width: 25px;
  overflow: hidden;

  .flex-child {
    display: flex;
    justify-content: space-between;
    background-color: ${appColor.textPrimaryColor};
    width: 25px;
    height: 25px;
    padding: 5px;
    border-radius: 3px;
    position: relative;
    animation: ${() =>
      css`
        ${animatebott} .5s
      `};
    animation-fill-mode: forwards;
    .child {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .five,
    .center {
      align-self: center;
    }
    .end {
      align-self: flex-end;
    }
    .start {
      align-self: flex-start;
    }
  }
`;

const animatebott = keyframes`
from {
    left: -50px;
    opacity: 0;
    transform: rotate(0deg);
  }
to {
    left: 0;
    opacity: 1;
    transform: rotate(360deg);
  }
`;

const DotStyle = styled.div`
  align-self: center;
  background-color: white;
  border-radius: 50%;
  height: 3px;
  justify-self: center;
  width: 3px;
`;
