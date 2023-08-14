import React, {
  forwardRef,
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { isMobile } from "react-device-detect";
import { useIntl } from "react-intl";
import styled from "styled-components";
import ticktok from "~/assets/audios/mutualGameSounds/tick.wav";
import chooseLine from "~/assets/audios/slotSoundEffects/chooseLine.wav";
import { RootContext } from "~/contextAPI/Authen";
import translationsComponents from "~/languageProvider/translateKeys";
import { imgAssets } from "~/settings/config";
import { appColor } from "~/settings/constants";
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
import { GameReward, GameSelectorArrow, GameSelectorLine } from "./GameReward";
import ReelSet from "./ReelSet";

const SlotGameAction = forwardRef((props, ref) => {
  let timeout = null;
  const intl = useIntl();
  const [width, setWidth] = useState(300);
  const [isAuto, setIsAuto] = useState(false);
  const [lineNumber, setLineNumber] = useState(1);
  const [isDisableLoss, setisDisableLoss] = useState(true);
  const [isDisableWin, setIsDisableWin] = useState(true);

  const [initGame, setInitGame] = useState({
    label: "loading",
    state: true,
  });
  const { slotsSetting, btnEvt, setModalObject, setSlotsSetting } =
    useContext(RootContext);
  const { multiList } = slotsSetting;
  const colRef = useRef(null);

  const {
    form,
    balance,
    handleSpin,
    isAutoSpin,
    handleStopAuto,
    handleListenAnimatedEnd,
    handleListenAnimatedStart,
    handleControlSound,
    hasSoundEffect,
  } = props;
  const currentBalance = (balance?.length > 0 && balance[0].amount) ?? 0;

  const audioTick = new Audio(ticktok);
  const audiochooseLine = new Audio(chooseLine);

  const spinBtn = `${intl.formatMessage(translationsComponents.PLAY_BTN)}`;
  const autospinBtn = `${intl.formatMessage(
    translationsComponents.AUTO_PLAY_BTN
  )}`;
  const stopBtn = `${intl.formatMessage(translationsComponents.STOP_BTN)}`;
  const gameRules = `${intl.formatMessage(translationsComponents.GAME_RULE)}`;
  const betAmount = `${intl.formatMessage(
    translationsComponents.BET_AMOUNT_PERLINE
  )}`;

  const handleChange = (input) => {
    if (!input) return;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (input >= currentBalance) {
        return false;
      }
    }, 300);
  };

  const handleBtnMulti = (value, type) => {
    if (type === "_LINE") {
      hasSoundEffect && audiochooseLine.play();
      form.setFieldsValue({
        line: value,
      });
      setLineNumber(value);
      setSlotsSetting((setting) => ({ ...setting, lines: value }));
      return;
    }
    hasSoundEffect && audioTick.play();
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

  function reAssignWidth(width) {
    width ? setWidth(width) : setWidth(300);
  }

  useEffect(() => {
    function initWdith() {
      const currentWidth =
        colRef && colRef.current && colRef.current.clientWidth;
      reAssignWidth(currentWidth);
    }
    initWdith();
    function widthOnload() {
      const getWidth = colRef && colRef.current && colRef.current.clientWidth;
      reAssignWidth(getWidth);
    }
    function widthResize() {
      const resize = colRef && colRef.current && colRef.current.clientWidth;
      reAssignWidth(resize);
    }
    const bb = document.getElementById("game_slots");
    const resizeObserver = new ResizeObserver(() => {
      const width = bb && bb.offsetWidth;
      reAssignWidth(width);
      resizeObserver.disconnect();
      resizeObserver.observe(bb);
    });
    resizeObserver.observe(bb);

    window.addEventListener("load", widthOnload);
    window.addEventListener("resize", widthResize);
    return () => {
      window.removeEventListener("resize", widthResize);
      window.removeEventListener("load", widthOnload);
      clearTimeout(timeout);
    };
  }, [timeout]);

  const handleSwitchAuto = (checked) => {
    setIsAuto(checked);
  };

  const handleShowRule = () => {
    setModalObject((modalObject) => ({
      ...modalObject,
      state: true,
      modalContent: (
        <div>
          <img
            style={{ width: "100%", height: "auto" }}
            src={imgAssets.slot}
            alt="rule"
          />
        </div>
      ),
      title: `Slots`,
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

  useEffect(() => {
    Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.onload = img.onerror = resolve;
            })
        )
    )
      .then(() => {
        setInitGame((game) => ({ ...game, label: "ready" }));
        setTimeout(() => {
          setInitGame((game) => ({ ...game, state: false }));
        }, 500);
      })
      .catch(() => setInitGame((game) => ({ ...game, state: false })));
  }, []);

  return (
    <Fragment>
      <RowWrapper
        gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
        align="center"
        justify="center"
        style={{ alignItems: "center" }}
      >
        <ColCustomUI
          ref={colRef}
          xs={24}
          md={16}
          xl={18}
          style={{ textAlign: "center" }}
          id="game_slots"
        >
          <FlexStyle>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                width: "100%",
                backgroundColor: "transparent",
                height: "100%",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  position: "absolute",
                  zIndex: 1,
                }}
              >
                <GameSelectorLine lineNumber={lineNumber} />
              </div>
            </div>
            <ReelSet
              width={width}
              height={300}
              ref={ref}
              handleListenAnimatedEnd={handleListenAnimatedEnd}
              handleListenAnimatedStart={handleListenAnimatedStart}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                width: "100%",
                backgroundColor: "transparent",
                height: "100%",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  position: "absolute",
                  zIndex: 1,
                }}
              >
                <GameSelectorArrow lineNumber={lineNumber} />
              </div>
            </div>
            <div
              style={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: "absolute",
                zIndex: 3,
              }}
            >
              {multiList?.length > 0 &&
                (multiList.every((item) => item === 0) ? null : (
                  <GameReward multiList={multiList} />
                ))}
            </div>
            <div
              className="game-intro"
              style={{
                opacity: initGame?.state ? 1 : 0,
              }}
            >
              {initGame?.label}
            </div>
          </FlexStyle>
        </ColCustomUI>
      </RowWrapper>

      <ScreenView
        style={{ padding: isMobile ? 5 : 20 }}
        className="game-actions"
      >
        <FormWrapper
          form={form}
          name="game-form"
          layout="vertical"
          onFinish={isAutoSpin ? handleStopAuto : handleSpin}
          initialValues={{
            win: 0,
            loss: 0,
            amount: 1,
            numberAdvance: 5,
          }}
        >
          <RowWrapper
            gutter={[16, { xs: 8, sm: 14, md: 24, lg: 32 }]}
            justify="center"
            style={{
              marginTop: 15,
            }}
          >
            <ColWrapper xs={24} md={12} xl={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "no-wrap",
                  alignItems: "flex-end",
                }}
              >
                <FormItemWrapper
                  onClick={handleControlSound}
                  style={{
                    marginBottom: isMobile ? 0 : "24px",
                    textAlign: "center",
                  }}
                >
                  <SpeakerComponent isActive={hasSoundEffect} />
                </FormItemWrapper>
                <FormItemWrapper
                  name={["isAuto"]}
                  valuePropName="checked"
                  initialValue={false}
                  style={{
                    marginBottom: isMobile ? 0 : "24px",
                  }}
                >
                  <SwitchWrapper
                    disabled={btnEvt.onClick}
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
                  style={{ marginBottom: isMobile ? 0 : "24px" }}
                >
                  <ButtonWrapper
                    onClick={handleShowRule}
                    style={{
                      background: "transparent",
                      color: appColor.textPrimaryColor,
                      fontWeight: 500,
                      width: isMobile && "100%",
                    }}
                  >
                    {gameRules}
                  </ButtonWrapper>
                </FormItemWrapper>
                {isMobile && (
                  <AmountShortcus
                    btnList={[
                      {
                        label: 1,
                        value: 1,
                      },
                      {
                        label: 2,
                        value: 2,
                      },
                      {
                        label: 3,
                        value: 3,
                      },
                    ]}
                    name="line"
                    initValue={lineNumber}
                    isDisabled={btnEvt.onClick}
                    handleBtnMulti={(value) => handleBtnMulti(value, "_LINE")}
                    isBorderTopLeft={5}
                    isBorderBottomLeft={5}
                  />
                )}
              </div>
            </ColWrapper>
          </RowWrapper>
          <RowWrapper
            gutter={[16, { xs: 8, sm: 14, md: 24, lg: 32 }]}
            justify="center"
            style={{
              marginTop: 10,
            }}
          >
            <ColWrapper
              xs={24}
              md={10}
              xl={10}
              style={{
                textAlign: "center",
              }}
            >
              <FormItemWrapper>
                <ButtonWrapper
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    fontWeight: 600,
                    height: 50,
                  }}
                  type="primary"
                  htmlType="submit"
                  disabled={isAutoSpin ? null : btnEvt.onClick}
                >
                  {isAuto ? (isAutoSpin ? stopBtn : autospinBtn) : spinBtn}
                </ButtonWrapper>
              </FormItemWrapper>
            </ColWrapper>
          </RowWrapper>
          <RowWrapper
            gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
            align="center"
            justify="center"
          >
            <ColWrapper
              xs={24}
              sm={24}
              md={10}
              lg={10}
              xl={10}
              xxl={10}
              style={{ alignItems: "center", display: "flex" }}
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
                    {betAmount}
                  </label>
                }
                name={["amount"]}
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
                  style={{
                    borderRadius: 5,
                    background: appColor.bgPrimaryColor,
                    height: "40px",
                    lineHeight: "40px",
                    color: appColor.textSecondaryColor,
                    width: "100%",
                  }}
                  min={0}
                  max={currentBalance}
                  onChange={handleChange}
                  disabled={btnEvt.onClick}
                  className="border-right-none"
                />
              </FormItemWrapper>
              <AmountShortcus
                mb={24}
                isDisabled={isAutoSpin ? isAutoSpin : btnEvt.onClick}
                handleBtnMulti={handleBtnMulti}
              />
            </ColWrapper>
            {!isMobile && (
              <ColWrapper
                xs={24}
                sm={24}
                md={6}
                lg={6}
                xl={6}
                xxl={6}
                style={{ justifyContent: "flex-end" }}
              >
                <AmountShortcus
                  btnList={[
                    {
                      label: 1,
                      value: 1,
                    },
                    {
                      label: 2,
                      value: 2,
                    },
                    {
                      label: 3,
                      value: 3,
                    },
                  ]}
                  name={"line"}
                  initValue={lineNumber}
                  isDisabled={isAutoSpin ? isAutoSpin : btnEvt.onClick}
                  handleBtnMulti={(value) => handleBtnMulti(value, "_LINE")}
                  isBorderTopLeft={5}
                  isBorderBottomLeft={5}
                  customStyle={{
                    maxWidth: 150,
                    width: "100%",
                    margin: "0 auto",
                  }}
                />
              </ColWrapper>
            )}
          </RowWrapper>

          {isAuto && (
            <RowWrapper
              gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
              align="center"
              justify="center"
            >
              <GameAutoSetting
                isAutoRoll={isAutoSpin}
                handleChangeLoss={handleChangeLoss}
                handleChangeWin={handleChangeWin}
                isDisableLoss={isDisableLoss}
                isDisableWin={isDisableWin}
              />
            </RowWrapper>
          )}
        </FormWrapper>
      </ScreenView>
    </Fragment>
  );
});

