import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import translationsComponents from "~/languageProvider/translateKeys";
import { SelectWrapper } from "~/view/UI/components/antComponents";
import { appColor } from "../../../../../settings/constants";

function LeftColumn({ coinList, handleChangeCoin, initCoin }) {
  const intl = useIntl();
  return (
    <div>
      <div style={{ marginBottom: 15 }}>
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
          <li>
            Do not withdraw directly to an ICO address or crowdfunding, because
            your account will not be credited with tokens from this activity.
          </li>
          <li>
            We waived liability for wrong transfer of wallet addresses or
            different blockchain platforms. Bitwin does not yet support
            cross-chain.
          </li>
        </ul>
      </StyleTips>
      {/* <StyleTips>
        <p
          style={{
            color: appColor.textPrimaryColor,
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
        >
          {intl.formatMessage(translationsComponents.CAUTION)}
        </p>
        <p>
          Adipisicing velit adipisicing aute laborum. Mollit eu esse culpa
          laboris Lorem qui velit cillum non magna consequat. Aute eu et ipsum
          dolore proident ex voluptate enim. Tempor elit dolore consequat
          cillum.et excepteur dolore quis labore ea velit proident ea eu.
        </p>
      </StyleTips> */}
    </div>
  );
}
export default React.memo(LeftColumn);

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
