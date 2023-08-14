import { Form, Row, Col } from "antd";
import React, { Fragment } from "react";
import { API_METHOD, appColor, pathAPI } from "~/settings/constants";
import { PicLeftOutlined, LockOutlined } from "@ant-design/icons";
import ModalFooter from "~/view/UI/components/ModalFooter";
import { InputWrapper } from "~/view/UI/components/antComponents";
import QRCode from "qrcode.react";
import { pushNotification } from "~/ultils/pushNotifications";
import { ggAddress } from "../../../../settings/constants";
import { DISPATCH_TYPE } from "~/state/ducks/types";
import translationsComponents from "~/languageProvider/translateKeys";
import { useIntl } from "react-intl";
import { useFetchAPI } from "~/customHooks/useFetchAPI";

const HeadModalContent = (props) => {
  const { number = 1, text = "Saving your secret key" } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span
        style={{
          width: 30,
          height: 30,
          display: "flex",
          borderRadius: 100,
          alignItems: "center",
          justifyContent: "center",
          background: appColor.orange,
          marginRight: 15,
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export function StepSecretKey(props) {
  const intl = useIntl();
  const { handleCopyToClipboard, srkey } = props;
  return (
    <Fragment>
      <Form.Item style={{ color: appColor.white }}>
        <Row
          gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
          align="center"
          justify="center"
          style={{ alignItems: "center" }}
        >
          <Col xs={24} md={24} xl={24}>
            <HeadModalContent
              number="1"
              text={intl.formatMessage(
                translationsComponents.SAVING_SECRET_KEY
              )}
            />
          </Col>
          <Col
            xs={24}
            md={24}
            xl={24}
            style={{ justifyContent: "center", textAlign: "center" }}
          >
            <span
              onClick={() => handleCopyToClipboard(srkey)}
              style={{
                background: appColor.bgPrimaryColor,
                padding: "5px 20px",
                borderRadius: 5,
                cursor: "pointer",
                letterSpacing: 2,
                fontWeight: "bold",
              }}
            >
              {srkey}
            </span>
          </Col>
        </Row>
      </Form.Item>
      <ModalFooter btnRight={intl.formatMessage(translationsComponents.NEXT)} />
    </Fragment>
  );
}

export function StepQrCode(props) {
  const intl = useIntl();
  const { handlePrev, userLogedIn, srkey } = props;
  const text = ggAddress({
    email: userLogedIn?._email,
    key: srkey,
  });

  return (
    <Fragment>
      <Form.Item style={{ color: appColor.white }}>
        <Row
          gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
          align="center"
          justify="center"
          style={{ alignItems: "center" }}
        >
          <Col xs={24} md={24} xl={24}>
            <HeadModalContent
              number="2"
              text={intl.formatMessage(
                translationsComponents.CONNECTING_AUTHEN
              )}
            />
          </Col>
          <Col
            xs={24}
            md={24}
            xl={24}
            style={{ justifyContent: "center", textAlign: "center" }}
          >
            {srkey && (
              <QRCode
                id="qrcode"
                value={text}
                size={290}
                level={"H"}
                includeMargin={true}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
      <ModalFooter
        btnRight={intl.formatMessage(translationsComponents.NEXT)}
        btnLeft={intl.formatMessage(translationsComponents.PREV)}
        handleLeft={() => handlePrev("_SRKEY")}
      />
    </Fragment>
  );
}

export function StepInputQrCode(props) {
  const intl = useIntl();
  const { handlePrev } = props;
  return (
    <Fragment>
      <Form.Item style={{ color: appColor.white }}>
        <Row
          gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
          align="center"
          justify="center"
          style={{ alignItems: "center" }}
        >
          <Col xs={24} md={24} xl={24}>
            <HeadModalContent
              number="3"
              text={intl.formatMessage(translationsComponents.CONFIRM_CODE)}
            />
          </Col>
          <Col
            xs={24}
            md={16}
            xl={16}
            style={{ justifyContent: "center", textAlign: "center" }}
          >
            <p style={{ textAlign: "center" }}>
              {intl.formatMessage(translationsComponents.TWO_2FA_DES)}
            </p>
            <EnableForm />
          </Col>
        </Row>
      </Form.Item>
      <ModalFooter
        btnRight={intl.formatMessage(translationsComponents.CONFIRM)}
        btnLeft={intl.formatMessage(translationsComponents.PREV)}
        handleLeft={() => handlePrev("_QRCODE")}
      />
    </Fragment>
  );
}

const EnableForm = () => {
  const intl = useIntl();
  return (
    <Fragment>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: `${intl.formatMessage(
              translationsComponents.WARNING_PASSWORD
            )}`,
          },
        ]}
        className="resetForm"
      >
        <InputWrapper.Password
          prefix={
            <LockOutlined
              className="site-form-item-icon"
              style={{ color: appColor.textSecondaryColor }}
            />
          }
          style={{
            width: "100%",
            backgroundColor: appColor.bgPrimaryColor,
            height: 40,
          }}
          placeholder={intl.formatMessage(translationsComponents.PASSWORD)}
          className=""
        />
      </Form.Item>
      <Form.Item
        name="token2fa"
        rules={[
          {
            required: true,
            message: `${intl.formatMessage(
              translationsComponents.WARNING_CODE
            )}`,
          },
        ]}
      >
        <InputWrapper
          prefix={
            <PicLeftOutlined style={{ color: appColor.textSecondaryColor }} />
          }
          style={{
            width: "100%",
            backgroundColor: appColor.bgPrimaryColor,
            height: 40,
          }}
          placeholder={intl.formatMessage(translationsComponents.AUTHORIZE)}
        />
      </Form.Item>
    </Fragment>
  );
};
export const DisableForm = (props) => {
  const intl = useIntl();
  const { setModalObject, dispatch } = props;
  const { fetchDataEvent } = useFetchAPI();

  const hideModal = () => {
    setModalObject((modalObject) => ({ ...modalObject, state: false }));
  };

  const handleConfirm = async (values) => {
    const data = await fetchDataEvent({
      endpoint: pathAPI.USER_DISABLE_2FA,
      method: API_METHOD.PUT,
      sendData: values,
    });
    if (data?.status) {
      pushNotification({
        mess: `${intl.formatMessage(translationsComponents.DISABLED)}`,
        title: `${intl.formatMessage(translationsComponents.TWO_2FA)}`,
        type: "success",
      });
      hideModal();
      dispatch({ type: DISPATCH_TYPE.MODIFY_USER_2FA });
    }
  };
  return (
    <Fragment>
      <Form layout="vertical" onFinish={handleConfirm}>
        <EnableForm />
        <ModalFooter
          btnRight={intl.formatMessage(translationsComponents.CONFIRM)}
          btnLeft={intl.formatMessage(translationsComponents.CANCEL)}
          handleLeft={hideModal}
        />
      </Form>
    </Fragment>
  );
};