export default React.memo(SlotGameAction);

const ColCustomUI = styled(ColWrapper)`
  position: relative;
  .game-intro {
    position: absolute;
    inset: 0;
    background-color: ${appColor.bgSecondaryColor};
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8rem;
    font-style: italic;
    font-weight: bold;
    text-transform: uppercase;
    color: white;
    text-shadow: 4px 3px ${appColor.textPrimaryColor};
    transition: all 0.5s ease-in-out;
  }
`;

const FlexStyle = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;
  border: 1px solid ${appColor.borderPrimaryColor};
  overflow: hidden;
  padding: 10px 20px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  background-color: ${appColor.darkgray};
  .game-ui {
    &:not(:nth-child(3)) {
      border-bottom: 1px solid ${appColor.borderPrimaryColor};
    }
  }
  &::before,
  ::after {
    content: "";
    display: block;
    height: 0;
    left: 0;
    position: absolute;
    right: 0;
    z-index: 100;
  }
  &::before {
    background-image: linear-gradient(
      to top,
      rgba(100, 100, 100, 0),
      rgba(100, 100, 100, 0.2)
    );
    height: 30px;
    top: 0;
  }
  &::after {
    background-image: linear-gradient(
      to bottom,
      rgba(100, 100, 100, 0),
      rgba(100, 100, 100, 0.1)
    );
    bottom: 0;
    height: 20px;
  }
`;
