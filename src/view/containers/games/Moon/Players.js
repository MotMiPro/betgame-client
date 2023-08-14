import React, { useCallback, useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { moonSocketSubscriber } from "~/customHooks/useSocket";
import { socketTypes } from "~/settings/config";
import { ColWrapper } from "~/view/UI/components/antComponents";
import iconLogo from "~/assets/images/icon-logo.png";
import { subNameCode } from "~/view/UI/components/AmountUI";
import { isMobile } from "react-device-detect";
import { appColor, moonGameAllStates } from "~/settings/constants";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";

let arrtemp = [];
function Players(props) {
  const { listHeight } = props;
  let timeout = null;
  const [players, setPlayers] = useState([]);

  const playerLength = useRef(0);
  const amountSum = useRef(0);

  const handleRenderPlayers = useCallback(
    (player, isFinish = false) => {
      if (!!player) {
        const found = arrtemp.find((item) => item?.userId === player?.userId);
        if (found) {
          arrtemp[arrtemp.findIndex((el) => el.userId === player.userId)] =
            player;
          setPlayers([...arrtemp]);
        } else {
          arrtemp.push(player);
          playerLength.current = arrtemp.length;
          amountSum.current =
            arrtemp.reduce((sum, { amount }) => sum + amount, 0).toFixed(2) ??
            0;
          let result = arrtemp.sort((a, b) => b.amount - a.amount);
          setPlayers([...result]);
        }
      } else {
        if (isFinish) {
          const cashOutPlayers = arrtemp.reduce((arr, item) => {
            if (item.multiplier === 0) {
              item.state = moonGameAllStates["CASHOUT"];
            }
            arr.push(item);

            return arr;
          }, []);

          setPlayers([...cashOutPlayers]);
        }
      }
    },
    [arrtemp]
  );

  useEffect(() => {
    moonSocketSubscriber(socketTypes.MOON_PLAYER, (data) => {
      const player = data?.user;
      handleRenderPlayers(player);
    });
  }, []);

  useEffect(() => {
    moonSocketSubscriber(socketTypes.MOON_STATE_FINISH, () => {
      amountSum.current = 0;
      playerLength.current = 0;
      handleRenderPlayers(null, true);
      timeout = setTimeout(() => {
        setPlayers([]);
        arrtemp = [];
        handleRenderPlayers(null, false);
      }, 3000);
    });
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AttchBg xs={24} md={8} xl={8}>
      <div
        style={{
          color: appColor.white,
          display: "flex",
          justifyContent: "center",
          fontWeight: "bold",
          flexDirection: "column",
        }}
      >
        <div style={{ width: "100%", position: "relative" }}>
          <Titlememo
            players={playerLength.current}
            amounts={amountSum.current}
          />

          <OverFlowMobile
            isMobile={isMobile}
            style={{
              top: 30,
              maxHeight: isMobile ? "auto" : listHeight - 30,
              overflow: "scroll",
            }}
          >
            {players?.length > 0 &&
              players
                // .sort((a, b) => (b.multiplier > a.multiplier ? 1 : -1))
                .map(
                  ({ amount, userName, multiplier, state, userId, profit }) => {
                    return (
                      <AnimatedWrapper key={userId}>
                        <FlexPlayers
                          style={{
                            backgroundColor: turnColor(state, multiplier).bg,
                            color: turnColor(state, multiplier).text,
                            transition: "all .5s ease-in-out",
                          }}
                        >
                          <LabelItem>
                            <span>
                              <i className="fas fa-rocket" />
                            </span>
                            <span style={{ marginLeft: 5 }}>
                              {subNameCode(userName)}
                            </span>
                          </LabelItem>
                          <LabelItem>{amount}</LabelItem>
                          <LabelItem>
                            {multiplier ? `x${multiplier}` : `-`}
                          </LabelItem>
                          <LabelItem>{profit}</LabelItem>
                        </FlexPlayers>
                      </AnimatedWrapper>
                    );
                  }
                )}
          </OverFlowMobile>
        </div>
      </div>
    </AttchBg>
  );
}

export default React.memo(Players);

const Titlememo = React.memo((props) => {
  const intl = useIntl();
  const { players, amounts } = props;
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        inset: 0,
        height: 30,
      }}
    >
      <FlexPlayers
        style={{
          backgroundColor: "rgba(29, 165, 122,.3)",
          paddingLeft: 5,
          paddingRight: 5,
          textTransform: "capitalize",
        }}
      >
        <span>
          <span>Players</span>
          <span
            style={{
              marginLeft: 2,
              border: `1px solid white`,
              borderRadius: 3,
              padding: "0 5px",
            }}
          >
            {players}
          </span>
        </span>

        <span>
          <span>{intl.formatMessage(translationsComponents.AMOUNT_TAB)}</span>
          <span
            style={{
              marginLeft: 2,
              border: `1px solid white`,
              borderRadius: 3,
              padding: "0 5px",
            }}
          >
            {amounts}
          </span>
        </span>
        <span>@</span>
        <span>{intl.formatMessage(translationsComponents.PROFIT_TAB)}</span>
      </FlexPlayers>
    </div>
  );
});

const LabelItem = styled.span`
  padding: 0px 3px;
`;

const turnColor = (state, multiplier) => {
  if (state === moonGameAllStates["CASHOUT"] && multiplier > 0) {
    return { bg: "#d9efee", text: "#2BAB5F" };
  } else if (state === moonGameAllStates["CASHOUT"] && !multiplier) {
    return { bg: "#F9ECEA", text: "#C33C30" };
  }
  return { bg: "#34363D", text: "#fff" };
};

const AttchBg = styled(ColWrapper)`
  &::before {
    content: "";
    background-image: url(${iconLogo});
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0.05;
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
  }
`;

const OverFlowMobile = styled.div`
  position: relative;
  max-height: ${(props) => (props.isMobile ? "100px" : "auto")};
  height: 100%;
  overflow-y: auto;
`;

const AnimatedWrapper = styled.div`
  position: relative;
  animation: ${() =>
    css`
      ${noname} .3s
    `};
  animation-fill-mode: forwards;
`;

const FlexPlayers = styled.div`
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 2px;
  margin-bottom: 1px;

  span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    &:nth-child(1) {
      flex: 1 1 25%;
    }
    &:nth-child(2) {
      flex: 1 1 40%;
      text-align: center;
    }
    &:nth-child(3) {
      flex: 1 1 15%;
      text-align: right;
    }
    &:nth-child(4) {
      flex: 1 1 20%;
      text-align: right;
    }
  }
`;

const noname = keyframes`
0% {
    right: -150px;
    opacity: 0;
  }
  100% {
    right: 0px;
    opacity: 1;
  }
`;
