import { Card } from "antd";
import styled from "styled-components";
import { appColor } from "../../../settings/constants";
import ScreenView from "./ScreenView";
import React from "react";
import { isMobile } from "react-device-detect";

const CardWrapper = styled(Card)`
  .ant-card-head {
    border-bottom: ${(props) =>
      props.appColor
        ? props.appColor.textPrimaryColor
        : `1px solid ${appColor.borderPrimaryColor}`};
    /* padding: 0; */
    .ant-card-head-title {
      padding: 5px 0;
    }
  }

  .ant-card-body {
    padding: ${(props) => (props.paddingbody ? props.paddingbody : "24px")};
  }
`;
export default CardWrapper;

export const CardView = (props) => {
  const { title, icon, style, paddingbody = isMobile ? "8px" : "24px" } = props;
  return (
    <ScreenView style={{ ...style }}>
      <CardWrapper
        paddingbody={paddingbody}
        bordered={false}
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",

              alignItems: "center",
              opacity: ".8",
            }}
          >
            <span style={{ fontSize: 28, color: appColor.gray2 }}>{icon}</span>
            <h3
              style={{
                color: appColor.textWhiteColor,
                textTransform: "capitalize",
                marginLeft: 15,
                marginBottom: 0,
              }}
            >
              {title}
            </h3>
          </div>
        }
        style={{ backgroundColor: "transparent" }}
      >
        {props.children}
      </CardWrapper>
    </ScreenView>
  );
};
