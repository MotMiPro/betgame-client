import React from "react";
import { ScreenView } from "../../../UI/components";
import { CardView } from "../../../UI/components/CardWrapper";
import { ColWrapper, RowWrapper } from "../../../UI/components/antComponents";
import UserAvatar from "./Avatar";
import UserName from "./UserName";

function UserNameftAvatar(props) {
  const { title, icon = null } = props;

  return (
    <CardView title={title} icon={icon}>
      <ScreenView
        bgColor="transparent"
        style={{
          margin: "auto",
        }}
      >
        <RowWrapper
          gutter={16}
          style={{
            alignItems: "center",
          }}
        >
          <ColWrapper xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
            <UserAvatar />
          </ColWrapper>
          <ColWrapper xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}></ColWrapper>
          <ColWrapper xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
            <UserName />
          </ColWrapper>
        </RowWrapper>
      </ScreenView>
    </CardView>
  );
}

export default React.memo(UserNameftAvatar);
