import React, {
  Fragment,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { isMobile } from "react-device-detect";
import { appColor } from "~/settings/constants";
import { parseCurrency } from "~/ultils/currency";
import GameAutoSetting, {
  TurnUI,
  FormLabel,
} from "~/view/presentations/games/GameAutoSetting";
import {
  ButtonWrapper,
  ColWrapper,
  FormItemWrapper,
  FormWrapper,
  InputNumberWrapper,
  RowWrapper,
  SwitchWrapper,
} from "~/view/UI/components/antComponents";
import { SpeakerComponent } from "~/view/UI/components/SpeakerComponent";

import tick from "~/assets/audios/mutualGameSounds/tick.wav";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";
import { AmountShortcus } from "~/view/UI/components/GameIcons";
import useAudio from "~/customHooks/useAudios";
import { RootContext } from "~/contextAPI/Authen";
import { MoonRules } from "../GameRules";

const LEAVE_STATUS = "LEAVE";
const STOP_STATUS = "STOP";

const GameForm = (props) => {
  const {
    form,
    isAuto,
    handleStop,
    handlePlay,
    myBalance,
    gameState,
    isPlaying,
    handleLeave,
    isAutoPlaying,
    hasSoundEffect,
    tempDataWhenRun,
    handleSwitchAuto,
    handleControlSound,
  } = props;
  const intl = useIntl();
  const [isLeaveAuto, setIsLeaveAuto] = useState(isAuto);
  const [disableAdvance, setDisableAdvance] = useState(false);
  const [isDisableLoss, setisDisableLoss] = useState(true);
  const [isDisableWin, setIsDisableWin] = useState(true);
  const { togglePlay: audioTick } = useAudio(tick);

  const { setModalObject } = useContext(RootContext);

  // const waitingStatus = `${intl.formatMessage(
  //   translationsComponents.WATTING_BTN
  // )}`;
  const playStatus = `${intl.formatMessage(translationsComponents.PLAY_BTN)}`;
  const autoStatus = `${intl.formatMessage(
    translationsComponents.AUTO_PLAY_BTN
  )}`;
  const stopStatus = `${intl.formatMessage(translationsComponents.STOP_BTN)}`;
  const leaveStatus = `${intl.formatMessage(translationsComponents.LEAVE_BTN)}`;

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

  const btnState = useMemo(() => {
    if (!isAuto) {
      switch (gameState) {
        case "RUN":
          if (isPlaying && !tempDataWhenRun) {
            return {
              text: LEAVE_STATUS,
              status: false,
              label: leaveStatus,
            };
          }
          if (isPlaying && tempDataWhenRun) {
            return {
              text: `PLAY`,
              status: true,
              label: playStatus,
            };
          }
          if (!isPlaying && tempDataWhenRun) {
            return {
              text: LEAVE_STATUS,
              status: false,
              label: leaveStatus,
            };
          }
          return {
            text: `PLAY`,
            status: false,
            label: playStatus,
          };
        case "FINISH":
        case "WAIT":
          return tempDataWhenRun
            ? {
                text: `PLAY`,
                status: true,
                label: playStatus,
              }
            : { text: `PLAY`, status: false, label: playStatus };
        case "READY":
          return isPlaying
            ? {
                text: `PLAY`,
                status: true,
                label: playStatus,
              }
            : {
                text: `PLAY`,
                status: false,
                label: playStatus,
              };

        default:
          return {
            text: "",
            status: false,
            label: "",
          };
      }
    } else {
      isAutoPlaying ? setDisableAdvance(true) : setDisableAdvance(false);
      if (isPlaying && gameState === "RUN") {
        return {
          text: LEAVE_STATUS,
          status: false,
          label: leaveStatus,
        };
      }
      return isAutoPlaying
        ? {
            text: "STOP",
            status: false,
            label: stopStatus,
          }
        : {
            text: `AUTO PLAY`,
            status: false,
            label: autoStatus,
          };
    }
  }, [gameState, isPlaying, isAuto, isAutoPlaying, intl, tempDataWhenRun]);

  const handleChangeLeaveAuto = (checked) => {
    setIsLeaveAuto(checked);
  };

  const isActiveInput = switchInput(isAuto, isLeaveAuto);

  const handleBtnMulti = useCallback((coe) => {
    hasSoundEffect && audioTick();
    if (coe === "max") {
      form.setFieldsValue({
        amount: myBalance,
      });
      return;
    }
    const getAmount = form.getFieldValue("amount");
    if (!getAmount) return;

    if (coe === 2 && parseFloat(getAmount) * 2 >= parseFloat(myBalance)) {
      form.setFieldsValue({
        amount: myBalance,
      });
      return;
    }
    const aMountSetter = coe * getAmount;
    form.setFieldsValue({
      amount: aMountSetter.toFixed(2),
    });
  });

  const handleOpenRuleMoon = () => {
    setModalObject((modalObject) => ({
      ...modalObject,
      state: true,
      modalContent: (
        <div>
          <MoonRules />
        </div>
      ),
      title: `Moon`,
    }));
  };

  const handleAutoCashoutChange = (value) => {
    if (!value || value < 1) {
      form.setFields([
        {
          name: "autoCashout",
          errors: [`min 1`],
        },
      ]);
      form.setFieldsValue({
        autoCashout: 1,
      });
    }
  };

  return (
    <FormWrapper
      form={form}
      name="game-form"
      layout="vertical"
      onFinish={
        btnState?.text === LEAVE_STATUS
          ? handleLeave
          : btnState.text === STOP_STATUS
          ? handleStop
          : handlePlay
      }
      initialValues={{
        win: 0,
        loss: 0,
      }}
    >
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
            name={["autoPlay"]}
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <SwitchWrapper
              checkedChildren={
                <span
                  style={{ textTransform: "capitalize", whiteSpace: "nowrap" }}
                >{`${intl.formatMessage(
                  translationsComponents.SWITCH_AUTO
                )}`}</span>
              }
              unCheckedChildren={
                <span
                  style={{ textTransform: "capitalize", whiteSpace: "nowrap" }}
                >{`${intl.formatMessage(
                  translationsComponents.SWITCH_MANUAL
                )}`}</span>
              }
              disabled={btnState?.status}
              onChange={handleSwitchAuto}
            />
          </FormItemWrapper>
          {isMobile && (
            <Fragment>
              <div
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                }}
              >
                <div onClick={handleControlSound}>
                  <SpeakerComponent isActive={hasSoundEffect} />
                </div>
              </div>
              <div>
                <ButtonWrapper
                  onClick={handleOpenRuleMoon}
                  style={{
                    background: "transparent",
                    color: appColor.textPrimaryColor,
                    fontWeight: "bold",
                  }}
                >
                  {intl.formatMessage(translationsComponents.GAME_RULE)}
                </ButtonWrapper>
              </div>
            </Fragment>
          )}
        </ColWrapper>
        <ColWrapper xs={24} md={10} xl={10} style={{ textAlign: "center" }}>
          <div
            style={{
              padding: "10px 0",
            }}
          >
            <ButtonWrapper
              disabled={btnState?.status}
              style={{
                width: "100%",
                maxWidth: "100%",
                fontWeight: 600,
                height: 45,
                backgroundColor: btnState?.status
                  ? appColor.gray11
                  : btnState?.text === LEAVE_STATUS
                  ? appColor.orange
                  : appColor.textPrimaryColor,
              }}
              type="primary"
              htmlType="submit"
            >
              {btnState?.label}
            </ButtonWrapper>
          </div>
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
            <div onClick={handleControlSound}>
              <SpeakerComponent isActive={hasSoundEffect} />
            </div>
          </ColWrapper>
        )}
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
            <ButtonWrapper
              onClick={handleOpenRuleMoon}
              style={{
                background: "transparent",
                color: appColor.textPrimaryColor,
                fontWeight: "bold",
              }}
            >
              {intl.formatMessage(translationsComponents.GAME_RULE)}
            </ButtonWrapper>
          </ColWrapper>
        )}
      </RowWrapper>
      <RowWrapper
        gutter={8}
        justify="center"
        style={{
          position: "relative",
          flexWrap: isMobile ? "wrap" : "nowrap",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            flexWrap: "nowrap",
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
            name={"amount"}
            initialValue={parseCurrency(1)}
          >
            <InputNumberWrapper
              disabled={btnState?.status}
              min={0}
              max={myBalance}
              className={"border-right-none"}
            />
          </FormItemWrapper>
          <AmountShortcus
            mb={24}
            handleBtnMulti={handleBtnMulti}
            isDisabled={btnState?.status}
          />
        </div>
        {!isAuto && (
          <div
            style={{
              position: "relative",
              padding: "0 10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FormItemWrapper
              name="leave"
              style={{
                position: "relative",
                alignItems: "flex-end",
              }}
              label={
                <FormLabel
                  title={intl.formatMessage(translationsComponents.LEAVE_BTN)}
                />
              }
            >
              <SwitchWrapper
                onChange={handleChangeLeaveAuto}
                style={{
                  transform: `rotate(90deg)`,
                }}
                disabled={btnState?.status}
                checked={isLeaveAuto}
              />
            </FormItemWrapper>

            <TurnUI
              isActive={isDisableLoss}
              top={intl.formatMessage(translationsComponents.SWITCH_MANUAL)}
              bottom={intl.formatMessage(translationsComponents.SWITCH_AUTO)}
              topRelative={3}
            />
          </div>
        )}

        {isActiveInput && (
          <FormItemWrapper
            label={
              isAuto ? (
                <FormLabel
                  title={intl.formatMessage(translationsComponents.LEAVE_BTN)}
                />
              ) : (
                <div style={{ opacity: 0 }}>
                  <FormLabel
                    title={intl.formatMessage(translationsComponents.LEAVE_BTN)}
                  />
                </div>
              )
            }
            style={{
              position: "relative",
              marginLeft: isAuto ? 10 : 0,
              alignItems: "flex-start",
            }}
            name={"autoCashout"}
            initialValue={parseCurrency(2)}
          >
            <InputNumberWrapper
              onChange={handleAutoCashoutChange}
              disabled={btnState?.status}
              min={1}
              max={10000}
            />
          </FormItemWrapper>
        )}
      </RowWrapper>
      {isAuto && (
        <GameAutoSetting
          isRequiredNumber
          isAutoRoll={disableAdvance}
          handleChangeLoss={handleChangeLoss}
          handleChangeWin={handleChangeWin}
          isDisableLoss={isDisableLoss}
          isDisableWin={isDisableWin}
          numberTitle={intl.formatMessage(
            translationsComponents.NUMBER_OF_GAME
          )}
        />
      )}
    </FormWrapper>
  );
};

export default React.memo(GameForm);

const switchInput = (in_1, in_2) => {
  if (in_1) {
    return true;
  } else if (in_1 && !in_2) {
    return true;
  } else if (in_2 && !in_1) {
    return true;
  } else {
    return false;
  }
};
