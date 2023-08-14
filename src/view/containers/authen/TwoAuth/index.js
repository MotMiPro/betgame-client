import React, { useContext, useState } from "react";
import { ScreenView } from "../../../UI/components";
import { CardView } from "../../../UI/components/CardWrapper";
import { ButtonWrapper } from "../../../UI/components/antComponents";
import { API_METHOD, appColor, pathAPI } from "../../../../settings/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootContext } from "~/contextAPI/Authen";
import { Form } from "antd";
import { pushNotification } from "~/ultils/pushNotifications";
import {
  StepSecretKey,
  StepQrCode,
  StepInputQrCode,
  DisableForm,
} from "./StepAuth";
import { DISPATCH_TYPE } from "~/state/ducks/types";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";
import { useFetchAPI } from "~/customHooks/useFetchAPI";

function TwoAuthen(props) {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { fetchDataEvent } = useFetchAPI();

  const { title, icon = null } = props;
  const { modalObject, setModalObject } = useContext(RootContext);
  const { userInfos: userLogedIn } = useSelector((state) => state.userReducer);
  const disableStatus = `${intl.formatMessage(
    translationsComponents.DISABLED
  )}`;
  const enableStatus = `${intl.formatMessage(translationsComponents.ENABLED)}`;

  function handleCopyToClipboard(text) {
    navigator.clipboard.writeText(text).then(
      function () {
        pushNotification({
          mess: `${intl.formatMessage(translationsComponents.COPIED)}`,
          title: `${intl.formatMessage(
            translationsComponents.COPY_TO_CLIPBOARD
          )}`,
          type: "success",
        });
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  }

  const EnableAuth = (props) => {
    const [auStep, setAuStep] = useState("_SRKEY");
    const { srkey } = props;
    async function handleConfirm(values) {
      if (auStep === "_SRKEY") {
        setAuStep("_QRCODE");
      }
      if (auStep === "_QRCODE") {
        setAuStep("_INPUT_QRCODE");
      }
      if (auStep === "_INPUT_QRCODE") {
        const data = await fetchDataEvent({
          endpoint: pathAPI.USER_ENABLE_2FA,
          method: API_METHOD.PUT,
          sendData: {
            password: values.password,
            token2fa: values.token2fa,
          },
        });
        if (data?.status) {
          pushNotification({
            mess: `${intl.formatMessage(translationsComponents.ENABLED)}`,
            title: `${intl.formatMessage(translationsComponents.TWO_2FA)}`,
            type: "success",
          });
          setModalObject({
            ...modalObject,
            state: false,
          });
          dispatch({ type: DISPATCH_TYPE.MODIFY_USER_2FA });
        }
      }
    }

    function handlePrev(params) {
      setAuStep(params);
    }

    return (
      <Form layout="vertical" onFinish={handleConfirm}>
        {auStep === "_SRKEY" && (
          <StepSecretKey
            srkey={srkey}
            handleCopyToClipboard={handleCopyToClipboard}
          />
        )}
        {auStep === "_QRCODE" && (
          <StepQrCode
            userLogedIn={userLogedIn}
            handlePrev={handlePrev}
            srkey={srkey}
          />
        )}
        {auStep === "_INPUT_QRCODE" && (
          <StepInputQrCode handlePrev={handlePrev} />
        )}
      </Form>
    );
  };

  const handleAuthen = async () => {
    try {
      const data = await fetchDataEvent({
        endpoint: pathAPI.USER_GET_2FA_KEYS,
        method: API_METHOD.GET,
      });
      if (data?.status) {
        const { secret2FAKey } = data?.fetchData;
        setModalObject((modalObject) => ({
          ...modalObject,
          state: true,
          modalContent: <EnableAuth srkey={secret2FAKey} />,
          title: `${intl.formatMessage(translationsComponents.TWO_2FA)}`,
        }));
      }
    } catch (error) {}
  };

  const handleDisableAuth = () => {
    setModalObject((modalObject) => ({
      ...modalObject,
      state: true,
      modalContent: (
        <DisableForm dispatch={dispatch} setModalObject={setModalObject} />
      ),
      title: `${intl.formatMessage(translationsComponents.TWO_2FA)}`,
    }));
  };

  return (
    <CardView title={title} icon={icon}>
      <ScreenView bgColor="transparent">
        <section>
          <div style={{ marginBottom: 10 }}>
            <span
              style={{ color: appColor.textSecondaryColor, marginRight: 5 }}
            >
              {intl.formatMessage(translationsComponents.TWO_2FA_STATUS)}
            </span>
            <span
              style={{
                fontWeight: "bold",
                color: checkActive(userLogedIn, { disableStatus, enableStatus })
                  .color,
              }}
            >
              {checkActive(userLogedIn, { disableStatus, enableStatus }).text}
            </span>
          </div>
          <ButtonWrapper
            onClick={userLogedIn?._gaEnabled ? handleDisableAuth : handleAuthen}
            style={{ minWidth: 170 }}
            type={userLogedIn?._gaEnabled ? "quaternary" : "primary"}
          >
            {userLogedIn?._gaEnabled ? disableStatus : enableStatus}
          </ButtonWrapper>
        </section>
      </ScreenView>
    </CardView>
  );
}

export default React.memo(TwoAuthen);

const checkActive = (obj, status) => {
  const { disableStatus, enableStatus } = status;
  const isEnable = obj?._gaEnabled || false;
  return {
    color: isEnable ? appColor.textPrimaryColor : appColor.red,
    text: isEnable ? enableStatus : disableStatus,
    buttonType: !isEnable ? appColor.red : appColor.textPrimaryColor,
  };
};
