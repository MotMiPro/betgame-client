import React from "react";
import styled from "styled-components";
import translationsComponents from "~/languageProvider/translateKeys";
import { SelectWrapper } from "~/view/UI/components/antComponents";
import { appColor } from "../../../../../settings/constants";

function DepositeLeftColumn({
  coinList,
  handleChangeCoin,
  initCoin,
  dataView,
  currentbalance,
  intl,
}) {
  return (
    <div>
      <div style={{ marginBottom: 15 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SelectWrapper
            allowClear={false}
            value={initCoin}
            style={{
              width: 150,
              borderRadius: 5,
              color: appColor.white,
              border: `1px solid ${appColor.textSecondaryColor}`,
            }}
            selectList={coinList}
            placeholder="Select an option"
            handleChange={handleChangeCoin}
          />
          <div
            style={{
              color: appColor.textSecondaryColor,
              textAlign: "right",
              textTransform: "capitalize",
            }}
          >
            <span
              style={{
                display: "block",
                marginBottom: 7,
                textTransform: "capitalize",
              }}
            >
              {intl.formatMessage(translationsComponents.TOTAL_BALANCE)}
            </span>
            <span>{`${currentbalance?.amount} ${dataView?.currency}`}</span>
          </div>
        </div>
      </div>
      <StyleTips>
        <p
          style={{
            color: appColor.textPrimaryColor,
            textAlign: "left",
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
        >
          {intl.formatMessage(translationsComponents.TIPS)}
        </p>
        <ul>
          <li>{` Only send ${dataView?.currency} to this deposit address.`}</li>
          <li>
            Sending coins or tokens other than the one you choose to this
            address may risk losing money.
          </li>
          <li>
            If you have made a deposit, please pay attention to the text
            messages, website notifications and the email we sent you.
          </li>
          <li>Coins will be deposited after confirmed by the network.</li>
          <li>
            We are not responsible for assets for wrong wallet address or
            network platform when you mistakenly transfer.
          </li>
        </ul>
      </StyleTips>
    </div>
  );
}
export default React.memo(DepositeLeftColumn);

const StyleTips = styled.div`
  border: 1px solid ${appColor.borderPrimaryColor};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  background-color: ${appColor.borderPrimaryColor};
  & > div {
    &:last-child {
      margin-bottom: 0;
    }
  }
`;
