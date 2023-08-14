import React from "react";
import { isMobile } from "react-device-detect";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";
import { appColor } from "~/settings/constants";
import {
  FormItemWrapper,
  InputNumberWrapper,
  SwitchWrapper,
} from "~/view/UI/components/antComponents";

export default function GameAutoSetting(props) {
  const intl = useIntl();

  const {
    isAutoRoll,
    handleChangeLoss,
    handleChangeWin,
    isDisableLoss,
    isDisableWin,
    isRequiredNumber = false,
    numberTitle = `${intl.formatMessage(
      translationsComponents.NUMBER_OF_ROLL
    )}`,
  } = props;

  // const testChange = (number) => {
  //   console.log({ number });
  //   number.replace(/^\d+(?:\.\d{1,2})?$/);
  // };

  return (
    <div
      style={{
        padding: "10px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        <FormItemWrapper
          style={inputStyle}
          name="numberAdvance"
          label={<FormLabel title={numberTitle} />}
          rules={[
            {
              required: isRequiredNumber,
              message: `${intl.formatMessage(
                translationsComponents.ERR_INPUT_NUMBER
              )}`,
            },
          ]}
        >
          <InputNumberWrapper
            min={0}
            disabled={isAutoRoll}
            onKeyDown={(event) => {
              if (event.key === ".") {
                event.preventDefault();
              }
            }}
          />
        </FormItemWrapper>
        <div style={style}>
          <FormItemWrapper
            style={{
              position: "relative",
              padding: "0 10px",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginBottom: isMobile ? 10 : 0,
              width: "100%",
            }}
            label={
              <FormLabel
                title={`${intl.formatMessage(
                  translationsComponents.LOSS_BEHAVIOR
                )}`}
              />
            }
            className="switch-custom-input"
          >
            <SwitchWrapper
              onChange={handleChangeLoss}
              style={{
                transform: `rotate(90deg)`,
                top: 3,
              }}
              disabled={isAutoRoll}
            />
            <TurnUI isActive={isDisableLoss} topRelative={-10} />
          </FormItemWrapper>
          <FormItemWrapper
            style={{ ...inputStyle, marginBottom: 0 }}
            name="loss"
            // rules={[
            //   {
            //     pattern: "/^d+(?:.d{1,2})?$/",
            //     message: `invalid number`,
            //   },
            // ]}
          >
            <InputNumberWrapper
              min={0}
              disabled={isAutoRoll ? isAutoRoll : isDisableLoss}
              formatter={(value) => `${value}%`}
              // onChange={testChange}
            />
          </FormItemWrapper>
        </div>
        <div style={style}>
          <FormItemWrapper
            style={{
              position: "relative",
              padding: "0 10px",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginBottom: isMobile ? 10 : 0,
              width: "100%",
            }}
            label={
              <FormLabel
                title={`${intl.formatMessage(
                  translationsComponents.WIN_BEHAVIOR
                )}`}
              />
            }
            className="switch-custom-input"
          >
            <SwitchWrapper
              onChange={handleChangeWin}
              style={{
                transform: `rotate(90deg)`,
                top: 3,
              }}
              disabled={isAutoRoll}
            />
            <TurnUI isActive={isDisableWin} topRelative={-10} />
          </FormItemWrapper>
          <FormItemWrapper
            style={{ ...inputStyle, marginBottom: 0 }}
            name="win"
          >
            <InputNumberWrapper
              min={0}
              disabled={isAutoRoll ? isAutoRoll : isDisableWin}
              formatter={(value) => `${value}%`}
            />
          </FormItemWrapper>
        </div>
      </div>
    </div>
  );
}

export const FormLabel = ({ title }) => (
  <label
    style={{
      color: appColor.textSecondaryColor,
      textTransform: "uppercase",
      fontWeight: "bold",
      fontSize: 11,
    }}
  >
    {title}
  </label>
);

const style = {
  width: "100%",
  position: "relative",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
};

const inputStyle = {
  width: "100%",
};

export const TurnUI = (props) => {
  const intl = useIntl();
  const {
    isActive,
    top = `${intl.formatMessage(translationsComponents.RESET_TO_BASE)}`,
    bottom = `${intl.formatMessage(translationsComponents.INCREASE_BY)}`,
    topRelative = 0,
  } = props;

  return (
    <div
      style={{
        color: appColor.textSecondaryColor,
        fontSize: 10,
        textTransform: "uppercase",
        position: "relative",
        top: topRelative,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            padding: "5px 0",
            whiteSpace: "nowrap",
            color: isActive
              ? appColor.textPrimaryColor
              : appColor.textSecondaryColor,
            transition: "all .3s ease",
          }}
        >
          {top}
        </span>
        <span
          style={{
            padding: "5px 0",
            whiteSpace: "nowrap",
            color: !isActive
              ? appColor.textPrimaryColor
              : appColor.textSecondaryColor,
            transition: "all .3s ease",
          }}
        >
          {bottom}
        </span>
      </div>
    </div>
  );
};
