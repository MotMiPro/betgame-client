import React, { useEffect, useState } from "react";
import { Form, Empty } from "antd";
import { appColor } from "~/settings/constants";
import { socketTypes } from "~/settings/config";
import Messages from "./Messages";
import InputMess from "./InputMess";
import styled from "styled-components";
import {
  initiatesocketChat,
  chatDisconnectSocket,
  chatSocketSubscriber,
  chatSocketEmitter,
} from "~/customHooks/useSocket";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";

function ChattingComponent() {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [allMess, setAllMess] = useState([]);
  const { userInfos } = useSelector((state) => state.userReducer);

  useEffect(() => {
    const tokenConnect = {
      query: {
        accessToken: `Bearer ${userInfos?._token}`,
      },
    };
    userInfos?._user ? initiatesocketChat(tokenConnect) : initiatesocketChat();
    return () => {
      chatDisconnectSocket();
    };
  }, [userInfos]);

  useEffect(() => {
    chatSocketSubscriber(socketTypes.CHAT_NOTIFICATION, (data) => {
      const mess = data?.oldMessages ?? [];
      if (mess?.length > 0) {
        const tempArr = mess.reverse().map((item) => {
          return {
            user: item?.userName,
            text: item?.message,
            timeDate: item?.createdAt,
            avatar: item?.userId?.avatar,
          };
        });
        setAllMess([...tempArr]);
      }
    });
  }, []);

  useEffect(() => {
    chatSocketSubscriber(socketTypes.CHAT_MESSAGES, (data) => {
      const newMessage = data?.newMessage;
      setAllMess((mess) => [
        ...mess,
        {
          user: newMessage?.userName,
          text: newMessage?.message,
          timeDate: newMessage?.createdAt,
          avatar: newMessage?.userId?.avatar,
        },
      ]);
    });
  }, []);

  function handleSendMessage({ messages }) {
    if (messages) {
      const trimMess = messages.replace(/^[ ]+/g, "");
      chatSocketEmitter(
        socketTypes.CHAT_SEND_MESSAGE,
        {
          message: trimMess,
          accessToken: `Bearer ${userInfos?._token}`,
        },
        (err) => {
          console.log(err);
        }
      );
      form.resetFields(["messages"]);
    }
  }

  return (
    <section
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {allMess?.length > 0 ? (
          <ChatWrapper>
            <MessWrapper id="box">
              {allMess.map((item, index) => {
                return (
                  <div key={index}>
                    <Messages
                      index={index}
                      text={item.text}
                      userName={item.user}
                      iconLogo={item?.avatar}
                      timeDate={item?.timeDate}
                      isOwner={userInfos?._user === item.user}
                    />
                  </div>
                );
              })}
            </MessWrapper>
          </ChatWrapper>
        ) : (
          <div style={{ height: "100%" }}>
            <Empty
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                color: appColor.textSecondaryColor,
              }}
              description={intl.formatMessage(translationsComponents.START_NOW)}
            />
          </div>
        )}
        {userInfos && (
          <InputMess
            intl={intl}
            handleSendMessage={handleSendMessage}
            form={form}
            username={userInfos}
          />
        )}
      </div>
    </section>
  );
}

export default React.memo(ChattingComponent);

const MessWrapper = styled.div`
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column-reverse;
  flex-direction: column-reverse;
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
`;
const ChatWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  overflow-y: scroll;
  transform: rotate(180deg);
  direction: rtl;
`;
