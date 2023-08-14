import { Button, Input, Form } from "antd";
import React from "react";
import { SendOutlined } from "@ant-design/icons";
import translationsComponents from "~/languageProvider/translateKeys";

const InputMess = ({ handleSendMessage, form, username, intl }) => {
  const typeMess = `${intl.formatMessage(translationsComponents.TYPING_MESS)}`;
  const loginChat = `${intl.formatMessage(
    translationsComponents.LOGIN_TO_CHAT
  )}`;
  return (
    <div>
      <Form
        form={form}
        onFinish={handleSendMessage}
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Form.Item name="messages" style={{ marginBottom: 0, width: "100%" }}>
          <Input
            disabled={!username}
            style={{
              backgroundColor: "#2C2E37",
              border: "none",
              color: "#fff",
              outline: "none",
              width: "100%",
              height: 45,
            }}
            placeholder={username ? typeMess : loginChat}
          />
        </Form.Item>
        <div>
          <Form.Item name="messages" style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              style={{
                height: 45,
              }}
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default InputMess;
