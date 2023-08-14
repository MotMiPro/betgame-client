import React from "react";
import { API_METHOD, appColor, pathAPI } from "~/settings/constants";
import { UserOutlined } from "@ant-design/icons";
import { pushNotification } from "~/ultils/pushNotifications";
import {
  ButtonWrapper,
  FormItemWrapper,
  FormWrapper,
  InputWrapper,
} from "../../../UI/components/antComponents";
import { useSelector, useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { DISPATCH_TYPE } from "~/state/ducks/types";

function UserName() {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { userInfos } = useSelector((state) => state.userReducer);

  const { fetchDataEvent } = useFetchAPI();

  const usernameLabel = `${intl.formatMessage(
    translationsComponents.CHANGE_USERNAME
  )}`;
  const usernameLabelWarning = `${intl.formatMessage(
    translationsComponents.WARNING_CHANGE_USERNAME
  )}`;
  const confirmBtn = `${intl.formatMessage(translationsComponents.CONFIRM)}`;
  const statusSuccess = `${intl.formatMessage(translationsComponents.SUCCESS)}`;

  const handleSubmitChangeUserName = async (values) => {
    try {
      const userNameResult = await fetchDataEvent({
        endpoint: pathAPI.USER_CHANGE_NAME,
        method: API_METHOD.PUT,
        sendData: values,
      });
      if (userNameResult?.status) {
        pushNotification({
          title: "BitWin",
          mess: statusSuccess,
          type: "success",
        });
        dispatch({
          type: DISPATCH_TYPE.MODIFY_USER_NAME,
          payload: values?.userName,
        });
        return;
      }
      pushNotification({
        title: "BitWin",
        mess: userNameResult?.fetchData?.message,
        type: "error",
      });
    } catch (error) {
      console.log("change username", error);
    }
  };

  return (
    <FormWrapper
      name="ChangeUserName"
      initialValues={{ remember: true }}
      onFinish={handleSubmitChangeUserName}
      fields={[
        {
          name: ["userName"],
          value: userInfos?._user,
        },
      ]}
      layout="vertical"
    >
      <FormItemWrapper
        label={
          <span
            style={{
              marginBottom: 5,
              color: appColor.textSecondaryColor,
              textAlign: "center",
              display: "block",
            }}
          >
            {usernameLabel}
          </span>
        }
        name="userName"
        rules={[{ required: true, message: usernameLabelWarning }]}
      >
        <InputWrapper
          prefix={<UserOutlined />}
          type="text"
          style={{
            background: appColor.bgPrimaryColor,
            height: "40px",
            color: appColor.textSecondaryColor,
          }}
        />
      </FormItemWrapper>
      <FormItemWrapper style={{ textAlign: "center" }}>
        <ButtonWrapper
          type="primary"
          htmlType="submit"
          style={{ minWidth: 170 }}
        >
          {confirmBtn}
        </ButtonWrapper>
      </FormItemWrapper>
    </FormWrapper>
  );
}

export default React.memo(UserName);
