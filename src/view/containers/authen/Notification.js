import React from "react";
import { Form, Checkbox } from "antd";
import { ScreenView } from "../../UI/components";
import { CardView } from "../../UI/components/CardWrapper";
import { ButtonWrapper } from "../../UI/components/antComponents";
import { appColor } from "../../../settings/constants";
import translationsComponents from "~/languageProvider/translateKeys";
import { useIntl } from "react-intl";

export default function Notifications(props) {
  const intl = useIntl();
  const { title, icon = null } = props;

  const onFinish = (values) => {
    console.log("Notify", values);
  };
  return (
    <CardView title={title} icon={icon} paddingbody="24px 5px">
      <ScreenView bgColor="transparent">
        <Form
          name="notifications"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <section>
            <div style={{ marginBottom: 10 }}>
              <span style={{ color: appColor.textWhiteColor }}>
                {intl.formatMessage(translationsComponents.TWO_2FA_STATUS)}
              </span>
            </div>
            <ButtonWrapper
              type="primary"
              htmlType="submit"
              style={{ minWidth: 170 }}
            >
              {intl.formatMessage(translationsComponents.SET_NOTIFY)}
            </ButtonWrapper>
          </section>
          <section style={{ marginTop: 50 }}></section>
        </Form>
      </ScreenView>
    </CardView>
  );
}

const columnTable = [
  {
    title: "notification type",
    dataIndex: "notify",
    key: "notify",
    render: (notify) => {
      return {
        children: (
          <div>
            <h4 style={{ color: appColor.textSecondaryColor }}>{notify} </h4>
          </div>
        ),
      };
    },
  },
  {
    title: "e-mail",
    dataIndex: "email",
    key: "email",
    render: () => <Checkbox className="checkbox-notify" />,
    align: "center",
  },
  {
    title: "web push",
    dataIndex: "webpush",
    key: "webpush",
    render: () => <Checkbox className="checkbox-notify" />,
    align: "center",
  },
];

const dataTable = [
  {
    key: "1",
    notify: `Event reminder`,
    email: true,
    webpush: "",
  },
  {
    key: "2",
    notify: "Bet confirmed",
    email: true,
    webpush: "",
  },
  {
    key: "3",
    notify: "Bet won",
    email: true,
    webpush: "",
  },
  {
    key: "4",
    notify: "Bet lost",
    email: true,
    webpush: "",
  },
  {
    key: "5",
    notify: "Deposit processing",
    email: true,
    webpush: "",
  },
  {
    key: "6",
    notify: "Deposit confirmed",
    email: true,
    webpush: "",
  },
  {
    key: "7",
    notify: "Withdrawal confirmed",
    email: true,
    webpush: "",
  },
];

const plainOptions = [
  {
    label: "Event reminder",
    value: "eventreminder",
    ico: <i className="fas fa-stopwatch"></i>,
  },
  {
    label: "Bet confirmed",
    value: "betconfirmed",
    ico: <i className="fas fa-info-circle"></i>,
  },
  { label: "Bet won", value: "Betwon", ico: <i className="fas fa-coins"></i> },
  {
    label: "Bet lost",
    value: "Bet lost",
    ico: <i className="fas fa-ghost"></i>,
  },
  {
    label: "Deposit processing",
    value: "Deposit processing",
    ico: <i className="fas fa-donate"></i>,
  },
  {
    label: "Deposit confirmed",
    value: "Deposit confirmed",
    ico: <i className="fas fa-check-square"></i>,
  },
  {
    label: "Withdrawal confirmed",
    value: "Withdrawal confirmed",
    ico: <i className="fas fa-sync-alt"></i>,
  },
  {
    label: "Check all",
    value: "all",
    ico: <i className="fas fa-allergies"></i>,
  },
];
