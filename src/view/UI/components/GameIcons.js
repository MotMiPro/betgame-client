import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";
import { appColor } from "~/settings/constants";
import { FormItemWrapper } from "./antComponents";

export const game_icon = {
  MOON: "fas fa-rocket",
  DICE: "fas fa-dice",
  "NEW DICE": "fas fa-dice",
  SLOTS: "fas fa-puzzle-piece",
  SLOT: "fas fa-puzzle-piece",
};
const BORDER_COLOR = "#d9d9d9";
const BORDER_RADIUS = 5;

export const GameIcon = ({ name, iconSize = 15, labelSize = 15 }) => {
  return !!name ? (
    <span style={{ display: "flex", alignItems: "center" }}>
      <i
        style={{
          fontSize: iconSize,
          opacity: 0.7,
        }}
        className={game_icon[name.toUpperCase()]}
      />
      <span
        style={{
          marginLeft: 10,
          textTransform: "capitalize",
          fontSize: labelSize,
        }}
      >
        {name}
      </span>
    </span>
  ) : null;
};

export const AmountShortcus = React.memo((props) => {
  const intl = useIntl();
  const {
    name,
    mb = 0,
    initValue = null,
    isDisabled,
    defaultActive = 0,
    handleBtnMulti,
    isBorderTopLeft = 0,
    isBorderBottomLeft = 0,
    isBorderTopRight = BORDER_RADIUS,
    isBorderBottomRight = BORDER_RADIUS,
    btnList = [
      {
        label: "x1/2",
        value: 0.5,
      },
      {
        label: "x2",
        value: 2,
      },
      {
        label: `${intl.formatMessage(translationsComponents.MAX_BET)}`,
        value: "max",
      },
    ],
    customStyle = {},
  } = props;
  const [active, setActive] = useState(defaultActive);

  const handleGetActive = (key) => {
    setActive(key);
  };
  return (
    <FormItemWrapper
      style={{
        marginLeft: -5,
        pointerEvents: isDisabled ? "none" : "auto",
        marginRight: -1,
        marginBottom: mb,
      }}
      label={
        <div style={{ opacity: 0, display: isMobile ? "none" : "block" }}>
          label
        </div>
      }
      initialValue={initValue}
      name={name ? name : ""}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: `1px solid ${BORDER_COLOR}`,
          borderTopRightRadius: isBorderTopRight,
          borderBottomRightRadius: isBorderBottomRight,
          borderTopLeftRadius: isBorderTopLeft,
          borderBottomLeftRadius: isBorderBottomLeft,
          height: 40,
          overflow: "hidden",
          fontSize: 12,
          ...customStyle,
        }}
      >
        {btnList.map(({ label, value }, idx) => (
          <div
            key={idx}
            style={{
              borderLeft: idx !== 0 ? `1px solid ${BORDER_COLOR}` : 0,
              color: "white",
              cursor: "pointer",
              padding: "5px 15px",
              backgroundColor:
                active === value
                  ? appColor.textPrimaryColor
                  : appColor.bgPrimaryColor,
              transition: "all .2s ease-in-out",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
            onClick={() => {
              handleBtnMulti(value);
              handleGetActive(value);
            }}
          >
            <span
              style={{
                whiteSpace: "nowrap",
                color:
                  active === value ? appColor.white : appColor.textPrimaryColor,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </FormItemWrapper>
  );
});

export const TargetShortcus = React.memo((props) => {
  const { handleBtn, isDisabled, isRollOver, name = "isRollOver" } = props;

  return (
    <FormItemWrapper
      style={{ marginLeft: -5, pointerEvents: isDisabled ? "none" : "auto" }}
      name={[name]}
      initialValue={isRollOver}
      label={<div style={{ opacity: 0 }}>target</div>}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          border: `1px solid ${BORDER_COLOR}`,
          borderTopRightRadius: 5,
          borderBottomRightRadius: 5,
          height: 40,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            color: isRollOver ? appColor.white : appColor.textPrimaryColor,
            cursor: "pointer",
            padding: "5px 15px",
            backgroundColor: isRollOver
              ? appColor.textPrimaryColor
              : appColor.bgPrimaryColor,
            transition: "all .2s ease-in-out",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          onClick={handleBtn}
        >
          <i
            className="fas fa-exchange-alt"
            style={{
              transform: "rotate(-90deg)",
              fontWeight: "bold",
            }}
          />
        </div>
      </div>
    </FormItemWrapper>
  );
});
