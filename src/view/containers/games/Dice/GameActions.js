import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { useIntl } from "react-intl";
import styled from "styled-components";
import tick from "~/assets/audios/mutualGameSounds/tick.wav";
import translationsComponents from "~/languageProvider/translateKeys";
import { parseCurrency } from "~/ultils/currency";
import { turnResponsive } from "~/view/presentations/games/gameSetting";
import { AmountShortcus, TargetShortcus } from "~/view/UI/components/GameIcons";
import { SpeakerComponent } from "~/view/UI/components/SpeakerComponent";
import { appColor } from "../../../../settings/constants";
import GameAutoSetting from "../../../presentations/games/GameAutoSetting";
import { ScreenView } from "../../../UI/components";
import {
  ButtonWrapper,
  ColWrapper,
  FormItemWrapper,
  FormWrapper,
  InputNumberWrapper,
  RowWrapper,
  SliderWrapper,
  SwitchWrapper,
} from "../../../UI/components/antComponents";

const maxValueSlider = 99.99;
const maxValue = 99;
let isRollOverGlobal = true;

let isRollOver = true;

function AccountActions(props) {
  const {
    form,
    isAuto,
    balance,
    isSubmit,
    resultCost,
    isAutoRoll,
    handleRoll,
    isVisibleCost,
    handleStopRoll,
    hasSoundEffect,
    handleSwitchAuto,
    handleControlSound,
  } = props;
  const intl = useIntl();

  const autoLabel = `${intl.formatMessage(
    translationsComponents.AUTO_PLAY_BTN
  )}`;
  const stopLabel = `${intl.formatMessage(
    translationsComponents.BUTTON_STOP_LABEL
  )}`;
  const rollLabel = `${intl.formatMessage(translationsComponents.PLAY_BTN)}`;

  const currentBalance = (balance?.length > 0 && balance[0].amount) ?? 0;

  const [mockFormValue, setMockFormValue] = useState({});
  const [isReder, setIsReder] = useState(false);
  const [rollValue, setRollValue] = useState(0);

  const audioTick = new Audio(tick);

  const color = useMemo(() =>
    turnColor(isRollOver, parseInt(resultCost), parseInt(rollValue))
  );

  const [sliderRoll, setSliderRoll] = useState({});

  const [isDisableLoss, setisDisableLoss] = useState(true);
  const [isDisableWin, setIsDisableWin] = useState(true);
  let timeout = null;

  const handleCalculator = useCallback(
    (value, type) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const win = isRollOver ? maxValueSlider - value : value;
        const multi = maxValue / win;
        const initObj = {
          winChance: win.toFixed(2),
          multiplier: multi.toFixed(2),
        };
        if (type) {
          initObj.target = value;
        }
        if (!type) {
          initObj.sliderRoll = value;
        }
        form.setFieldsValue(initObj);
      }, 300);
    },
    [isRollOver]
  );

  function handleChangeSlider(input) {
    setRollValue(input);
    handleCalculator(input, true);
  }

  function handleRollChange(input) {
    handleCalculator(input, false);
  }

  function handleWinChance(value) {
    if (!value) return;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const muls = maxValue / value;
      const roll = maxValueSlider - value;
      form.setFieldsValue({
        target: roll.toFixed(2),
        sliderRoll: roll.toFixed(2),
        multiplier: muls.toFixed(3),
      });
    }, 300);
  }

  const handleCalculatorMulti = (input) => {
    if (!input) return;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (isRollOverGlobal) {
        const win = maxValue / input;
        const roll = maxValueSlider - win;
        form.setFieldsValue({
          target: roll.toFixed(2),
          winChance: win.toFixed(2),
          sliderRoll: roll.toFixed(2),
        });
      } else {
        const winChance = maxValue / input;
        form.setFieldsValue({
          target: winChance.toFixed(2),
          winChance: winChance.toFixed(2),
          sliderRoll: winChance.toFixed(2),
        });
      }
    }, 300);
  };

  useEffect(() => {
    const multiTemp = 2;
    const win = maxValue / multiTemp;
    const roll = maxValueSlider - win;
    const result = handleCreateMock(
      {
        amount: currentBalance,
        winChance: win.toFixed(2),
        multiplier: multiTemp,
        target: roll.toFixed(2),
      },
      {
        handleCalculatorMulti,
        handleWinChance,
        handleRollChange,
        handleAmount,
        intl,
      }
    );
    setSliderRoll(roll.toFixed(2));
    setRollValue(roll.toFixed(2));
    setMockFormValue(result);
    setIsReder(true);
  }, [intl]);

  const handleAmount = (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (!value) {
        form.setFieldsValue({
          amount: currentBalance,
        });
      }
    }, 300);
  };

  const handleBtnMulti = (coe) => {
    hasSoundEffect && audioTick.play();
    const getAmount = form.getFieldValue("amount");
    if (!getAmount) return;
    const aMountSetter = coe * getAmount;
    if (coe === "max") {
      form.setFieldsValue({
        amount: currentBalance,
      });
      return;
    }
    if (coe === 2 && parseFloat(getAmount) * 2 >= parseFloat(currentBalance)) {
      form.setFieldsValue({
        amount: currentBalance,
      });
      return;
    }
    form.setFieldsValue({
      amount: aMountSetter.toFixed(2),
    });
  };

  const handleBtnRoll = () => {
    isRollOverGlobal = !isRollOverGlobal;
    hasSoundEffect && audioTick.play();
    const getTarget = form.getFieldValue("target");
    const result = (maxValueSlider - getTarget).toFixed(2);
    const winChangeValue = !isRollOver
      ? (maxValueSlider - parseFloat(result)).toFixed(2)
      : result;
    form.setFieldsValue({
      target: result,
      sliderRoll: result,
      isRollOver: !isRollOver,
      winChance: winChangeValue,
    });
    setRollValue(result);
    isRollOver = !isRollOver;
  };

  const handleChangeLoss = (checked) => {
    setisDisableLoss(!checked);
    if (!checked) {
      form.setFieldsValue({
        loss: 0,
      });
    }
  };
  const handleChangeWin = (checked) => {
    setIsDisableWin(!checked);
    if (!checked) {
      form.setFieldsValue({
        win: 0,
      });
    }
  };

  return (
    isReder && (
      <ScreenView>
        <div
          style={{ padding: "15px", width: "100%" }}
          className="game-actions"
        >
          <FormWrapper
            form={form}
            name="game-form"
            layout="vertical"
            onFinish={isAutoRoll ? handleStopRoll : handleRoll}
            initialValues={{
              numberAdvance: 5,
              win: 0,
              loss: 0,
            }}
          >
            <div style={{ position: "relative" }}>
              <FormItemWrapper
                name={["sliderRoll"]}
                initialValue={sliderRoll}
                style={{
                  position: "relative",
                  backgroundColor: appColor.bgPrimaryColor,
                  borderRadius: 5,
                  position: "relative",
                  width: "100%",
                }}
              >
                <SliderWrapper
                  min={2}
                  max={98}
                  isAutoRoll={isAutoRoll}
                  disabled={isAutoRoll}
                  isRollOver={isRollOver}
                  onChange={handleChangeSlider}
                />
              </FormItemWrapper>
              {isVisibleCost && (
                <RewardCost
                  color={color}
                  resultCost={resultCost}
                  isRollOver={isRollOver}
                  rollValue={rollValue}
                >
                  {resultCost}
                </RewardCost>
              )}
            </div>
            <RowWrapper
              gutter={8}
              align="center"
              justify="center"
              style={{ alignItems: "center" }}
            >
              <ColWrapper
                xs={24}
                md={4}
                xl={4}
                style={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormItemWrapper
                  name={["isAuto"]}
                  valuePropName="checked"
                  style={{ marginBottom: 5 }}
                >
                  <SwitchWrapper
                    disabled={isAutoRoll}
                    checkedChildren={
                      <span
                        style={{
                          textTransform: "capitalize",
                          whiteSpace: "nowrap",
                        }}
                      >{`${intl.formatMessage(
                        translationsComponents.SWITCH_AUTO
                      )}`}</span>
                    }
                    unCheckedChildren={
                      <span
                        style={{
                          textTransform: "capitalize",
                          whiteSpace: "nowrap",
                        }}
                      >{`${intl.formatMessage(
                        translationsComponents.SWITCH_MANUAL
                      )}`}</span>
                    }
                    onChange={handleSwitchAuto}
                  />
                </FormItemWrapper>
                {isMobile && (
                  <FormItemWrapper
                    style={{ marginBottom: 5, marginLeft: 15 }}
                    onClick={handleControlSound}
                  >
                    <SpeakerComponent isActive={hasSoundEffect} />
                  </FormItemWrapper>
                )}
              </ColWrapper>
              <ColWrapper xs={24} md={6} xl={6} style={{ textAlign: "center" }}>
                <FormItemWrapper style={{ marginBottom: 5, padding: 10 }}>
                  <ButtonWrapper
                    disabled={isSubmit}
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      fontWeight: 600,
                      height: 45,
                    }}
                    type="primary"
                    htmlType="submit"
                  >
                    {isAuto ? (isAutoRoll ? stopLabel : autoLabel) : rollLabel}
                  </ButtonWrapper>
                </FormItemWrapper>
              </ColWrapper>
              {!isMobile && (
                <ColWrapper
                  xs={24}
                  md={4}
                  xl={4}
                  style={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormItemWrapper
                    style={{ marginBottom: 5 }}
                    onClick={handleControlSound}
                  >
                    <SpeakerComponent isActive={hasSoundEffect} />
                  </FormItemWrapper>
                </ColWrapper>
              )}
            </RowWrapper>
            <RowWrapper
              gutter={16}
              justify="center"
              style={{ color: appColor.textWhiteColor }}
            >
              {mockFormValue &&
                Object.keys(mockFormValue).map((item, index) => {
                  const input = mockFormValue[item];
                  return (
                    <ColWrapper
                      xs={24}
                      sm={24}
                      md={turnResponsive(input.name)}
                      lg={turnResponsive(input.name)}
                      xl={turnResponsive(input.name)}
                      xxl={turnResponsive(input.name)}
                      key={index}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          flexWrap: "nowrap",
                          margin: "0 auto",
                          alignItems: "center",
                        }}
                      >
                        <FormItemWrapper
                          style={{
                            width: "100%",
                            position: "relative",
                          }}
                          label={
                            <label
                              style={{
                                color: appColor.textSecondaryColor,
                                textTransform: "uppercase",
                                fontWeight: "bold",
                                fontSize: 11,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {input.name === "target"
                                ? isRollOver
                                  ? input.label
                                  : `${intl.formatMessage(
                                      translationsComponents.ROLL_UNDER
                                    )}`
                                : input.label}
                            </label>
                          }
                          name={input.name}
                          initialValue={
                            input.name === "amount"
                              ? parseCurrency(1)
                              : parseCurrency(input.init)
                          }
                          rules={[
                            {
                              required: true,
                              message: `${intl.formatMessage(
                                translationsComponents.REQUIRED_ERROR
                              )}`,
                            },
                          ]}
                        >
                          <InputNumberWrapper
                            disabled={isAutoRoll}
                            min={setMinMax(true, input.name)}
                            max={
                              input.name === "amount"
                                ? currentBalance
                                : setMinMax(false, input.name)
                            }
                            step={input.step}
                            onChange={input.action}
                            className={
                              inputLists.includes(input.name)
                                ? "border-right-none"
                                : ""
                            }
                          />
                        </FormItemWrapper>
                        {input.name === "amount" && (
                          <AmountShortcus
                            handleBtnMulti={handleBtnMulti}
                            isDisabled={isAutoRoll}
                            mb={24}
                          />
                        )}
                        {input.name === "target" && (
                          <TargetShortcus
                            name="isRollOver"
                            isRollOver={isRollOver}
                            isDisabled={isAutoRoll}
                            handleBtn={handleBtnRoll}
                          />
                        )}
                      </div>
                    </ColWrapper>
                  );
                })}
            </RowWrapper>
            {isAuto && (
              <GameAutoSetting
                isAutoRoll={isAutoRoll}
                handleChangeLoss={handleChangeLoss}
                handleChangeWin={handleChangeWin}
                isDisableLoss={isDisableLoss}
                isDisableWin={isDisableWin}
              />
            )}
          </FormWrapper>
        </div>
      </ScreenView>
    )
  );
}

