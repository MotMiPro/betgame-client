import React, { Fragment, useState } from "react";
import { ScreenView } from "../../../UI/components";
import {
  API_METHOD,
  appColor,
  pathAPI,
  pathName,
} from "../../../../settings/constants";
import { LockOutlined } from "@ant-design/icons";
import { CardView } from "../../../UI/components/CardWrapper";
import {
  ButtonWrapper,
  FormItemWrapper,
  FormWrapper,
  InputWrapper,
} from "../../../UI/components/antComponents";
import { pushNotification } from "~/ultils/pushNotifications";
import { strengthChecker } from "~/ultils/checkingStrongPassword";
import { useDispatch } from "react-redux";
import { logoutAction } from "~/state/ducks/actions/user";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { useHistory } from "react-router";

export default function ResetPassword(props) {
  const { title, icon } = props;
  let timeout = null;
  const intl = useIntl();
  const history = useHistory();
  const [newPass, setNewPass] = useState("");
  const [errorMess, setErrorMess] = useState("");
  const dispatch = useDispatch();
  const { fetchDataEvent } = useFetchAPI();

  const statusSuccess = `${intl.formatMessage(translationsComponents.SUCCESS)}`;
  const passNotmatch = `${intl.formatMessage(
    translationsComponents.PASSWORD_NOT_MATCH
  )}`;

  async function handleSubmitChangePassword(values) {
    try {
      var isMatchPass = values.confirmpass.localeCompare(values.newpass);
      if (isMatchPass !== 0) {
        setErrorMess({
          state: "error",
          mess: passNotmatch,
        });
      }
      if (isMatchPass === 0) {
        const passResult = await fetchDataEvent({
          endpoint: pathAPI.USER_CHANGE_PASS,
          method: API_METHOD.PUT,
          sendData: {
            oldPassword: values.currentpass,
            password: values.newpass,
          },
        });
        if (passResult?.status) {
          pushNotification({
            title: "BitWin",
            mess: statusSuccess,
            type: "success",
          });
          dispatch(logoutAction());
          history.push(pathName._LOGIN);
          return;
        }
        pushNotification({
          title: "BitWin",
          mess: passResult?.fetchData?.message,
          type: "error",
        });
      }
    } catch (error) {
      console.log("change pass err", error);
    }
  }

  function onChangeNewPass(evt) {
    const pass = evt.target.value;
    setNewPass(pass);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const passType = pass.length >= 5 && strengthChecker(pass);
      if (passType === "_WEAK") {
        setErrorMess({
          state: "error",
          mess: `${intl.formatMessage(translationsComponents.PASSWORD_WEAK)}`,
        });
      }
      if (passType === "_MEDIUM") {
        setErrorMess({
          state: "warning",
          mess: `${intl.formatMessage(translationsComponents.PASSWORD_MEDIUM)}`,
        });
      }
      if (passType === "_STRONG") {
        setErrorMess({
          state: "success",
          mess: `${intl.formatMessage(translationsComponents.PASSWORD_STRONG)}`,
        });
      }
    }, 300);
  }
  function onChangeConfirmPass(evt) {
    const pass = evt.target.value;
    const isEqualPass = pass.localeCompare(newPass);
    isEqualPass === 0
      ? setErrorMess({
          state: "success",
          mess: `${intl.formatMessage(translationsComponents.PASSWORD_MATCH)}`,
        })
      : setErrorMess({
          state: "error",
          mess: passNotmatch,
        });
  }

  return (
    <CardView title={title} icon={icon}>
      <ScreenView
        bgColor="transparent"
        style={{
          maxWidth: 400,
          margin: "auto",
        }}
      >
        <FormWrapper
          name="resetPassword"
          initialValues={{ remember: true }}
          onFinish={handleSubmitChangePassword}
          layout="vertical"
          className="resetForm"
        >
          {errorMess?.mess && (
            <ScreenView
              style={{
                color:
                  errorMess?.state === "success"
                    ? appColor.textPrimaryColor
                    : errorMess?.state === "warning"
                    ? appColor.orange
                    : appColor.red,
                textAlign: "center",
                background: "rgba(255,255,255,.1)",
                maxWidth: 300,
                width: "100%",
                borderRadius: 5,
                margin: "10px auto",
                padding: "5px",
              }}
            >
              <span>{errorMess?.mess}</span>
            </ScreenView>
          )}
          <div>
            {passWords(intl).map((pass, index) => {
              return (
                <Fragment key={index}>
                  <FormItemWrapper
                    name={pass.name}
                    rules={[
                      {
                        required: true,
                        message: `${intl.formatMessage(
                          translationsComponents.PLEASE_INPUT
                        )} ${pass.warning}`,
                      },
                    ]}
                    label={
                      pass?.label && (
                        <span
                          style={{
                            marginBottom: 5,
                            display: "block",
                            textAlign: "center",
                            textTransform: "capitalize",
                            color: appColor.textSecondaryColor,
                          }}
                        >
                          {pass.label}
                        </span>
                      )
                    }
                  >
                    <InputWrapper.Password
                      type="text"
                      prefix={pass.icon}
                      placeholder={pass.placeholder}
                      style={{
                        background: appColor.bgPrimaryColor,
                        height: "45px",
                        color: appColor.textSecondaryColor,
                        borderRadius: 8,
                      }}
                      onChange={
                        pass.name === "newpass"
                          ? onChangeNewPass
                          : pass.name === "confirmpass"
                          ? onChangeConfirmPass
                          : null
                      }
                    />
                  </FormItemWrapper>
                </Fragment>
              );
            })}
          </div>
          <FormItemWrapper style={{ textAlign: "center" }}>
            <ButtonWrapper
              type="primary"
              htmlType="submit"
              style={{ minWidth: 170 }}
            >
              {intl.formatMessage(translationsComponents.CONFIRM)}
            </ButtonWrapper>
          </FormItemWrapper>
        </FormWrapper>
      </ScreenView>
    </CardView>
  );
}

const passWords = (intl) => [
  {
    label: `${intl.formatMessage(translationsComponents.CURRENT_PASS)}`,
    placeholder: `${intl.formatMessage(translationsComponents.PASSWORD)}`,
    icon: <LockOutlined />,
    name: "currentpass",
    warning: `${intl.formatMessage(translationsComponents.CURRENT_PASS)}`,
  },
  {
    label: `${intl.formatMessage(translationsComponents.NEW_PASS)}`,
    placeholder: `${intl.formatMessage(translationsComponents.PASSWORD)}`,
    icon: <LockOutlined />,
    name: "newpass",
    warning: `${intl.formatMessage(translationsComponents.NEW_PASS)}`,
  },
  {
    label: `${intl.formatMessage(translationsComponents.CONFIRM)}`,
    placeholder: `${intl.formatMessage(
      translationsComponents.CONFIRM_NEW_PASS
    )}`,
    icon: <LockOutlined />,
    name: "confirmpass",
    warning: `${intl.formatMessage(translationsComponents.CONFIRM_PASS)}`,
  },
];
