import React from "react";
import { Row, Col } from "antd";
import { CardView } from "../../../../UI/components/CardWrapper";
import { FlexView, ScreenView } from "../../../../UI/components";
import { ButtonWrapper } from "../../../../UI/components/antComponents";
import { appColor, walletType } from "../../../../../settings/constants";
import { isMobile } from "react-device-detect";
import { parseCurrency } from "~/ultils/currency";

import { Pie } from "@ant-design/charts";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";
import styled from "styled-components";
import { getFixedNumber } from "~/ultils/currency/parseCurrency";

export default function Balance({ handleBtn, balanceChart, balanceData }) {
  const intl = useIntl();

  const configChart = {
    data: balanceChartData(balanceChart),
    appendPadding: 10,
    angleField: "value",
    colorField: "type",
    radius: 0.5,
    label: {
      type: "spider",
      labelHeight: 28,
      content: "{name} {value}$ \n{percentage}",
    },
    pieStyle: {
      lineWidth: 1.5,
    },
    interactions: [
      {
        type: "pie-legend-active",
      },
      {
        type: "element-active",
      },
    ],
  };
  return (
    <ScreenView>
      <CardView
        title={intl.formatMessage(translationsComponents.YOUR_BALANCE)}
        icon={<i className="fas fa-wallet" />}
      >
        <Row
          gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
          align="middle"
          justify="space-between"
          style={{ color: appColor.textWhiteColor }}
        >
          <Col
            xs={24}
            md={9}
            xl={9}
            style={{
              textAlign: "center",
              borderRight: isMobile
                ? 0
                : `1px solid ${appColor.borderPrimaryColor}`,
            }}
          >
            <div>
              {balanceData?.length &&
                balanceData.map((balance, idx) => {
                  return (
                    <BalanceWrapper key={idx}>
                      {/* <div
                        style={{
                          textTransform: "uppercase",
                          fontSize: 12,
                          // textAlign: "left",
                        }}
                      >
                        <span>
                          {intl.formatMessage(translationsComponents.AVAILABLE)}
                        </span>
                      </div> */}
                      <div
                        style={
                          isMobile
                            ? { ...styleBalance, ...mutualStyle }
                            : { ...mutualStyle }
                        }
                      >
                        <span>
                          {parseCurrency(balance.amount)}{" "}
                          <span>{balance.currency}</span>
                        </span>
                      </div>
                    </BalanceWrapper>
                  );
                })}
            </div>
            <FlexView direction="column">
              <ButtonWrapper
                style={{ width: "100%", marginTop: 10 }}
                type="quaternary"
                onClick={() => handleBtn(walletType.DEPOSITE)}
              >
                {intl.formatMessage(translationsComponents.DEPOSITE)}
              </ButtonWrapper>
              <ButtonWrapper
                style={{ marginTop: 8, color: appColor.gray3, width: "100%" }}
                onClick={() => handleBtn(walletType.WITHDRAW)}
              >
                {intl.formatMessage(translationsComponents.WITH_DRAW)}
              </ButtonWrapper>
            </FlexView>
          </Col>
          <Col xs={24} md={15} xl={15}>
            <Pie {...configChart} />
          </Col>
        </Row>
      </CardView>
    </ScreenView>
  );
}

const styleBalance = {
  fontSize: "32px",
  fontWeight: "700",
  letterSpacing: 2,
};

const mutualStyle = { overflow: "auto", textAlign: "center" };

const balanceChartData = (arr) => {
  return arr.map((item) => ({
    type: item.currency,
    value: getFixedNumber(item.amount, 3),
  }));
};

const BalanceWrapper = styled.div`
  position: relative;
  &:after {
    content: "";
    background-color: ${appColor.textSecondaryColor};
    opacity: 0.1;
    width: 45%;
    height: 1px;
    margin: 0 auto;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
