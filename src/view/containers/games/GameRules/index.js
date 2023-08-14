import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import translationsComponents from "~/languageProvider/translateKeys";
import { appColor } from "~/settings/constants";

const Paragraph = styled.p`
  padding-left: 10;
  text-align: justify;
`;

export const NewDiceRule = () => {
  const intl = useIntl();
  return (
    <div
      style={{ color: appColor.textSecondaryColor, fontFamily: "monospace" }}
    >
      <h3 style={{ color: appColor.textPrimaryColor, textAlign: "center" }}>
        {intl.formatMessage(translationsComponents.WELCOME_NEWDICE)}
      </h3>
      <Paragraph>
        {intl.formatMessage(translationsComponents.NEWDICE_DES_1)}
      </Paragraph>
      <Paragraph>
        {intl.formatMessage(translationsComponents.NEWDICE_DES_2)}
      </Paragraph>
    </div>
  );
};

export function MoonRules() {
  const intl = useIntl();
  return (
    <div
      style={{ color: appColor.textSecondaryColor, fontFamily: "monospace" }}
    >
      <h3 style={{ color: appColor.textPrimaryColor }}>
        {intl.formatMessage(translationsComponents.MOON_WHAT)}
      </h3>
      <p style={{ paddingLeft: 10, textAlign: "justify" }}>
        {intl.formatMessage(translationsComponents.MOON_WHAT_DES)}
      </p>
      <h3 style={{ color: appColor.textPrimaryColor }}>
        {intl.formatMessage(translationsComponents.MOON_HOW_TO_USE)}
      </h3>
      <p style={{ paddingLeft: 10, textAlign: "justify" }}>
        {intl.formatMessage(translationsComponents.MOON_HOW_TO_USE_DES)}
      </p>
    </div>
  );
}
