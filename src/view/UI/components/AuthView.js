import React from "react";
import { appColor } from "../../../settings/constants";
import { FormItemWrapper, FormWrapper, RowWrapper } from "./antComponents";
import ScreenView from "./ScreenView";

const AuthView = (props) => {
  const { title, handleForm, errorMess } = props;
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ScreenView
        style={{
          maxWidth: "650px",
          padding: 30,
          height: "auto",
          width: "100%",
        }}
      >
        <RowWrapper style={{ justifyContent: "center" }}>
          <FormWrapper
            layout="vertical"
            className="login-form resetForm"
            initialValues={{
              remember: true,
            }}
            onFinish={handleForm}
          >
            <FormItemWrapper style={{ marginBottom: 0 }}>
              <div style={{ color: appColor.textWhiteColor, marginBottom: 15 }}>
                <h1
                  style={{
                    fontSize: 30,
                    color: appColor.textWhiteColor,
                    textTransform: "capitalize",
                  }}
                >
                  {title}
                </h1>
              </div>
            </FormItemWrapper>
            <span
              style={{
                color: errorMess?.status
                  ? appColor.textPrimaryColor
                  : appColor.red,
                padding: "5px 0",
              }}
            >
              {errorMess?.mess}
            </span>
            {props.children}
          </FormWrapper>
        </RowWrapper>
      </ScreenView>
    </div>
  );
};

export default React.memo(AuthView);
