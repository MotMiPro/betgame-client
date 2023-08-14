import React, { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import {
  appColor,
  listMenuNoneLogin,
  listMenuLoggedin,
  demoBalance,
  BITWIN_AUTH,
} from "../../../settings/constants";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { useHistory } from "react-router";
import { logoutAction } from "~/state/ducks/actions/user";
import { RootContext } from "~/contextAPI/Authen";
import { isMobile } from "react-device-detect";
import { mobileUserClosePanel } from "~/state/ducks/actions/session";
import { LangComponent } from "~/view/UI/layout/SubNavmenu";

const ACCOUNT = "account";
const LOGOUT = "logout";

function SettingSidebar() {
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useDispatch();
  const { userInfos } = useSelector((state) => state.userReducer);
  const { setCurrentBalance } = useContext(RootContext);
  const [authMenu, setAuthMenu] = useState(null);

  useEffect(() => {
    if (userInfos) {
      const result = listMenuLoggedin(intl).map((item) => {
        if (item.tag === ACCOUNT) {
          item.title = userInfos?._email;
        }
        return item;
      });
      if (result) {
        setAuthMenu(result);
      }
    } else {
      setAuthMenu(listMenuNoneLogin(intl));
    }
  }, [userInfos, intl]);

  const handleNavigate = (item) => {
    if (isMobile) {
      dispatch(mobileUserClosePanel(false));
    }
    history.push(item.path);
    if (item.tag === LOGOUT) {
      setCurrentBalance(demoBalance);
      dispatch(logoutAction());
      localStorage.removeItem(BITWIN_AUTH);
    }
    const getClass = document.querySelector(".nav-bar-query");
    if (getClass) {
      const getActive = getClass.querySelector(".ant-menu-item-selected");
      if (!!getActive) {
        getActive.classList.remove("ant-menu-item-selected");
      }
    }
  };

  return (
    authMenu?.length > 0 && (
      <section
        style={{
          height: "100vh",
          position: "fixed",
          width: "100%",
        }}
      >
        <Menu
          style={{
            background: "transparent",
            color: appColor.textSecondaryColor,
            borderRight: 0,
          }}
          mode="inline"
          className="nav-bar-query-right"
        >
          {isMobile && (
            <Menu.Item
              key={0}
              style={{
                borderBottom: `1px solid ${appColor.bgPrimaryColor}`,
              }}
            >
              <LangComponent />
            </Menu.Item>
          )}
          {authMenu.map((item, index) => {
            return (
              <Menu.Item
                icon={<span style={{ marginRight: 10 }}>{item.icon}</span>}
                onClick={() => handleNavigate(item)}
                key={index + 1}
                style={{
                  ...turnStyle(item),
                  borderBottom: `1px solid ${appColor.bgPrimaryColor}`,
                }}
              >
                {item.title}
              </Menu.Item>
            );
          })}
        </Menu>
      </section>
    )
  );
}
export default React.memo(SettingSidebar);

const turnStyle = (item) => {
  if (item?.tag !== ACCOUNT)
    return {
      textTransform: `capitalize`,
    };
};
