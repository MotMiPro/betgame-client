import React, {
  useContext,
  useEffect,
  useState,
  Fragment,
  useRef,
} from "react";
import { RootContext } from "~/contextAPI/Authen";
import { ScreenView } from "~/view/UI/components";
import SlotGameAction from "./SlotGameAction";
import { mockSlotData, socketTypes } from "~/settings/config";
import AccountBalance from "~/view/containers/games/BalanceInGame";
import { useForm } from "antd/lib/form/Form";

import { parseArr } from "~/ultils/excuse";
import { useHistory } from "react-router";
import { ENOUGHBALANCE_CODE, USDT } from "~/settings/constants";
import { playSLotsGameDemo } from "./slotGameDemo";
import { useSelector } from "react-redux";
import ding from "~/assets/audios/slotSoundEffects/ding.wav";
import multi from "~/assets/audios/slotSoundEffects/multi.wav";
import slotRun from "~/assets/audios/slotSoundEffects/slotRun.wav";
import {
  slotSocketEmitter,
  slotSocketSubscriber,
} from "~/customHooks/useSocket";
import { exceptionMessages, useExceptions } from "~/customHooks/useExceptions";
import NotifyToSignUpgame from "~/view/presentations/games/NotifyToSignUpgame";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";

let prevData = null;
let autoData = null;
let soundEffectGlobal = false;

