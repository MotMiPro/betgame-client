import React from "react";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import en_US from "./i18n/en_US.json";
import ko_KR from "./i18n/ko_KR.json";
import vi_VN from "./i18n/vi_VN.json";

const localeObj = {
  "en-US": en_US,
  "ko-KR": ko_KR,
  "vi-VN": vi_VN,
};

export default function LanguageProvider(props) {
  const { locale } = useSelector((state) => state.sessionReducer);
  return (
    <IntlProvider
      messages={localeObj[locale]}
      locale={locale}
      defaultLocale={locale}
    >
      {props.children}
    </IntlProvider>
  );
}
