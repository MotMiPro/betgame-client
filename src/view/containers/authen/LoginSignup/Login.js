import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";
import { AuthView } from "../../../UI/components";
import {
  API_METHOD,
  BITWIN_AUTH,
  pathAPI,
  pathName,
  REQUIRED_2FA,
} from "../../../../settings/constants";
import React, { Fragment, useContext, useState } from "react";
import * as authActions from "../../../../state/ducks/actions/user";
import { pushNotification } from "../../../../ultils/pushNotifications";
import {
  ForgotpasswordForm,
  LoginForm,
} from "../../../presentations/authenForm";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";
import { RootContext } from "~/contextAPI/Authen";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { parseUrlToQuery } from "~/ultils/parseQuery";
import { useDispatch } from "react-redux";
import { userOpenPanel } from "~/state/ducks/actions/session";
import * as detectDevice from "react-device-detect";
import { getLocationByIP, getUID, userAgentDetect } from "~/ultils/userDetails";
// import IPinfoWrapper, { IPinfo, AsnResponse } from "node-ipinfo";

const LoginUI = (props) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { authAction } = props;
  const { loginSuccess } = authAction;
  const history = useHistory();
  const [errorMess, setErrorMess] = useState(null);
  const [isForgotpass, setIsForgotpass] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [is2FA, setIs2FA] = useState(false);
  const { setCurrentBalance } = useContext(RootContext);
  const { fetchDataEvent } = useFetchAPI();

  const handleSwitchToSignup = (type) => {
    type ? setIsForgotpass(true) : history.push(pathName._SIGNUP);
  };

  const handleSubmitLogin = async (values) => {
    try {
      setIsSubmiting(true);
      const loginResult = await fetchDataEvent({
        endpoint: pathAPI.USER_LOGIN,
        method: API_METHOD.POST,
        sendData: {
          email: values?.email,
          password: values?.password,
          token2fa: values?.token2fa,
        },
      });
      setIsSubmiting(false);
      if (loginResult?.status) {
        const { user, accessToken, refreshToken } = loginResult?.fetchData;
        const saving = {
          _email: user.email,
          _token: accessToken,
          _user: user.userName,
          _inviteCode: user._id,
          // _password: values.password,
          _affiliate: user.referralId,
          _gaEnabled: user.gaEnabled,
          _avatar: user?.avatar,
          _refresh: refreshToken,
        };
        loginSuccess(saving);
        const authToken = { Authorization: "Bearer " + accessToken };
        const balanceResult = await fetchDataEvent({
          endpoint: pathAPI.GET_BALANCE,
          method: API_METHOD.GET,
          attachAuth: authToken,
        });
        if (balanceResult.status) {
          setCurrentBalance(balanceResult?.fetchData?.balances);
        }
        dispatch(userOpenPanel(false));
        const getPrevPath = sessionStorage.getItem("_PATH");
        history.push(getPrevPath ? getPrevPath : pathName._HOME);
        handleSendUserLogin(authToken);
        localStorage.setItem(BITWIN_AUTH, JSON.stringify(saving));
      }
      if (!loginResult?.status) {
        const errorData = loginResult.fetchData ?? null;
        if (errorData) {
          const errorMessage = errorData?.message;
          if (errorData.code === REQUIRED_2FA) {
            setIs2FA(true);
          }
          setErrorMess({ status: false, mess: errorMessage });
        }
      }
    } catch (error) {}
  };

  const handleSendUserLogin = async (token) => {
    const getIp = await getLocationByIP();
    const browserUserInfo = userAgentDetect();
    const sendData = {
      os: `${browserUserInfo?.os?.name} - ${browserUserInfo?.os?.versionName} - ${browserUserInfo?.os?.version}`,
      ua: detectDevice?.getUA,
      device: `${browserUserInfo?.platform?.type} ${browserUserInfo?.platform?.vendor}`,
      browser: `${browserUserInfo?.browser?.name} - ${browserUserInfo?.browser?.version}`,
      device_id: getUID(),
      ip: getIp,
      countryCode: "",
      countryName: "",
      regionCode: "",
      regionName: "",
      city: "",
    };
    await fetchDataEvent({
      endpoint: pathAPI.USER_LOGIN_HISTORY,
      method: API_METHOD.POST,
      attachAuth: token,
      hasLoading: false,
      sendData,
    });
  };

  const handleForgotpass = async (values) => {
    try {
      const passwordResult = await fetchDataEvent({
        endpoint: `${pathAPI.USER_FORGOT_PASS}${parseUrlToQuery(values)}`,
        method: API_METHOD.GET,
      });
      if (!passwordResult?.status) {
        setErrorMess({
          status: false,
          mess: `${passwordResult?.fetchData?.message}`,
        });
        return;
      }
      pushNotification({
        title: "BitWin",
        mess: `${intl.formatMessage(
          translationsComponents.NOTIFY_NEW_PASSWORD
        )}`,
        type: "success",
      });
      setIsForgotpass(false);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Fragment>
      {isForgotpass ? (
        <AuthView
          errorMess={errorMess}
          title={intl.formatMessage(translationsComponents.FORGOT_PASSWORD)}
          handleForm={handleForgotpass}
        >
          <ForgotpasswordForm
            isSubmiting={isSubmiting}
            handleSwitchToLogin={() => {
              setIsForgotpass(false);
              setErrorMess(null);
            }}
          />
        </AuthView>
      ) : (
        <AuthView
          errorMess={errorMess}
          title={intl.formatMessage(translationsComponents.LOG_IN)}
          handleForm={handleSubmitLogin}
        >
          <LoginForm
            is2FA={is2FA}
            isSubmiting={isSubmiting}
            handleSwitchToSignup={handleSwitchToSignup}
          />
        </AuthView>
      )}
    </Fragment>
  );
};
const mapDispatchToProps = (dispatch) => ({
  authAction: bindActionCreators(authActions, dispatch),
});
const mapStateToProps = (state) => ({
  userLogedIn: state.userReducer.userInfos,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginUI);
