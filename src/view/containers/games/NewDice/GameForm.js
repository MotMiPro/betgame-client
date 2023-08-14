import React, { useContext, useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { useIntl } from "react-intl";
import styled, { css, keyframes } from "styled-components";
import tick from "~/assets/audios/mutualGameSounds/tick.wav";
import rollDice from "~/assets/audios/newDice/startRoll.mp3";
import { RootContext } from "~/contextAPI/Authen";
import { GameContext } from "~/contextAPI/GameManager";
import useAudio from "~/customHooks/useAudios";
import translationsComponents from "~/languageProvider/translateKeys";
import { appColor, newDiceBtnStatusCode } from "~/settings/constants";
import { parseCurrency } from "~/ultils/currency";
import GameAutoSetting from "~/view/presentations/games/GameAutoSetting";
import { ScreenView } from "~/view/UI/components";
import {
  ButtonWrapper,
  ColWrapper,
  FormItemWrapper,
  FormWrapper,
  InputNumberWrapper,
  RowWrapper,
  SwitchWrapper,
} from "~/view/UI/components/antComponents";
import { AmountShortcus } from "~/view/UI/components/GameIcons";
import { SpeakerComponent } from "~/view/UI/components/SpeakerComponent";
import { NewDiceRule } from "../GameRules";
import ADice from "./ADice";
import { GameDiceRule, GameResult, GameWin, RollUnderOver } from "./GameResult";

const rewardValue = ["WIN", "LOSE"];

function GameForm(props) {
  const intl = useIntl();
  const {
    form,
    handleRoll,
    isautoRoll,
    handleStopRoll,
    handleSwitchAuto,
    handleListenAnimatedEnd,
  } = props;
  const { currentBalance: balance, setModalObject } = useContext(RootContext);
  const { modalNewDice, setModalNewDice } = useContext(GameContext);
  const totalLabel = intl.formatMessage(translationsComponents.TOTAL_SCORE);

  const {
    rollNumbers,
    btnClick,
    hasSoundEffect,
    multiplier,
    isAbsoluteWin,
    btnCode,
    isAuto,
  } = modalNewDice;
  const { togglePlay: audioTick } = useAudio(tick);
  const { togglePlay } = useAudio(rollDice);
  const [isDisableLoss, setisDisableLoss] = useState(true);
  const [isDisableWin, setIsDisableWin] = useState(true);

  const btnLabel = useMemo(() => {
    switch (btnCode) {
      case newDiceBtnStatusCode["ROLL"]:
        return `${intl.formatMessage(translationsComponents.PLAY_BTN)}`;
      case newDiceBtnStatusCode["STOP"]:
        return `${intl.formatMessage(
          translationsComponents.BUTTON_STOP_LABEL
        )}`;
      case newDiceBtnStatusCode["AUTO"]:
        return `${intl.formatMessage(translationsComponents.AUTO_PLAY_BTN)}`;
      default:
        return `${intl.formatMessage(translationsComponents.PLAY_BTN)}`;
    }
  }, [btnCode, intl]);

  const currentBalance = (balance?.length > 0 && balance[0].amount) ?? 0;

  const getSum = useMemo(() =>
    rollNumbers?.length > 0 ? rollNumbers.reduce((acc, num) => acc + num, 0) : 0
  );

  const handleBtnMulti = (value) => {
    hasSoundEffect && audioTick();
    const getAmount = form.getFieldValue("amount");
    if (getAmount >= currentBalance && (value === 2 || value === "max")) {
      form.setFieldsValue({
        amount: currentBalance,
      });
      return;
    }
    const amountValue =
      value === "max" ? currentBalance : (getAmount * value).toFixed(2);
    form.setFieldsValue({
      amount: amountValue,
    });
  };

  useEffect(() => {
    const el = document.getElementById("cube");
    function startRoll() {
      if (hasSoundEffect) {
        togglePlay();
      }
    }
    if (el) {
      el.addEventListener("transitionstart", startRoll);
    }
    return () => el.removeEventListener("transitionstart", startRoll);
  }, [hasSoundEffect]);

  const handleOpenRuleNewDice = () => {
    setModalObject((modalObject) => ({
      ...modalObject,
      state: true,
      modalContent: (
        <div>
          <NewDiceRule />
        </div>
      ),
      title: `New Dice`,
    }));
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
    <ScreenView>
      <FormWrapper
        form={form}
        layout="vertical"
        onFinish={isautoRoll ? handleStopRoll : handleRoll}
        initialValues={{
          win: 0,
          loss: 0,
          numberAdvance: 5,
        }}
        className="game-actions"
      >
        <RowWrapper
          gutter={8}
          align="center"
          justify="center"
          style={{ alignItems: "center" }}
        >
          <ColWrapper xs={24} sm={3} md={3} xl={6} />
          <ColWrapper xs={24} sm={18} md={18} xl={12}>
            <CustomFormItemHeight
              style={{
                height: 350,
                width: "100%",
                position: "relative",
                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                backgroundColor: appColor.darkgray,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className={isAbsoluteWin === "WIN" ? "game-active" : ""}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 0,
                    right: 0,
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0 auto",
                      width: "max-content",
                      padding: "5px 20px",
                      borderRadius: 5,
                      textTransform: "uppercase",
                      backgroundColor: appColor.darkgray,
                    }}
                  >
                    <span
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: 500,
                        marginRight: 15,
                      }}
                    >{`${totalLabel}: `}</span>
                    <BagdeCustom>
                      <div className="trans">{getSum > 0 ? getSum : 0}</div>
                    </BagdeCustom>
                  </div>
                </div>
                <GameDisplay>
                  <GameResult timeRoll={rollNumbers} />
                </GameDisplay>
                <ADice onTransitionEnd={handleListenAnimatedEnd} />
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                  }}
                >
                  <RollUnderOver getSum={getSum} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 5,
                    left: 0,
                    right: 0,
                    zIndex: 2,
                  }}
                >
                  <GameDiceRule activeValue={multiplier} />
                </div>
                {rewardValue.includes(isAbsoluteWin) && (
                  <GameWin
                    multiplier={multiplier}
                    isAbsoluteWin={isAbsoluteWin}
                  />
                )}
              </div>
            </CustomFormItemHeight>
          </ColWrapper>
          <ColWrapper xs={24} sm={3} md={3} xl={6} />
        </RowWrapper>
        <RowWrapper
          gutter={8}
          align="center"
          justify="center"
          style={{ alignItems: "center", padding: 10 }}
        >
          <ColWrapper xs={24} sm={3} md={8} xl={8} />
          <ColWrapper xs={24} sm={18} md={8} xl={8}>
            <ButtonWrapper
              disabled={btnClick}
              style={{
                width: "100%",
                maxWidth: "100%",
                fontWeight: 600,
                height: 45,
              }}
              type="primary"
              htmlType="submit"
            >
              {btnLabel}
            </ButtonWrapper>
          </ColWrapper>
          <ColWrapper xs={24} sm={3} md={8} xl={8} />
        </RowWrapper>
        <RowWrapper
          gutter={8}
          justify="center"
          style={{ alignItems: "center" }}
        >
          <ColWrapper xs={24} sm={3} md={3} xl={6} />
          <ColWrapper xs={24} sm={18} md={18} xl={12}>
            <div
              style={{
                display: "flex",
                width: "100%",
                flexWrap: "nowrap",
                alignItems: "center",
                justifyContent: "space-around",
                flexDirection: isMobile ? "column-reverse" : "row",
              }}
              className="game-actions"
            >
              <div
                style={{
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    justifyContent: isMobile ? "center" : "flex-start",
                  }}
                >
                  <FormItemWrapper
                    name="amount"
                    initialValue={parseCurrency(1)}
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
                        {intl.formatMessage(translationsComponents.BET_AMOUNT)}
                      </label>
                    }
                    rules={[
                      {
                        required: true,
                        message: `${intl.formatMessage(
                          translationsComponents.REQUIRED_ERROR
                        )}`,
                      },
                    ]}
                    style={{ width: "100%" }}
                  >
                    <InputNumberWrapper min={0} className="border-right-none" />
                  </FormItemWrapper>
                  <AmountShortcus
                    handleBtnMulti={handleBtnMulti}
                    isDisabled={false}
                    mb={24}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormItemWrapper
                  name={["isAuto"]}
                  valuePropName={"checked"}
                  initialValue={isautoRoll}
                  style={{
                    marginBottom: 0,
                    paddingLeft: 15,
                    position: "relative",
                    top: isMobile ? "3px" : 0,
                  }}
                >
                  <SwitchWrapper
                    disabled={btnClick}
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
                <FormItemWrapper
                  onClick={() =>
                    setModalNewDice((state) => ({
                      ...state,
                      hasSoundEffect: !state.hasSoundEffect,
                    }))
                  }
                  style={{
                    textAlign: "center",
                    padding: "0 15px",
                  }}
                  label={<span style={{ opacity: 0 }}>speaker</span>}
                >
                  <SpeakerComponent isActive={hasSoundEffect} />
                </FormItemWrapper>
                <FormItemWrapper
                  label={<span style={{ opacity: 0 }}>rule</span>}
                >
                  <ButtonWrapper
                    onClick={handleOpenRuleNewDice}
                    style={{
                      background: "transparent",
                      color: appColor.textPrimaryColor,
                      fontWeight: 500,
                    }}
                  >
                    {intl.formatMessage(translationsComponents.GAME_RULE)}
                  </ButtonWrapper>
                </FormItemWrapper>
              </div>
            </div>
          </ColWrapper>
          <ColWrapper xs={24} sm={3} md={3} xl={6} />
        </RowWrapper>
        {isAuto && (
          <RowWrapper
            gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
            align="center"
            justify="center"
          >
            <GameAutoSetting
              isAutoRoll={isautoRoll}
              handleChangeLoss={handleChangeLoss}
              handleChangeWin={handleChangeWin}
              isDisableLoss={isDisableLoss}
              isDisableWin={isDisableWin}
            />
          </RowWrapper>
        )}
      </FormWrapper>
    </ScreenView>
  );
}

