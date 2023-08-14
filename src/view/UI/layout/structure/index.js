import React from "react";
import { Layout } from "antd";
import iconLogo from "~/assets/images/icon-logo.png";
import MenuLeft from "./MenuLeft";

const { Sider } = Layout;

const SiderLeftPC = (props) => {
  const { handleRouteSideBar, collapsed, menuListLeft, activeKey } = props;

  const handleActive = () => {
    const getNavLeft = document.querySelector(".nav-bar-query");

    if (getNavLeft) {
      const getActive = getNavLeft.querySelector(".ant-menu-item-selected");
      if (!!getActive) {
        getActive.classList.remove("ant-menu-item-selected");
      }
      const getUl = getNavLeft.getElementsByTagName("ul");
      if (getUl) {
        getUl[0].firstChild.classList.add("ant-menu-item-selected");
      }
    }
    const getNavRight = document.querySelector(".nav-bar-query-right");
    const findQuery =
      !!getNavRight && getNavRight.querySelector(".ant-menu-item-selected");
    if (findQuery) {
      findQuery.classList.remove("ant-menu-item-selected");
    }
    handleRouteSideBar("/");
  };

  return (
    <Sider
      width={collapsed ? 70 : 175}
      style={{
        transition: "all .5s ease",
        position: "relative",
        backgroundColor: "#34363d",
      }}
    >
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div className="nav-bar-query">
          <div
            className="logo"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              cursor: "pointer",
              width: "100%",
              maxWidth: "100px",
              margin: "10px auto",
            }}
            onClick={handleActive}
          >
            <img style={{ width: "100%" }} src={iconLogo} alt="logo" />
          </div>
          {menuListLeft?.length > 0 && (
            <MenuLeft
              activeKey={activeKey}
              collapsed={collapsed}
              menuListLeft={menuListLeft}
              handleRouteSideBar={handleRouteSideBar}
            />
          )}
        </div>
        {/* {!collapsed && <SidebarFooter />} */}
      </section>
    </Sider>
  );
};

export default SiderLeftPC;
