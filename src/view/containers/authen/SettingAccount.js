import React from "react";
// import Favorite from "./Favorite";
import TwoAuthen from "./TwoAuth";
import UserNameftAvatar from "./User";
import HistoryLogin from "./HistoryLogin";
// import Notifications from "./Notification";
import ResetPassword from "./LoginSignup/ResetPassword";
import { FlexView } from "../../UI/components";
import { MutualWrap } from "../../UI/reuseAbles";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";

export default function SettingAccount() {
  const intl = useIntl();
  const twoFA = `${intl.formatMessage(translationsComponents.TWO_2FA)}`;
  // const notify = `${intl.formatMessage(translationsComponents.NOTIFY_SETTING)}`;
  const changepass = `${intl.formatMessage(
    translationsComponents.CHANGE_PASSWORD
  )}`;
  const loginHistory = `${intl.formatMessage(
    translationsComponents.LOGIN_HISTORY
  )}`;
  const username = `${intl.formatMessage(translationsComponents.USER_NAME)}`;
  // const favorite = `${intl.formatMessage(translationsComponents.FAVORITE)}`;

  return (
    <MutualWrap>
      <FlexView direction="column">
        <UserNameftAvatar
          title={username}
          icon={<i className="fas fa-user-edit" />}
        />
        {/* <div style={{ margin: "10px 0", width: "100%" }}>
          <Favorite title={favorite} icon={<i className="fas fa-star" />} />
        </div> */}
        <TwoAuthen title={twoFA} icon={<i className="fas fa-shield-alt" />} />
        {/* <div style={{ margin: "10px 0", width: "100%" }}>
          <Notifications title={notify} icon={<i className="fas fa-bell" />} />
        </div> */}
        <ResetPassword title={changepass} icon={<i className="fas fa-key" />} />
        <div style={{ marginTop: 10, width: "100%" }}>
          <HistoryLogin
            title={loginHistory}
            icon={<i className="fas fa-calendar-alt" />}
          />
        </div>
      </FlexView>
    </MutualWrap>
  );
}
