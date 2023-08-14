import React from "react";
import { FlexView } from "../../components";
import { appColor, navMenu_login_mobile } from "~/settings/constants";

export function MobileMenu(props) {
  const { handleNavBar } = props;
  return (
    <FlexView>
      {navMenu_login_mobile.map((item, index) => {
        return (
          <div key={index} onClick={() => handleNavBar(item)}>
            <span
              style={{
                color: appColor.textPrimaryColor,
                fontSize: 30,
              }}
            >
              {item.icon}
            </span>
          </div>
        );
      })}
    </FlexView>
  );
}
