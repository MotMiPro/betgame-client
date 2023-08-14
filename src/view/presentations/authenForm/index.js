import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PicLeftOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import React, { Fragment } from "react";
import { isMobile } from "react-device-detect";
import { Form, Checkbox, Progress } from "antd";
import { appColor } from "../../../settings/constants";
import { parseUrlToQuery } from "~/ultils/parseQuery";
import translationsComponents from "~/languageProvider/translateKeys";
import { InputWrapper, ButtonWrapper } from "../../UI/components/antComponents";

export function LoginForm(props) {
  const intl = useIntl();
  const { handleSwitchToSignup, isSubmiting, is2FA } = props;
  return (
    <Fragment>
      <Form.Item
        label={
          <LabelUI label={intl.formatMessage(translationsComponents.EMAIL)} />
        }
        name="email"
        rules={[
          {
            required: true,
            message: `${intl.formatMessage(
              translationsComponents.WARNING_EMAIL
            )}`,
          },
        ]}
        style={{ color: appColor.textWhiteColor }}
      >
        <InputWrapper
          type="email"
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder={intl.formatMessage(translationsComponents.EMAIL)}
          style={{
            borderRadius: 5,
            background: appColor.bgPrimaryColor,
            height: "40px",
            color: appColor.textSecondaryColor,
          }}
        />
      </Form.Item>
      <Form.Item
        label={
          <LabelUI
            label={intl.formatMessage(translationsComponents.PASSWORD)}
          />
        }
        name="password"
        rules={[
          {
            required: true,
            message: `${intl.formatMessage(
              translationsComponents.WARNING_PASSWORD
            )}`,
          },
        ]}
        style={{ color: appColor.textWhiteColor }}
      >
        <InputWrapper.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder={intl.formatMessage(translationsComponents.PASSWORD)}
          style={{
            borderRadius: 5,
            background: appColor.bgPrimaryColor,
            height: "40px",
            color: appColor.textSecondaryColor,
          }}
        />
      </Form.Item>
      {is2FA ? (
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
          style={{ marginBottom: 10 }}
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
      ) : null}
      <Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>
              <span
                style={{
                  color: appColor.textSecondaryColor,
                }}
              >
                {intl.formatMessage(translationsComponents.REMEMBER_ME)}
              </span>
            </Checkbox>
          </Form.Item>

          <span
            onClick={() => handleSwitchToSignup(true)}
            style={{
              color: appColor.textPrimaryColor,
              cursor: "pointer",
            }}
          >
            {intl.formatMessage(translationsComponents.FORGOT_PASSWORD)}
          </span>
        </div>
      </Form.Item>

      <Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: isMobile ? "center" : "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Form.Item style={isMobile ? {} : { marginRight: 15 }}>
            <ButtonWrapper
              disabled={isSubmiting}
              type="primary"
              htmlType="submit"
              style={{ minWidth: "170px" }}
            >
              {intl.formatMessage(translationsComponents.LOG_IN)}
            </ButtonWrapper>
          </Form.Item>
          <Form.Item>
            <span
              style={{
                marginRight: "10px",
                color: appColor.textSecondaryColor,
              }}
            >
              {intl.formatMessage(translationsComponents.NOT_A_MEMBER)}
            </span>
            <span
              onClick={() => handleSwitchToSignup(false)}
              style={{
                color: appColor.textPrimaryColor,
                cursor: "pointer",
              }}
            >
              {intl.formatMessage(translationsComponents.SIGN_UP_NOW)}
            </span>
          </Form.Item>
        </div>
      </Form.Item>
    </Fragment>
  );
}

