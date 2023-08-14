import React, { createContext, useState } from "react";
import { newDiceBtnStatusCode } from "~/settings/constants";
export const GameContext = createContext();

export const GameContextProvider = (props) => {
  const [modalNewDice, setModalNewDice] = useState({
    latY: 0,
    longX: 0,
    isWin: false,
    rollStep: 0,
    isEnd: false,
    isAuto: false,
    multiplier: 0,
    rollNumbers: [],
    btnClick: false,
    isFinishRoll: false,
    hasSoundEffect: false,
    isAbsoluteWin: "NONE",
    btnCode: newDiceBtnStatusCode["ROLL"],
  });

  return (
    <GameContext.Provider value={{ modalNewDice, setModalNewDice }}>
      {props.children}
    </GameContext.Provider>
  );
};
