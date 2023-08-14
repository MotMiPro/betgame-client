import React, { useEffect, useState } from "react";
import MainGame from "./MainGame";
import DiceTable from "./DiceTable";
import { MutualWrap } from "~/view/UI/reuseAbles";
import { useSelector } from "react-redux";
import {
  disconnectSocket,
  disconnectSocketNewDice,
  initiateSocket,
  initiateSocketNewDice,
} from "~/customHooks/useSocket";
import { withHeader } from "~/ultils/formatHeader";

function NewDice() {
  const [isconnected, setIsconnected] = useState(false);
  const { userInfos } = useSelector((state) => state.userReducer);

  useEffect(() => {
    initiateSocketNewDice(withHeader(userInfos?._token), (status) =>
      setIsconnected(status)
    );
    return () => disconnectSocketNewDice();
  }, []);

  useEffect(() => {
    initiateSocket(withHeader(userInfos?._token), () => {});
    return () => disconnectSocket();
  }, []);

  return (
    isconnected && (
      <MutualWrap style={{ overflowX: "hidden" }}>
        <MainGame />
        <DiceTable />
      </MutualWrap>
    )
  );
}

export default NewDice;
