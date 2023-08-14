import { MutualWrap } from "../../../UI/reuseAbles";
import React, { useEffect, useState } from "react";
import MainContent from "./GameContent";
import {
  diceDisconnectSocket,
  disconnectSocket,
  initiateSocket,
  initiatesocketDice,
} from "~/customHooks/useSocket";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";
import GameTable from "./GameTable";
import { useSelector } from "react-redux";
import { withHeader } from "~/ultils/formatHeader";

export default function DiceGame() {
  const intl = useIntl();
  const { userInfos } = useSelector((state) => state.userReducer);
  const [isconnected, setIsconnected] = useState(false);

  const titleGameDice = `${intl.formatMessage(
    translationsComponents.DICE_GAME
  )}`;

  useEffect(() => {
    initiatesocketDice(withHeader(userInfos?._token), (status) =>
      setIsconnected(status)
    );
    return () => diceDisconnectSocket();
  }, []);

  useEffect(() => {
    initiateSocket(withHeader(userInfos?._token), () => {});
    return () => disconnectSocket();
  }, []);

  return (
    isconnected && (
      <MutualWrap>
        <MainContent title={titleGameDice} />
        <GameTable />
      </MutualWrap>
    )
  );
}