function GameContent(props) {
  const intl = useIntl();
  const [form] = useForm();
  const gameRef = useRef(null);
  const count = useRef(0);

  const initAmount = useRef(0);
  const winRate = useRef(0);
  const lossRate = useRef(0);

  let timeoutSLot = null;
  const history = useHistory();
  const { title } = props;
  const {
    setBtnEvt,
    slotsSetting,
    currentBalance,
    setSlotsSetting,
    setCurrentBalance,
    setModalObject,
  } = useContext(RootContext);
  const { lines } = slotsSetting;

  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [hasSoundEffect, setHasSoundEffect] = useState(false);

  const { userInfos } = useSelector((state) => state.userReducer);

  const audioDing = new Audio(ding);
  const audioMulti = new Audio(multi);
  const audioSlotRun = new Audio(slotRun);
  const { handleException } = useExceptions();

  const handleSpin = async (values) => {
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
    if (lines * parseAmount > currentBalance[0].amount) {
      form.setFields([
        {
          name: "amount",
          errors: [exceptionMessages(intl)[ENOUGHBALANCE_CODE]],
        },
      ]);
      return;
    }

    if (soundEffectGlobal) {
      timeoutSLot = setTimeout(() => {
        audioSlotRun.play();
      }, 200);
    }
    if (values?.isAuto) {
      const rollNumber = values?.numberAdvance;
      if (!rollNumber) {
        form.setFields([
          {
            name: "numberAdvance",
            errors: [intl.formatMessage(translationsComponents.REQUIRED_ERROR)],
          },
        ]);
        return;
      }
      if (rollNumber) {
        setIsAutoSpin(true);
        autoData = values;
        initAmount.current = parseFloat(values?.amount);
        lossRate.current = values?.loss;
        winRate.current = values?.win;
        parseAmount = form.getFieldValue("amount");
      }
    }
    gameRef.current.spin();
    setBtnEvt((btn) => ({ ...btn, onClick: true }));

    const result = prevData?.numbers
      ? await parseArr(prevData?.numbers, prevData?.hits)
      : mockSlotData?.numbers;
    setSlotsSetting((setting) => ({
      ...setting,
      isAnimateNumbers: true,
      winList: result,
      infiniteRun: 100,
    }));

    if (userInfos) {
      slotSocketEmitter(
        socketTypes.SLOT_PLAY,
        {
          accessToken: `Bearer ${userInfos?._token}`,
          amount: parseAmount,
          currency: USDT,
          lines: values?.line ?? 1,
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
    }
    if (!userInfos && currentBalance[0].amount > 0) {
      const resultDemo = playSLotsGameDemo(
        currentBalance[0].amount,
        parseAmount,
        values?.line ?? 1
      );
      if (resultDemo) {
        if (count.current === 5 || count.current === 15 || count.current > 30) {
          handleStopAuto();
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
        timeoutSLot = setTimeout(() => {
          handleSpinWithData(resultDemo);
        }, 1500);
      }
    }
  };

  const handleSpinWithData = async (data) => {
    prevData = data;
    const resultFlatNumber = await parseArr(data?.numbers, data?.hits);
    setSlotsSetting((setting) => ({
      ...setting,
      isAnimateNumbers: true,
      winList: resultFlatNumber,
      infiniteRun: 8,
    }));
  };

  useEffect(() => {
    slotSocketSubscriber(socketTypes.SLOT_RESULT, (data) => {
      timeoutSLot = setTimeout(() => {
        handleSpinWithData(data);
      }, 1500);
    });
    return () => clearTimeout(timeoutSLot);
  }, [timeoutSLot]);

  const handleStopAuto = () => {
    autoData = null;
    setIsAutoSpin(false);
  };

  const handleListenAnimatedEnd = () => {
    if (!prevData) return;
    // play audio
    if (soundEffectGlobal) {
      if (prevData?.isWin) {
        audioMulti.play();
      } else {
        audioDing.play();
      }
    }

    setSlotsSetting((setting) => ({
      ...setting,
      multiList: attchListMulti(prevData?.multipliers),
    }));
    timeoutSLot = setTimeout(() => {
      setSlotsSetting((setting) => ({ ...setting, multiList: null }));
    }, 1000);
    setCurrentBalance([
      {
        amount: prevData?.balance,
        currency: USDT,
      },
    ]);
    setSlotsSetting((setting) => ({
      ...setting,
      isAnimateNumbers: false,
    }));
    setBtnEvt((btn) => ({ ...btn, onClick: false }));

    if (autoData !== null) {
      handleAutoAdvance(prevData);
      timeoutSLot = setTimeout(() => {
        handleSpin(autoData);
      }, 2000);
    }
    const getID = document.getElementById("bit-coin");
    if (getID) {
      getID.classList.add("bit-coin");
    }
  };

  const handleListenAnimatedStart = () => {
    setSlotsSetting((setting) => ({
      ...setting,
      highlightList: null,
      multiList: null,
    }));
    timeoutSLot = setTimeout(() => {
      const getID = document.getElementById("bit-coin");
      if (getID) {
        getID.classList.remove("bit-coin");
      }
    }, 800);
  };

  const handleAutoAdvance = (result) => {
    console.log({ result });
    const getWin = parseFloat(form.getFieldValue("win"));
    const getLoss = parseFloat(form.getFieldValue("loss"));
    const getNum = parseFloat(form.getFieldValue("numberAdvance"));
    form.setFieldsValue({
      numberAdvance: getNum > 0 ? getNum - 1 : 0,
    });
    if (getNum === 1) {
      handleStopAuto();
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
      <Fragment>
        <AccountBalance title={title} />
        <SlotGameAction
          form={form}
          ref={gameRef}
          balance={currentBalance}
          isAutoSpin={isAutoSpin}
          handleSpin={handleSpin}
          handleStopAuto={handleStopAuto}
          handleListenAnimatedEnd={handleListenAnimatedEnd}
          handleListenAnimatedStart={handleListenAnimatedStart}
          handleControlSound={() => {
            setHasSoundEffect((state) => !state);
            soundEffectGlobal = !soundEffectGlobal;
          }}
          hasSoundEffect={hasSoundEffect}
        />
      </Fragment>
    </ScreenView>
  );
}

export default React.memo(GameContent);

const attchListMulti = (arr) => {
  const lines = arr.length;
  switch (lines) {
    case 1:
      return [0, arr[0], 0];
    case 2:
      return [arr[0], arr[1], 0];

    case 3:
      return arr;

    default:
      return [0, 0, 0];
  }
};
