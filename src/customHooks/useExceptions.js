import { useContext } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { RootContext } from "~/contextAPI/Authen";
import { logoutAction } from "~/state/ducks/actions/user";
import { demoBalance, pathName } from "~/settings/constants";
import { pushNotification } from "~/ultils/pushNotifications";
import translationsComponents from "~/languageProvider/translateKeys";

const authenFailCode = ["USER014", "USER015", "USER016"];
const notEnoughBalance = ["WSER002", "FUER008"];

export const useExceptions = () => {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useDispatch();
  const { setWaiting, setCurrentBalance, setIsDeposit } =
    useContext(RootContext);

  const handleException = async (data) => {
    if (!!data) {
      setWaiting(true);
      if (authenFailCode.includes(data?.error?.code)) {
        pushNotification({
          time: 5,
          type: "error",
          title: "Bitwin",
          mess: `${intl.formatMessage(translationsComponents.SESSION_EXPIRED)}`,
        });
        dispatch(logoutAction());
        setCurrentBalance(demoBalance);
        history.push(pathName._LOGIN);
      } else if (notEnoughBalance.includes(data?.error?.code)) {
        pushNotification({
          time: 5,
          type: "error",
          title: "Bitwin",
          mess: exceptionMessages(intl)[data?.error?.code],
        });
        setIsDeposit(true);
      } else {
        pushNotification({
          time: 5,
          type: "error",
          title: "Bitwin",
          mess: exceptionMessages(intl)[data?.error?.code],
        });
      }
      setWaiting(false);
      return {
        status: false,
        fetchData: {
          ...data?.error,
          message: exceptionMessages(intl)[data?.error?.code],
        },
      };
    }
  };

  return { handleException };
};

export const exceptionMessages = (intl) => {
  return {
    USER001: intl.formatMessage(
      translationsComponents.USER001_INVALID_USER_NAME
    ),
    USER002: intl.formatMessage(translationsComponents.USER002_INVALID_EMAIL),
    USER003: intl.formatMessage(
      translationsComponents.USER003_INVALID_PASSWORD
    ),
    USER004: intl.formatMessage(translationsComponents.USER004_USER_EXIST),
    USER005: intl.formatMessage(
      translationsComponents.USER005_INVALID_REFERRAL_ID
    ),
    USER006: intl.formatMessage(translationsComponents.USER006_EMAIL_NOT_EXIST),
    USER007: intl.formatMessage(
      translationsComponents.USER007_EMAIL_NOT_VERIFIED
    ),
    USER008: intl.formatMessage(translationsComponents.USER008_EMAIL_BLOCKED),
    USER009: intl.formatMessage(translationsComponents.USER009_REQUIRED_2FA),
    USER010: intl.formatMessage(translationsComponents.USER010_USERNAME_EXIST),
    USER011: intl.formatMessage(
      translationsComponents.USER011_EMAIL_PASSWORD_INCORRECT
    ),
    USER012: intl.formatMessage(
      translationsComponents.USER012_INVALID_EMAIL_CODE
    ),
    USER013: intl.formatMessage(
      translationsComponents.USER013_EMAIL_ALREADY_ACTIVED
    ),
    USER014: intl.formatMessage(
      translationsComponents.USER014_INVALID_TOKEN_RESET
    ),
    USER015: intl.formatMessage(translationsComponents.USER015_TOKEN_EXPIRED),
    USER016: intl.formatMessage(translationsComponents.USER016_AUTH_FAIL),
    USER017: intl.formatMessage(
      translationsComponents.USER017_INVALID_CREDENTIALS
    ),
    USER018: intl.formatMessage(
      translationsComponents.USER018_INVALID_2FA_TOKEN
    ),
    USER019: intl.formatMessage(
      translationsComponents.USER019_2FA_ALREADY_ENABLED
    ),
    USER020: intl.formatMessage(
      translationsComponents.USER020_2FA_ALREADY_DISABLED
    ),
    USER021: intl.formatMessage(translationsComponents.USER021_MIN_PASSWORD),
    USER023: intl.formatMessage(translationsComponents.USER023_INVALID_STATE),
    USER024: intl.formatMessage(translationsComponents.USER024_INVALID_IMAGE),

    WSER001: intl.formatMessage(translationsComponents.WSER001_INVALID_INPUT),
    WSER002: intl.formatMessage(
      translationsComponents.WSER002_NOT_ENOUGH_BALANCE
    ),
    WSER003: intl.formatMessage(translationsComponents.WSER003_INVALID_USER),
    WSER004: intl.formatMessage(translationsComponents.WSER004_GAME_PROGRESS),
    WSER005: intl.formatMessage(translationsComponents.WSER005_GAME_CRASHED),
    WSER006: intl.formatMessage(
      translationsComponents.WSER006_GAME_NOT_LAUCHING
    ),
    WSER007: intl.formatMessage(translationsComponents.WSER007_ALREADY_BET),
    WSER008: intl.formatMessage(translationsComponents.WSER008_NOT_BET),
    WSER009: intl.formatMessage(translationsComponents.WSER009_ALREADY_CASHOUT),
    WSER010: intl.formatMessage(translationsComponents.WSER010_USDT_ACCEPTED),

    FUER001: intl.formatMessage(translationsComponents.FUER001_INVALID_NETWORK),
    FUER002: intl.formatMessage(
      translationsComponents.FUER002_INVALID_CURRENCY
    ),
    FUER003: intl.formatMessage(
      translationsComponents.FUER003_CANT_GET_ADDRESS
    ),
    FUER004: intl.formatMessage(translationsComponents.FUER004_INVALID_ADDRESS),
    FUER005: intl.formatMessage(translationsComponents.FUER005_INVALID_AMOUNT),
    FUER006: intl.formatMessage(
      translationsComponents.FUER006_INVALID_CURRENCY
    ),
    FUER007: intl.formatMessage(
      translationsComponents.FUER007_INVALID_MIN_AMOUNT
    ),
    FUER008: intl.formatMessage(
      translationsComponents.FUER008_NOT_ENOUGH_BALANCE
    ),
    FUER009: intl.formatMessage(
      translationsComponents.FUER009_WITHDRAWAL_NOT_FOUND
    ),
    FUER010: intl.formatMessage(
      translationsComponents.FUER010_WITHDRAWAL_ALREADY_APPROVED
    ),
    FUER011: intl.formatMessage(
      translationsComponents.FUER011_CANT_CANCEL_WITHDRAWAL
    ),
    SWER003: intl.formatMessage(translationsComponents.SWER003_PRICE_OUTDATE),
  };
};
