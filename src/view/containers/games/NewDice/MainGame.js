import { useForm } from "antd/lib/form/Form";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { RootContext } from "~/contextAPI/Authen";
import { GameContext } from "~/contextAPI/GameManager";
import { useExceptions } from "~/customHooks/useExceptions";
import {
  newDiceSocketEmitter,
  newDiceSocketSubscriber,
} from "~/customHooks/useSocket";
import translationsComponents from "~/languageProvider/translateKeys";
import { socketTypes } from "~/settings/config";
import {
  ENOUGHBALANCE_CODE,
  newDiceBtnStatusCode,
  USDT,
} from "~/settings/constants";
import NotifyToSignUpgame from "~/view/presentations/games/NotifyToSignUpgame";
import { ScreenView } from "~/view/UI/components";
import AccountBalance from "../BalanceInGame";
import GameForm from "./GameForm";
import wingame from "~/assets/audios/newDice/newDiceWin.wav";
import losegame from "~/assets/audios/newDice/newDiceLose.wav";

function MainGame() {
  let timeout = null;
  const intl = useIntl();
  const [form] = useForm();
  const history = useHistory();
  const isautoRoll = useRef(false);
  const initAmount = useRef(0);
  const winRate = useRef(0);
  const lossRate = useRef(0);

  const { setCurrentBalance, setModalObject } = useContext(RootContext);
  const { setModalNewDice, modalNewDice } = useContext(GameContext);
  const { userInfos } = useSelector((state) => state.userReducer);
  const { handleException } = useExceptions();
  const [tempData, setTempData] = useState(null);
  const [tempAmount, setTempAmount] = useState(null);
  const { hasSoundEffect } = modalNewDice;

  const newDiceWin = new Audio(wingame);
  const newDiceLose = new Audio(losegame);

  const handleRoll = async (values) => {
    let parseAmount = parseFloat(values?.amount) ?? 0;
    if (Number.isNaN(parseAmount)) {
      return;
    }
    if (!parseAmount) {
      form.setFields([
        {
          name: "amount",
          errors: [intl.formatMessage(translationsComponents.REQUIRED_ERROR)],
        },
      ]);
      return;
    }
    if (userInfos) {
      if (values?.isAuto) {
        isautoRoll.current = true;
        setModalNewDice((prevState) => ({
          ...prevState,
          btnCode: newDiceBtnStatusCode["STOP"],
        }));

        initAmount.current = parseFloat(parseAmount);
        lossRate.current = values?.loss;
        winRate.current = values?.win;
        parseAmount = form.getFieldValue("amount");
      }
      values.amount = parseAmount;
      setTempAmount(values);
      handleEmitSocket(values);
    }
    if (!userInfos) {
      setModalObject((modalObject) => ({
        ...modalObject,
        state: true,
        modalContent: (
          <NotifyToSignUpgame
            setModalObject={setModalObject}
            history={history}
          />
        ),
        title: null,
      }));
    }
  };

  useEffect(() => {
    newDiceSocketSubscriber(socketTypes.NEW_DICE_LAST_GAME, (data) => {
      if (!!data) {
        const { numbers } = data;
        setModalNewDice((prevState) => ({
          ...prevState,
          rollNumbers: numbers,
        }));
      }
    });
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    newDiceSocketSubscriber(socketTypes.NEW_DICE_RESULT, (data) => {
      if (!!data) {
        setTempData(data);
        const { newNumbers } = data;
        if (newNumbers?.length) {
          const checkLength = newNumbers?.length;
          switch (checkLength) {
            case 1:
              const { xRand, yRand } = turnLongLat(newNumbers[0]);
              rotateByValue(xRand, yRand);
              break;
            case 2:
              const { xRand: x, yRand: y } = turnLongLat(newNumbers[1]);
              rotateByValue(x, y);
              break;
            case 3:
              const { xRand: long, yRand: lat } = turnLongLat(newNumbers[2]);
              rotateByValue(long, lat);
              break;
            default:
              break;
          }
        }
      }
    });
  }, []);

  const rotateByValue = (x, y) => {
    const cube = document.getElementById("cube");
    if (cube) {
      cube.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
    }
  };

  const handleListenAnimatedEnd = () => {
    setModalNewDice((prevState) => ({
      ...prevState,
      isEnd: tempData?.isEnd,
      isWin: tempData?.isWin,
      isFinishRoll: false,
      multiplier: tempData?.multiplier,
      rollNumbers: tempData?.newNumbers,
      isAbsoluteWin:
        tempData?.isEnd && tempData?.isWin
          ? "WIN"
          : tempData?.isEnd && !tempData?.isWin
          ? "LOSE"
          : "NONE",
    }));
    if (tempData?.isEnd) {
      if (hasSoundEffect) {
        tempData?.isWin ? newDiceWin.play() : newDiceLose.play();
      }
    }
    setCurrentBalance([
      {
        amount: tempData?.balance,
        currency: USDT,
      },
    ]);

    if (tempData?.isEnd) {
      timeout = setTimeout(() => {
        setModalNewDice((prevState) => ({
          ...prevState,
          rollNumbers: [],
          isEnd: false,
          isWin: false,
          btnClick: false,
          isAbsoluteWin: "NONE",
        }));
      }, 2500);
    }
    if (!tempData?.isEnd) {
      setModalNewDice((prevState) => ({
        ...prevState,
        btnClick: false,
      }));
    }
    if (tempAmount?.isAuto) {
      if (tempData?.isEnd) {
        handleAutoAdvance(tempData);
        setTimeout(() => {
          if (!isautoRoll.current) return;
          handleEmitSocket(tempAmount);
        }, 4500);
      } else {
        setTimeout(() => {
          if (!isautoRoll.current) return;
          handleEmitSocket(tempAmount);
        }, 1000);
      }
    }
  };

  const handleEmitSocket = (values) => {
    newDiceSocketEmitter(
      socketTypes.NEW_DICE_PLAY,
      {
        accessToken: `Bearer ${userInfos?._token}`,
        amount: parseFloat(values?.amount) ?? 0,
        currency: USDT,
      },
      async (err) => {
        if (!!err) {
          const { fetchData } = await handleException(err);
          if (fetchData?.code === ENOUGHBALANCE_CODE) {
            form.setFields([
              {
                name: "amount",
                errors: [fetchData?.message],
              },
            ]);
          }
        }
      }
    );
    setModalNewDice((prevState) => ({
      ...prevState,
      isEnd: false,
      isWin: false,
      isFinishRoll: true,
      multiplier: 0,
      btnClick: true,
      isAbsoluteWin: "NONE",
    }));
  };

  const handleStopRoll = () => {
    isautoRoll.current = false;
    setModalNewDice((prevState) => ({
      ...prevState,
      btnCode: newDiceBtnStatusCode["ROLL"],
    }));
  };

  const handleSwitchAuto = (checked) => {
    if (checked) {
      setModalNewDice((prevState) => ({
        ...prevState,
        isAuto: checked,
        btnCode: newDiceBtnStatusCode["AUTO"],
      }));
      return;
    }
    if (!checked) {
      handleStopRoll();
    }
    setModalNewDice((prevState) => ({
      ...prevState,
      isAuto: checked,
      btnCode: newDiceBtnStatusCode["ROLL"],
    }));
  };

  const handleAutoAdvance = (result) => {
    const getWin = parseFloat(form.getFieldValue("win"));
    const getLoss = parseFloat(form.getFieldValue("loss"));
    const getNum = parseFloat(form.getFieldValue("numberAdvance"));
    form.setFieldsValue({
      numberAdvance: getNum > 0 ? getNum - 1 : 0,
    });
    if (getNum === 1) {
      handleStopRoll();
    }
    if (getLoss > 0 && getWin > 0) {
      if (result?.isWin) {
        turnAmountResult(winRate, result?.balance);
      }
      if (!result?.isWin) {
        turnAmountResult(lossRate, result?.balance);
      }
      return;
    }
    if (getWin > 0) {
      if (!result?.isWin) {
        form.setFieldsValue({
          amount:
            initAmount.current > result?.balance
              ? result?.balance
              : initAmount.current,
        });
      } else {
        turnAmountResult(winRate, result?.balance);
      }
      return;
    }
    if (getLoss > 0) {
      if (result?.isWin) {
        form.setFieldsValue({
          amount:
            initAmount.current > result?.balance
              ? result?.balance
              : initAmount.current,
        });
      } else {
        turnAmountResult(lossRate, result?.balance);
      }
      return;
    }
  };

  const turnAmountResult = (rate, balance) => {
    const amountFromFeild = form.getFieldValue("amount");
    const newAmount =
      parseFloat(amountFromFeild) +
      (parseFloat(amountFromFeild) * rate.current) / 100;
    const fixData = parseFloat(newAmount);
    form.setFieldsValue({
      amount: fixData > balance ? balance : fixData.toFixed(2),
    });
  };

  return (
    <ScreenView>
      <AccountBalance
        title={intl.formatMessage(translationsComponents.NEW_DICE)}
      />
      <section>
        <GameForm
          form={form}
          isautoRoll={isautoRoll.current}
          handleRoll={handleRoll}
          handleStopRoll={handleStopRoll}
          handleSwitchAuto={handleSwitchAuto}
          handleListenAnimatedEnd={handleListenAnimatedEnd}
        />
      </section>
    </ScreenView>
  );
}

