import React from "react";
import { appColor, pathName } from "~/settings/constants";
import translationsComponents from "~/languageProvider/translateKeys";
import { ButtonWrapper } from "~/view/UI/components/antComponents";
import { useIntl } from "react-intl";

export default function NotifyToSignUpgame({ setModalObject, history }) {
  const intl = useIntl();

  const handleRoute = (path) => {
    setModalObject((modal) => ({ ...modal, state: false }));
    history.push(path);
  };
  return (
    <section>
      <div style={{ textAlign: "center" }}>
        <div>
          <i
            style={{
              fontSize: 120,
            }}
            className="fas fa-money-check-alt"
          ></i>
        </div>
        <div style={{ marginTop: 35 }}>
          <div>
            <h4 style={{ color: "white" }}>
              {intl.formatMessage(translationsComponents.FORCE_LOGIN_TITLE)}
            </h4>
            <p>{intl.formatMessage(translationsComponents.FORCE_LOGIN_DES)}</p>
          </div>
          <div style={{ marginTop: 15 }}>
            <ButtonWrapper
              style={{
                color: appColor.white,
                backgroundColor: appColor.textPrimaryColor,
                border: "none",
                maxWidth: 200,
              }}
              onClick={() => handleRoute(pathName._SIGNUP)}
            >
              {intl.formatMessage(translationsComponents.SIGN_UP)}
            </ButtonWrapper>
            <span
              style={{
                marginLeft: 15,
                cursor: "pointer",
                backgroundColor: "transparent",
                color: appColor.textPrimaryColor,
                padding: "5px 20px",
                textTransform: "uppercase",
              }}
              onClick={() => handleRoute(pathName._LOGIN)}
            >
              {intl.formatMessage(translationsComponents.LOG_IN)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
