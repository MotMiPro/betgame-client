import { Menu } from "antd";
import React from "react";
import {
  BalanceViewUI,
  ChatViewUI,
  LangComponent,
  LoginIcon,
} from "../SubNavmenu";

const MenuRight = () => {
  return (
    <Menu
      mode="horizontal"
      style={{
        width: "100%",
        color: "#1da57a",
        background: "transparent",
        justifyContent: "flex-end",
        lineHeight: "60px",
      }}
    >
      <Menu.Item
        key={Math.random()}
        style={{
          borderLeft: "1px solid #686868",
        }}
        className="nav-menu-custom"
      >
        <LangComponent />
      </Menu.Item>
      <Menu.Item
        key={Math.random()}
        style={{
          borderLeft: "1px solid #686868",
        }}
        className="nav-menu-custom"
      >
        <BalanceViewUI />
      </Menu.Item>
      <Menu.Item
        key={Math.random()}
        style={{
          borderLeft: "1px solid #686868",
        }}
        className="nav-menu-custom"
      >
        <ChatViewUI />
      </Menu.Item>
      <Menu.Item
        key={Math.random()}
        style={{
          borderLeft: "1px solid #686868",
        }}
        className="nav-menu-custom"
      >
        <LoginIcon />
      </Menu.Item>
    </Menu>
  );
};

export default React.memo(MenuRight);
