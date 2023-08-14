import { Menu } from "antd";
import React, { Fragment } from "react";
import styled from "styled-components";
import { appColor } from "~/settings/constants";

const { SubMenu } = Menu;

function MenuLeft(props) {
  const { collapsed, handleRouteSideBar, menuListLeft, activeKey } = props;
  return (
    <Menu
      style={{
        background: "transparent",
        color: "#fff",
        borderRight: 0,
      }}
      mode="inline"
      defaultSelectedKeys={activeKey}
      className="nav-bar-query"
    >
      {menuListLeft.map((menu, index) => {
        const submenu = menu?.children;
        return (
          <Fragment key={index}>
            {submenu && submenu.length > 0 ? (
              <SubMenu
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  borderBottom: `1px solid ${appColor.bgPrimaryColor}`,
                  backgroundColor: "transparent",
                }}
                className="submenu-auth"
                icon={
                  <span
                    style={{
                      marginRight: 6,
                      fontSize: collapsed ? 26 : 22,
                    }}
                  >
                    {menu.icon}
                  </span>
                }
                title="wallet"
                key={`${menu.path}}`}
              >
                {submenu.map((item) => {
                  return (
                    <SubMenuList
                      style={{
                        color: appColor.white,
                        fontSize: 11,
                      }}
                      key={`${item.path}}`}
                      icon={<span>{item.icon}</span>}
                      onClick={() => handleRouteSideBar(item.path)}
                    >
                      {item.title}
                    </SubMenuList>
                  );
                })}
              </SubMenu>
            ) : (
              <Menu.Item
                key={`${menu.path}`}
                icon={
                  <span
                    style={{
                      marginRight: 6,
                      fontSize: collapsed ? 26 : 22,
                    }}
                  >
                    {menu.icon}
                  </span>
                }
                onClick={() => handleRouteSideBar(menu.path)}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  borderBottom: `1px solid ${appColor.bgPrimaryColor}`,
                }}
              >
                {menu.title}
              </Menu.Item>
            )}
          </Fragment>
        );
      })}
    </Menu>
  );
}

export default React.memo(MenuLeft);

const SubMenuList = styled(Menu.Item)`
  border-bottom: 1px solid ${appColor.bgPrimaryColor};
  padding-left: 30px !important;
  &:last-child {
    border-bottom: 0;
  }
`;
