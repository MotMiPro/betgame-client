import { useIntl } from "react-intl";
import GameContent from "./MainContent";
import SLotGameTable from "./SLotGameTable";
import React, { useEffect, useState } from "react";
import { MutualWrap } from "../../../UI/reuseAbles";
import {
  disconnectSocket,
  initiateSocket,
  initiatesocketSlot,
  slotDisconnectSocket,
} from "~/customHooks/useSocket";
import translationsComponents from "~/languageProvider/translateKeys";
import { useSelector } from "react-redux";
import { withHeader } from "~/ultils/formatHeader";

export default function SlotsGame() {
  const intl = useIntl();
  const { userInfos } = useSelector((state) => state.userReducer);
  const [isconnected, setIsconnected] = useState(false);

  useEffect(() => {
    initiatesocketSlot(withHeader(userInfos?._token), (status) =>
      setIsconnected(status)
    );
    return () => slotDisconnectSocket();
  }, []);

  useEffect(() => {
    initiateSocket(withHeader(userInfos?._token), () => {});
    return () => disconnectSocket();
  }, []);

  return isconnected ? (
    <MutualWrap style={{ overflowX: "hidden" }}>
      <GameContent
        title={intl.formatMessage(translationsComponents.SLOTS_GAME)}
      />
      <SLotGameTable />
    </MutualWrap>
  ) : null;
}
