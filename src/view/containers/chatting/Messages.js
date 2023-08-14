import React from "react";
import styled from "styled-components";
import { parseTimer } from "~/settings/config";
import { appColor } from "~/settings/constants";
import { subNameCode } from "~/view/UI/components/AmountUI";

function Messages(props) {
  const { text, userName, isOwner, index, iconLogo, timeDate } = props;
  return (
    <div
      key={index}
      style={{
        padding: "9px",
        borderBottom: `1px solid rgba(74,74,74,.1)`,
      }}
    >
      <div
        style={{
          display: "block",

          color: isOwner
            ? appColor.textPrimaryColor
            : appColor.textSecondaryColor,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 35,
            borderRadius: "50%",
            backgroundColor: appColor.bgSecondaryColor,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: "rotate(180deg)",
            direction: "ltr",
          }}
        >
          <img
            style={{
              width: "100%",
              objectFit: "cover",
              height: "100%",
            }}
            src={iconLogo}
            alt="img"
          />
        </div>
        <MessStyle>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                color: appColor.white,
                fontWeight: "bold",
              }}
            >
              {subNameCode(userName)}
            </div>
            <Timer>{parseTimer(timeDate)} </Timer>
          </div>
          <div
            style={{
              display: "block",
              fontSize: 11,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {text}
          </div>
        </MessStyle>
      </div>
    </div>
  );
}

export default Messages;

const MessStyle = styled.div`
  width: 100%;
  position: relative;
  word-break: break-all;
  transform: rotate(180deg);
  direction: ltr;
  padding-left: 10px;
`;

const Timer = styled.div`
  font-weight: 400;
  margin-left: 5px;
  font-size: 13px;
  color: #c8cfe3;
`;