export function SignUpForm(props) {
  const {
    percent,
    isSubmiting,
    handleCheckPassword,
    handleSwitchToLogin,
    referralCode = null,
  } = props;
  const intl = useIntl();

  const initRefCode = parseUrlToQuery(referralCode, true) ?? null;

  return (
    <Fragment>
      <Form.Item
        label={
          <LabelUI label={intl.formatMessage(translationsComponents.EMAIL)} />
        }
        name="email"
        rules={[
          {
            required: true,
            message: `${intl.formatMessage(
              translationsComponents.WARNING_EMAIL
            )}`,
          },
        ]}
      >
        <InputWrapper
          prefix={<MailOutlined />}
          style={{
            borderRadius: 5,
            background: appColor.bgPrimaryColor,
            height: "40px",
            color: appColor.textSecondaryColor,
          }}
        />
      </Form.Item>
      <Form.Item
        label={
          <LabelUI
            label={intl.formatMessage(translationsComponents.USER_NAME)}
          />
        }
        name="userName"
        rules={[
          {
            required: true,
            message: `${intl.formatMessage(
              translationsComponents.WARNING_CHANGE_USERNAME
            )}`,
          },
        ]}
      >
        <InputWrapper
          maxLength={15}
          prefix={<UserOutlined />}
          style={{
            borderRadius: 5,
            background: appColor.bgPrimaryColor,
            height: "40px",
            color: appColor.textSecondaryColor,
          }}
        />
      </Form.Item>

      <Form.Item
        label={
          <LabelUI
            label={intl.formatMessage(translationsComponents.PASSWORD)}
          />
        }
        name="password"
        rules={[
          {
            required: true,
            message: `${intl.formatMessage(
              translationsComponents.WARNING_PASSWORD
            )}`,
          },
        ]}
      >
        <InputWrapper.Password
          type="password"
          prefix={<LockOutlined />}
          style={{
            borderRadius: 5,
            background: appColor.bgPrimaryColor,
            height: "40px",
            color: appColor.textSecondaryColor,
          }}
          onChange={handleCheckPassword}
        />
      </Form.Item>
      <Form.Item
        label={
          <LabelUI
            label={intl.formatMessage(translationsComponents.INVITE_CODE)}
          />
        }
        name="referralId"
        style={{ marginBottom: 10 }}
        initialValue={!!initRefCode && initRefCode?.ref}
      >
        <InputWrapper
          type="text"
          prefix={<PicLeftOutlined />}
          style={{
            borderRadius: 5,
            background: appColor.bgPrimaryColor,
            height: "40px",
            color: appColor.textSecondaryColor,
          }}
        />
      </Form.Item>
      <Form.Item
        label={
          <div>
            <LabelUI
              label={intl.formatMessage(translationsComponents.PASSWORD_STRENG)}
            />

            <span style={{ padding: 10, color: turnColor(percent).color }}>
              {turnColor(percent).status}
            </span>
          </div>
        }
      >
        <div style={isMobile ? { textAlign: "center" } : {}}>
          <Progress
            steps={50}
            percent={percent}
            showInfo={false}
            strokeColor={turnColor(percent).color}
            size="small"
            style={{ marginLeft: isMobile ? 0 : 5 }}
          />
        </div>
      </Form.Item>

      <Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: isMobile ? "center" : "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Form.Item style={isMobile ? {} : { marginRight: "15px" }}>
            <ButtonWrapper
              disabled={isSubmiting}
              type="primary"
              htmlType="submit"
              style={{ minWidth: "170px" }}
            >
              {intl.formatMessage(translationsComponents.SIGN_UP)}
            </ButtonWrapper>
          </Form.Item>
          <Form.Item style={isMobile ? { marginBottom: 5 } : {}}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  marginRight: "10px",
                  color: appColor.textSecondaryColor,
                }}
              >
                {intl.formatMessage(translationsComponents.HAVE_AN_ACCOUNT)}
              </span>
              <span
                onClick={handleSwitchToLogin}
                style={{
                  color: appColor.textPrimaryColor,
                  cursor: "pointer",
                }}
              >
                {intl.formatMessage(translationsComponents.LOGIN_IN_NOW)}
              </span>
            </div>
          </Form.Item>
        </div>
      </Form.Item>
    </Fragment>
  );
}

const turnColor = (percent) => {
  if (percent > 1 && percent <= 35) {
    return {
      color: appColor.red,
      status: "weak",
    };
  }
  if (percent >= 35 && percent <= 75) {
    return {
      color: appColor.orange,
      status: "medium",
    };
  }
  if (percent === 100) {
    return {
      color: appColor.textPrimaryColor,
      status: "strong",
    };
  }
  return false;
};

export function ForgotpasswordForm(props) {
  const intl = useIntl();
  const { isSubmiting, handleSwitchToLogin } = props;
  return (
    <Fragment>
      <Form.Item
        label={
          <LabelUI
            label={intl.formatMessage(translationsComponents.EMAIL_ADDRESS)}
          />
        }
        name="email"
        rules={[
          {
            required: true,
            message: `${intl.formatMessage(
              translationsComponents.WARNING_EMAIL
            )}`,
          },
        ]}
        style={{ color: appColor.textWhiteColor }}
      >
        <InputWrapper
          type="email"
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder={intl.formatMessage(translationsComponents.EMAIL)}
          style={{
            borderRadius: 5,
            background: appColor.bgPrimaryColor,
            height: "40px",
            color: appColor.textSecondaryColor,
          }}
        />
      </Form.Item>
      <Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: isMobile ? "center" : "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Form.Item style={isMobile ? {} : { marginRight: 15 }}>
            <ButtonWrapper
              disabled={isSubmiting}
              type="primary"
              htmlType="submit"
              style={{ minWidth: "170px" }}
            >
              {intl.formatMessage(translationsComponents.SUBMIT)}
            </ButtonWrapper>
          </Form.Item>
          <Form.Item>
            <div
              style={{
                color: appColor.textSecondaryColor,
              }}
            >
              <span>
                {intl.formatMessage(translationsComponents.REMEMBER_PASSWORD)}
              </span>
              <span
                onClick={handleSwitchToLogin}
                style={{
                  color: appColor.textPrimaryColor,
                  cursor: "pointer",
                  marginLeft: 5,
                }}
              >
                {intl.formatMessage(translationsComponents.LOG_IN)}
              </span>
            </div>
          </Form.Item>
        </div>
      </Form.Item>
    </Fragment>
  );
}

export const LabelUI = ({ label }) => (
  <span style={{ textTransform: "capitalize" }}>{label}</span>
);