export default React.memo(AccountActions);

const inputLists = ["amount", "target"];

const setMinMax = (isMin, name) => {
  if (isMin) {
    switch (name) {
      case "amount":
        return 0;
      case "target":
        return 1.99;
      case "multiplier":
        return 1.01;
      case "winChance":
        return 1;

      default:
        return 0;
    }
  } else {
    switch (name) {
      case "winChance":
        return 98;
      case "multiplier":
        return 99;
      default:
        break;
    }
  }
};

const RewardCost = styled.div`
  position: absolute;
  left: ${(props) =>
    parseInt(props.resultCost) <= 0
      ? 0
      : `${Math.round(props.resultCost >= 99 ? 95 : props.resultCost - 2)}%`};
  background-color: ${(props) => props.color};
  padding: 5px 15px;
  border-radius: 5px;
  color: #fff;
  transition: all 0.5s ease-in-out;
  top: -35px;
  opacity: 1;
  z-index: 100;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 0;
    height: 0;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    border-top: ${(props) => `12px solid ${props.color}`};
    right: 0;
    margin: 0 auto;
    transition: all 0.5s ease-in-out;
  }
`;

const turnColor = (isOver, result, current) => {
  if (isOver && result >= current) {
    return appColor.textPrimaryColor;
  }
  if (!isOver && result <= current) {
    return appColor.textPrimaryColor;
  }
  if (!isOver && result >= current) {
    return appColor.gray;
  }
  return appColor.gray;
};

const handleCreateMock = (data, actions) => {
  const { amount, target, multiplier, winChance } = data;
  const {
    handleCalculatorMulti,
    handleWinChance,
    handleRollChange,
    handleAmount,
    intl,
  } = actions;
  return {
    amount: {
      label: `${intl.formatMessage(translationsComponents.BET_AMOUNT)}`,
      name: "amount",
      min: 0,
      step: 0.01,
      format: null,
      init: amount,
      action: handleAmount,
    },
    target: {
      label: `${intl.formatMessage(translationsComponents.ROLL_OVER)}`,
      name: "target",
      min: 1.99,
      step: 0.01,
      format: null,
      init: target,
      action: handleRollChange,
    },
    multiplier: {
      label: `${intl.formatMessage(translationsComponents.MULTIPLIERS_TAB)}`,
      name: "multiplier",
      min: 1.01,
      step: 0.001,
      format: "x",
      init: multiplier,
      action: handleCalculatorMulti,
    },
    winChance: {
      label: `${intl.formatMessage(translationsComponents.WIN_CHANCE)}`,
      name: "winChance",
      min: 1,
      step: 0.01,
      format: "%",
      init: winChance,
      action: handleWinChance,
    },
  };
};
