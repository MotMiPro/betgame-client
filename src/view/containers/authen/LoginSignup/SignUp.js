import { connect } from "react-redux";
import { AuthView } from "../../../UI/components";
import { useHistory, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { SignUpForm } from "../../../presentations/authenForm";
import { useIntl } from "react-intl";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import translationsComponents from "~/languageProvider/translateKeys";
import { pushNotification } from "../../../../ultils/pushNotifications";
import { strengthChecker } from "../../../../ultils/checkingStrongPassword";
import { API_METHOD, pathAPI, pathName } from "../../../../settings/constants";

function SignUpUI() {
  let timeout;
  const intl = useIntl();
  const history = useHistory();
  let { search } = useLocation();
  const [percent, setPercent] = useState(0);
  const [errorMess, setErrorMess] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { fetchDataEvent } = useFetchAPI();

  const handleSwitchToLogin = () => {
    history.push(pathName._LOGIN);
  };

  const handleSignUp = async (values) => {
    try {
      const sendData = {
        email: values.email,
        userName: values.userName,
        password: values.password,
        referralId: values.referralId,
      };
      setIsSubmiting(true);
      const registerReject = await fetchDataEvent({
        endpoint: pathAPI.USER_REGISTER,
        method: API_METHOD.POST,
        sendData,
      });
      setIsSubmiting(false);
      if (registerReject.status) {
        pushNotification({
          title: "BitWin",
          mess: `${intl.formatMessage(
            translationsComponents.REGISTER_SUCCESS
          )}`,
          type: "success",
        });

        setTimeout(() => {
          history.push(pathName._LOGIN);
        }, 1500);
      }
      if (!registerReject.status) {
        setErrorMess({
          status: false,
          mess: registerReject?.fetchData?.message,
        });
      }
    } catch (error) {}
  };

  const handleCheckPassword = (e) => {
    const inputVals = e.target.value;
    if (inputVals.length === 0) {
      setPercent(0);
    }
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const passType = strengthChecker(inputVals);
      if (passType === "_WEAK") {
        setPercent(30);
      }
      if (passType === "_MEDIUM") {
        setPercent(75);
      }
      if (passType === "_STRONG") {
        setPercent(100);
      }
    }, 300);
  };

  return (
    <AuthView
      errorMess={errorMess}
      title={intl.formatMessage(translationsComponents.SIGN_UP)}
      className="sign-up-form"
      handleForm={handleSignUp}
    >
      <SignUpForm
        referralCode={search && search}
        percent={percent}
        isSubmiting={isSubmiting}
        handleCheckPassword={handleCheckPassword}
        handleSwitchToLogin={handleSwitchToLogin}
      />
    </AuthView>
  );
}

export default connect(null, null)(SignUpUI);
