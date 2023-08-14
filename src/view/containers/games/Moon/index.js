import {
  disconnectSocket,
  initiateSocket,
  initiateSocketMoon,
  moonDisconnectSocket,
} from "~/customHooks/useSocket";
import GamePlay from "./GamePlay";
import MoonTable from "./moonTable";
import { useSelector } from "react-redux";
import { MutualWrap } from "../../../UI/reuseAbles";
import React, { useEffect, useState } from "react";
import { withHeader } from "~/ultils/formatHeader";

export default function MoonGame() {
  const { userInfos } = useSelector((state) => state.userReducer);
  const [isconnected, setIsconnected] = useState(false);

  useEffect(() => {
    initiateSocketMoon(withHeader(userInfos?._token), (status) =>
      setIsconnected(status)
    );
    return () => moonDisconnectSocket();
  }, []);

  useEffect(() => {
    initiateSocket(withHeader(userInfos?._token), () => {});
    return () => disconnectSocket();
  }, []);

  return (
    isconnected && (
      <MutualWrap style={{ overflowX: "hidden" }}>
        <GamePlay />
        <MoonTable />
      </MutualWrap>
    )
  );
}