export default React.memo(MainGame);

let flag = false;
const turnLongLat = (number, timeLoopX = 360 * 10, timeLoopY = 360 * 8) => {
  flag = !flag;
  let xArr, yArr, x, y, index;
  switch (number) {
    case 1:
      xArr = [4, 2];
      yArr = [0, 2];
      index = Math.floor(Math.random() * 2);
      x = xArr[index] * 90 + (flag ? timeLoopX : 0);
      y = yArr[index] * 90 + (flag ? timeLoopY : 0);
      return { xRand: x, yRand: y };

    case 2:
      xArr = [4, 2];
      yArr = [2, 0];
      index = Math.floor(Math.random() * 2);
      x = xArr[index] * 90 + (flag ? timeLoopX : 0);
      y = yArr[index] * 90 + (flag ? timeLoopY : 0);
      return { xRand: x, yRand: y };

    case 3:
      xArr = [4, 2];
      yArr = [3, 1];
      index = Math.floor(Math.random() * 2);
      x = xArr[index] * 90 + (flag ? timeLoopX : 0);
      y = yArr[index] * 90 + (flag ? timeLoopY : 0);
      return { xRand: x, yRand: y };

    case 4:
      xArr = [4, 2];
      yArr = [1, 3];
      index = Math.floor(Math.random() * 2);
      x = xArr[index] * 90 + (flag ? timeLoopX : 0);
      y = yArr[index] * 90 + (flag ? timeLoopY : 0);
      return { xRand: x, yRand: y };

    case 5:
      x = 3 * 90 + (flag ? timeLoopX : 0);
      y = Math.floor(Math.random() * 4) * 90 + (flag ? timeLoopY : 0);
      return { xRand: x, yRand: y };

    case 6:
      x = 1 * 90 + (flag ? timeLoopX : 0);
      y = Math.floor(Math.random() * 4) * 90 + (flag ? timeLoopY : 0);
      return { xRand: x, yRand: y };

    default:
      break;
  }
};

// const getRandom = (max, min) =>
//   Math.floor(Math.random() * (max - min) + min) * 90;

// function mod(n, m) {
//   return ((n % m) + m) % m;
// }

// function getResult(rotX, rotY) {
//   const countX = mod(rotX / 90, 4);
//   if (countX === 1) {
//     return 6;
//   }
//   if (countX === 3) {
//     return 5;
//   }
//   const countY = mod(rotY / 90 + countX, 4);
//   return [1, 4, 2, 3][countY];
// }
