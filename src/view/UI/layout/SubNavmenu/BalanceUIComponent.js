import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
  Fragment,
} from "react";
import { isMobile } from "react-device-detect";
import { connect, useSelector } from "react-redux";
import { RootContext } from "~/contextAPI/Authen";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import {
  API_METHOD,
  appColor,
  BITWIN_AUTH,
  demoBalance,
  pathAPI,
  pathName,
  USDT,
} from "~/settings/constants";
import USDT_COIN from "~/assets/images/coins/tether.svg";
import { bindActionCreators } from "redux";
import * as authActions from "../../../../state/ducks/actions/user";
import { useHistory } from "react-router";

const exceptionRoute = "fund/withdraw";

const BalanceViewUI = (props) => {
  const { authAction } = props;
  const history = useHistory();
  const { fetchDataEvent } = useFetchAPI();
  const { loginSuccess } = authAction;
  const { authHeader } = useSelector((state) => state.userReducer);
  const { currentBalance, setCurrentBalance } = useContext(RootContext);
  const [localBalance, setLocalBalance] = useState(null);

  const balance = useMemo(
    () =>
      localBalance?.length > 0 &&
      localBalance.find((item) => item.currency === USDT),
    [localBalance]
  );

  useEffect(() => {
    setLocalBalance(currentBalance);
  }, [currentBalance]);

  const handleGetBalance = useCallback(async (auth) => {
    try {
      if (auth) {
        const result = await fetchDataEvent({
          endpoint: pathAPI.GET_BALANCE,
          method: API_METHOD.GET,
          attachAuth: auth,
          hasLoading: false,
        });
        if (result.status) {
          setLocalBalance(result?.fetchData?.balances);
          setCurrentBalance(result?.fetchData?.balances);
        }
        if (!result.status) {
          setCurrentBalance(demoBalance);
          setLocalBalance(demoBalance);
        }
      }
      if (!auth && !history?.location?.pathname.includes(exceptionRoute)) {
        const getAuth = JSON.parse(localStorage.getItem(BITWIN_AUTH)) || null;
        if (!!getAuth) {
          try {
            const result = await fetchDataEvent({
              endpoint: pathAPI.USER_REFRESH_TOKEN,
              method: API_METHOD.POST,
              sendData: { refreshToken: getAuth?._refresh },
              hasLoading: false,
            });
            if (result?.status) {
              const saving = {
                ...getAuth,
                _refresh: result?.fetchData?.refreshToken,
                _token: result?.fetchData?.accessToken,
              };
              localStorage.setItem(BITWIN_AUTH, JSON.stringify(saving));
              loginSuccess(saving);
            }
            if (!result?.status) {
              setCurrentBalance(demoBalance);
              setLocalBalance(demoBalance);
              history.push(pathName._LOGIN);
            }
          } catch (error) {
            setCurrentBalance(demoBalance);
            setLocalBalance(demoBalance);
            history.push(pathName._LOGIN);
          }
        } else {
          history.push(pathName._LOGIN);
        }
      }
    } catch (error) {
      console.log({ error });
      history.push(pathName._LOGIN);
      setCurrentBalance(demoBalance);
      setLocalBalance(demoBalance);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      handleGetBalance(authHeader);
    }, 1000);
  }, [authHeader]);

  // useEffect(() => {
  //   document.addEventListener("visibilitychange", async () => {
  //     if (document.hidden) {
  //       console.log("not visible");
  //     } else {
  //     }
  //   });
  // }, [authHeader]);

  return isMobile ? (
    <Fragment>
      <div style={{ textAlign: "center" }}>
        {balance?.amount && (
          <span
            style={{
              fontSize: 16,
              color: appColor.white,
              transition: "all .3s ease-in-out",
            }}
          >{`${balance?.amount > 0 ? balance?.amount : 0} ${
            balance?.currency
          }`}</span>
        )}
      </div>
    </Fragment>
  ) : (
    <div>
      <span style={{ marginRight: 5 }}>
        <img style={{ width: 20, height: 20 }} src={USDT_COIN} alt="usdt" />
      </span>
      <span>{balance?.amount}</span>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  authAction: bindActionCreators(authActions, dispatch),
});

export default connect(null, mapDispatchToProps)(React.memo(BalanceViewUI));