export default React.memo(GameForm);

const GameDisplay = ({ children }) => {
  return <div style={{ position: "absolute" }}>{children}</div>;
};

const BagdeCustom = styled.span`
  position: relative;
  box-shadow: 0 0 10px ${appColor.sky}, 0 0 40px ${appColor.sky},
    0 0 80px ${appColor.sky};
  border-radius: 100%;
  padding: 5px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  .trans {
    font-size: 18px;
    text-align: center;
    color: ${appColor.sky};
    animation: ${() =>
      css`
        ${topToBottom} 1s
      `};
    animation-fill-mode: forwards;
  }
`;

const CustomFormItemHeight = styled(FormItemWrapper)`
  overflow: hidden;
  .ant-col.ant-form-item-control {
    position: relative;
    z-index: 2;
  }
  .ant-form-item-control-input {
    height: 100%;
    .ant-form-item-control-input-content {
      height: 100%;
      .container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .game-active {
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      width: 150px;
      height: 400%;
      background-color: ${appColor.textPrimaryColor};
      margin: auto;
      animation: ${() =>
        css`
          ${runAround} 1s linear infinite
        `};
    }
    &::after {
      content: "";
      position: absolute;
      inset: 8px;
      background-color: ${appColor.borderPrimaryColor};
    }
  }
`;

const runAround = keyframes`
0%{
  transform: rotate(0deg);
}
100%{
  transform: rotate(360deg);
}
`;
const topToBottom = keyframes`
0%{
  top: -20px;
}
100%{
  top: 0;
}
`;
