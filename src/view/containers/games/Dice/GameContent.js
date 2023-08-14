import React, {
  useEffect,
  useCallback,
  useState,
  useContext,
  Fragment,
  useRef,
} from "react";
import AccountBalance from "../BalanceInGame";
import GameActions from "./GameActions";
import { ScreenView } from "../../../UI/components";
import { RootContext } from "~/contextAPI/Authen";
import { socketTypes } from "~/settings/config";
import { parseCurrency } from "~/ultils/currency";
import { useSelector } from "react-redux";
import { useForm } from "antd/lib/form/Form";
import {
  diceSocketEmitter,
  diceSocketSubscriber,
} from "~/customHooks/useSocket";

import { useHistory } from "react-router";
import { USDT } from "~/settings/constants";
import { playDiceGameDemo } from "./diceGameDemo";
import gameNotify from "~/assets/audios/diceSoundEffects/gameNotify.mp3";
import NotifyToSignUpgame from "~/view/presentations/games/NotifyToSignUpgame";
import changeCurrency from "~/assets/audios/diceSoundEffects/changeCurrency.mp3";
import { useExceptions } from "~/customHooks/useExceptions";
import translationsComponents from "~/languageProvider/translateKeys";
import { useIntl } from "react-intl";

let soundEffectGlobal = false;

let amountIngame = 0;

function MainContent(props) {
  const intl = useIntl();
  let timeOut = null;
  const { title } = props;
  const [form] = useForm();
  const history = useHistory();

  const [isAuto, setIsAuto] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [autoData, setAutoData] = useState(null);
  const [resultCost, setResultCost] = useState(0);
  const [isAutoRoll, setisAutoRoll] = useState(false);
  const [isVisibleCost, setIsVisibleCost] = useState(false);
  const [isHasNumAuto, setisHasNumAuto] = useState(true);

  const [hasSoundEffect, setHasSoundEffect] = useState(false);

  const { handleException } = useExceptions();

  const initAmount = useRef(0);
  const winRate = useRef(0);
  const lossRate = useRef(0);
  const count = useRef(0);

  const { currentBalance, setCurrentBalance, setModalObject, setIsDeposit } =
    useContext(RootContext);
  const { userInfos } = useSelector((state) => state.userReducer);
  const audioCurrency = new Audio(changeCurrency);
  const audioNotify = new Audio(gameNotify);
  amountIngame = currentBalance?.length > 0 && currentBalance[0]?.amount;

  function handleSolveDiceResult(data) {
    setIsSubmit(false);
    setCurrentBalance([
      {
        amount: data?.balance,
        currency: USDT,
      },
    ]);
    amountIngame = data?.balance;
    if (data?.roll) {
      setResultCost(parseCurrency(data?.roll));
      const getAuto = form.getFieldValue("isAuto");
      if (getAuto) {
        handleAutoAdvance(data);
      }
    }
    if (soundEffectGlobal) {
      if (data?.isWin) {
        audioCurrency.play();
      }
      if (!data?.isWin) {
        audioNotify.play();
      }
    }
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      setIsVisibleCost(false);
    }, 4000);
  }

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

  const handleRoll = (values) => {
    let amountValue = values?.amount;
    if (!amountValue) {
      form.setFields([
        {
          name: "amount",
          errors: [intl.formatMessage(translationsComponents.REQUIRED_ERROR)],
        },
      ]);
      return;
    }
    if (parseFloat(amountValue) === 0 || amountIngame === 0) {
      setIsDeposit(true);
      handleStopRoll();
    } else {
      setIsVisibleCost(true);
      if (values?.isAuto) {
        const rollNumber = values?.numberAdvance;
        if (!rollNumber) {
          form.setFields([
            {
              name: "numberAdvance",
              errors: [
                intl.formatMessage(translationsComponents.REQUIRED_ERROR),
              ],
            },
          ]);
          return;
        }
        setisAutoRoll(true);
        lossRate.current = values?.loss;
        winRate.current = values?.win;
        initAmount.current = parseFloat(values?.amount);
        amountValue = form.getFieldValue("amount");
        const getNum =
          form.getFieldValue("numberAdvance") > 0
            ? form.getFieldValue("numberAdvance")
            : 10000;
        if (getNum > 0) {
          setisHasNumAuto(true);
        } else {
          setisHasNumAuto(false);
        }
      }
      setAutoData(values);
      setIsSubmit(true);
      if (userInfos) {
        diceSocketEmitter(
          socketTypes.DICE_PLAY,
          {
            accessToken: `Bearer ${userInfos?._token}`,
            amount: parseFloat(amountValue),
            currency: USDT,
            target: parseFloat(values?.target),
            multiplier: parseFloat(values?.multiplier),
            winChance: parseFloat(values?.winChance),
            isRollOver: values?.isRollOver,
          },
          async (err) => {
            if (!!err) {
              setIsSubmit(false);
              const { fetchData } = await handleException(err);
              if (fetchData?.code === "WSER002") {
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
        timeOut = setTimeout(() => {
          setIsSubmit(false);
        }, 10000);
      }
      // trial
      if (!userInfos) {
        const resultDemo = playDiceGameDemo(
          currentBalance[0].amount,
          parseFloat(values?.target),
          values?.isRollOver,
          parseFloat(amountValue),
          parseFloat(values?.multiplier)
        );
        if (resultDemo) {
          if (
            count.current === 5 ||
            count.current === 15 ||
            count.current > 30
          ) {
            handleStopRoll();
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
          count.current += 1;
          handleSolveDiceResult(resultDemo);
        }
      }
    }
  };

  const handleStopRoll = useCallback(() => {
    setAutoData(null);
    setisAutoRoll(false);
    timeOut = setTimeout(() => {
      setIsVisibleCost(false);
    }, 5000);
  });

  const handleSwitchAuto = useCallback((checked) => {
    setIsAuto(checked);
  });

  useEffect(() => {
    let timeval = null;
    if (isAutoRoll && !isSubmit && autoData !== null && isHasNumAuto) {
      timeval = setInterval(() => {
        handleRoll(autoData);
      }, 2000);
    }
    return () => {
      clearInterval(timeval);
      clearTimeout(timeOut);
    };
  }, [autoData, isAutoRoll, isHasNumAuto]);

  useEffect(() => {
    diceSocketSubscriber(socketTypes.DICE_RESULT, (data) => {
      handleSolveDiceResult(data);
    });
  }, []);

  return (
    <Fragment>
      <ScreenView>
        <AccountBalance title={title} />
        <GameActions
          form={form}
          isAuto={isAuto}
          balance={currentBalance}
          isAutoRoll={isAutoRoll}
          resultCost={resultCost}
          handleRoll={handleRoll}
          isVisibleCost={isVisibleCost}
          handleStopRoll={handleStopRoll}
          handleSwitchAuto={handleSwitchAuto}
          hasSoundEffect={hasSoundEffect}
          isSubmit={isAutoRoll ? null : isSubmit}
          handleControlSound={() => {
            setHasSoundEffect((state) => !state);
            soundEffectGlobal = !soundEffectGlobal;
          }}
        />
      </ScreenView>
    </Fragment>
  );
}
export default React.memo(MainContent);
