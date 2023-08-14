import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_METHOD, appColor, pathAPI } from "~/settings/constants";
import NotFound from "../../../UI/components/NotFoundPage";
import { UnlockOutlined } from "@ant-design/icons";
import { Form } from "antd";
import { ScreenView } from "../../../UI/components";
import {
  ButtonWrapper,
  InputWrapper,
} from "../../../UI/components/antComponents";
import { pathName } from "../../../../settings/constants";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { FailRequest, SuccessRequest } from "../../../UI/reuseAbles/NotifyTag";

const PasswordResetter = () => {
  let { hash } = useParams();
  const [successUI, setSuccessUI] = useState(false);
  const [failedUI, setFailedUI] = useState(false);
  const [iserrorUrl, setIserrorUrl] = useState(false);
  const { fetchDataEvent } = useFetchAPI();

  useEffect(() => {
    if (!hash) {
      setIserrorUrl(true);
    }
  }, [hash]);

  const handleResetPass = async (values) => {
    if (hash) {
      try {
        values.token = hash;
        const passResult = await fetchDataEvent({
          endpoint: pathAPI.USER_RESET_PASSWORD,
          method: API_METHOD.PUT,
          sendData: values,
        });
        if (passResult?.status) {
          setSuccessUI(true);
        }
        if (!passResult?.status) {
          setFailedUI(true);
        }
      } catch (error) {}
    }
  };

  return (
    <main
      style={{
        height: "calc(100vh - 64px )",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        color: appColor.textSecondaryColor,
      }}
    >
      {iserrorUrl ? (
        <NotFound />
      ) : (
        <Fragment>
          {!successUI && !failedUI ? (
            <ScreenView
              style={{
                maxWidth: "450px",
                padding: 30,
                height: "auto",
                width: "100%",
              }}
            >
              <div>
                <Form className="resetForm" onFinish={handleResetPass}>
                  <Form.Item
                    label={
                      <span
                        style={{
                          color: appColor.white,
                        }}
                      >
                        Password
                      </span>
                    }
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <InputWrapper.Password
                      prefix={
                        <UnlockOutlined className="site-form-item-icon" />
                      }
                      placeholder="Type new password"
                      style={{
                        borderRadius: 5,
                        background: appColor.bgPrimaryColor,
                        height: "40px",
                        color: appColor.textSecondaryColor,
                      }}
                    />
                  </Form.Item>
                  <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
                    <ButtonWrapper
                      disabled={null}
                      type="primary"
                      htmlType="submit"
                      style={{ minWidth: "170px" }}
                    >
                      Submit
                    </ButtonWrapper>
                  </Form.Item>
                </Form>
              </div>
            </ScreenView>
          ) : (
            <ScreenView
              style={{
                maxWidth: "550px",
                height: "auto",
                width: "100%",
                textAlign: "center",
                padding: "10px 20px",
                borderRadius: 5,
                position: "relative",
                boxShadow: `rgba(0, 0, 0, 0.1) 0px 10px 50px`,
              }}
            >
              {successUI && <SuccessRequest url={pathName._LOGIN} />}
              {failedUI && <FailRequest />}
            </ScreenView>
          )}
        </Fragment>
      )}
    </main>
  );
};
export default PasswordResetter;
