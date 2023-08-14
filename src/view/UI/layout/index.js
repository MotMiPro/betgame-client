import { Layout } from "antd";
import React, { useState, useEffect, useContext } from "react";
import ChattingComponent from "../../containers/chatting";
import {
  appColor,
  menuLeftListNoneLogin,
  menuLeftListLogged,
  demoBalance,
} from "../../../settings/constants";
import SiderLeftPC from "./structure";
import { ScreenView } from "../components";
import { useHistory } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { MobileMenu } from "./structure/Menus";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { RootContext } from "~/contextAPI/Authen";
import { useIntl } from "react-intl";
import { SettingSidebar } from "~/view/containers/authen";
import MenuLeft from "./structure/MenuLeft";
import MenuRight from "./structure/MenuRight";
import { mobileUserClosePanel } from "~/state/ducks/actions/session";
import { BalanceViewUI } from "./SubNavmenu";
import DepositWaring from "../components/DepositWaring";

const { Header, Sider, Content } = Layout;

const _PATH = "_PATH";
const HOME = "home";
const MENU_LEFT = "menuLeft";
const MENU_RIGHT = "menuRight";
const DROP_DOWN = "dropdown";

const GameLayout = (props) => {
  const intl = useIntl();
  let history = useHistory();
  const dispatch = useDispatch();

  const { pathname: historyPath } = history?.location;
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState(historyPath);
  const [showDropDownLeft, setShowDropDownLeft] = useState(false);

  const [menuListLeft, setMenuListLeft] = useState(menuLeftListNoneLogin(intl));

  const { setCurrentBalance, isDeposit, currentBalance } =
    useContext(RootContext);

  const { userInfos } = useSelector((state) => state.userReducer);
  const { showChating, showSetting, showDropDownRight } = useSelector(
    (state) => state.sessionReducer
  );

  useEffect(() => {
    if (userInfos) {
      setMenuListLeft(menuLeftListLogged(intl));
    } else {
      setCurrentBalance(demoBalance);
      setMenuListLeft(menuLeftListNoneLogin(intl));
    }
  }, [userInfos, intl]);

  const handleToggleSideLeft = () => {
    setCollapsed(!collapsed);
  };

  const handleRouteSideBar = (path) => {
    sessionStorage.setItem(_PATH, path);
    setActiveKey(path);
    history.push(path);
    if (isMobile) {
      setShowDropDownLeft(false);
    }
    if (showDropDownRight) {
      const getNavRight = document.querySelector(".nav-bar-query-right");
      const findQuery = getNavRight.querySelector(".ant-menu-item-selected");
      if (findQuery) {
        findQuery.classList.remove("ant-menu-item-selected");
      }
    }
  };

  const handleNavBar = (nav) => {
    switch (nav.tag) {
      case HOME:
      case MENU_LEFT:
      case MENU_RIGHT:
        history.push(nav.path);
        if (isMobile) {
          setShowDropDownLeft(false);
          dispatch(mobileUserClosePanel(false));
        }
        return;
      case DROP_DOWN:
        if (nav.path === MENU_LEFT) {
          setShowDropDownLeft(!showDropDownLeft);
          dispatch(mobileUserClosePanel(false));
        }
        if (nav.path === MENU_RIGHT) {
          dispatch(mobileUserClosePanel(!showDropDownRight));
          setShowDropDownLeft(false);
        }
        return;

      default:
        return;
    }
  };

  return (
    <Layout>
      {!isMobile && (
        <SiderLeftPC
          collapsed={collapsed}
          activeKey={activeKey}
          menuListLeft={menuListLeft}
          handleRouteSideBar={handleRouteSideBar}
        />
      )}
      <Layout
        style={{
          transition: "all .2s ease",
          height: "100vh",
        }}
      >
        <Header
          id="navbar"
          style={{
            position: "relative",
            zIndex: 1000,
            padding: 0,
            background: appColor.bgSecondaryColor,
            lineHeight: isMobile ? "55px" : "64px",
            borderBottom: `1px solid ${appColor.bgPrimaryColor}`,
            lineHeight: isMobile ? "35px" : "55px",
          }}
          className="header-custom"
        >
          {isMobile ? (
            <section>
              <ScreenView
                style={{
                  padding: "0 10px",
                  borderBottom: `1px solid ${appColor.borderPrimaryColor}`,
                  zIndex: 201,
                  position: "relative",
                }}
              >
                <MobileMenu handleNavBar={handleNavBar} />
                <BalanceViewUI />
              </ScreenView>
            </section>
          ) : (
            <section
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                onClick={handleToggleSideLeft}
                className="collaps-icon"
                style={{ cursor: "pointer" }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </div>
              <MenuRight />
            </section>
          )}
        </Header>

        <Layout style={{ position: "relative" }}>
          <Content
            className="site-layout-background"
            style={{
              overflow: "scroll",
              background: appColor.bgPrimaryColor,
              position: "relative",
            }}
          >
            {isDeposit && currentBalance[0]?.amount === 0 && <DepositWaring />}
            {props.children}
          </Content>
          <Sider
            width={
              showChating ? (isMobile ? "100vw" : 300) : showSetting ? 200 : 0
            }
            style={{
              transition: "all .5s ease",
              position: "relative",
              backgroundColor: "#34363d",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {showChating && <ChattingComponent />}
            {showSetting && <SettingSidebar />}
          </Sider>
          <div
            style={{
              position: "fixed",
              top: 75,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: showDropDownLeft || showDropDownRight ? "100vh" : "0px",
              transition: "all .3s ease",
              zIndex: 201,
              overflow: "auto",
              background: appColor.bgSecondaryColor,
            }}
          >
            {
              <ScreenView style={{ padding: 0, height: "auto" }}>
                {showDropDownLeft && (
                  <div>
                    <MenuLeft
                      activeKey={activeKey}
                      menuListLeft={menuListLeft}
                      handleRouteSideBar={handleRouteSideBar}
                    />
                  </div>
                )}
                {showDropDownRight && (
                  <div style={{ height: "calc(100vh)" }}>
                    <SettingSidebar />
                  </div>
                )}
              </ScreenView>
            }
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default React.memo(GameLayout);
