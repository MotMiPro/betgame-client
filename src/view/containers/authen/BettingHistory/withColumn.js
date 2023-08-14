import { Tag } from "antd";
import translationsComponents from "~/languageProvider/translateKeys";
import AmountUI from "~/view/UI/components/AmountUI";
import { TurnDiceFace } from "../../games/NewDice/GameResult";
import React from "react";

export const mockMyDiceColumns = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.DATE_TAB)}`,
    dataIndex: "date",
    key: "date",
    responsive: ["xs", "sm"],
    render: (item) => <span>{item}</span>,
  },
  {
    title: `${intl.formatMessage(translationsComponents.AMOUNT_TAB)}`,
    dataIndex: "amount",
    key: "amount",
    responsive: ["xs", "sm"],
    render: (item) => <AmountUI data={item} />,
  },
  {
    title: `${intl.formatMessage(translationsComponents.PROFIT_TAB)}`,
    dataIndex: "profit",
    key: "profit",
    responsive: ["xs", "sm"],
  },
  {
    title: `${intl.formatMessage(translationsComponents.MULTIPLIERS_TAB)}`,
    dataIndex: "multiplier",
    key: "multiplier",
    responsive: ["xs", "sm"],
  },
  {
    title: `${intl.formatMessage(translationsComponents.BUTTON_ROLL_LABEL)}`,
    dataIndex: "roll",
    key: "roll",
    responsive: ["xs", "sm"],
  },
  {
    title: "target",
    dataIndex: "target",
    key: "target",
    responsive: ["xs", "sm"],
  },
  {
    title: "winChance",
    dataIndex: "winChance",
    key: "winChance",
    responsive: ["xs", "sm"],
  },
  {
    title: "Roll By",
    dataIndex: "isRollOver",
    key: "isRollOver",
    responsive: ["xs", "sm"],
    render: (item) => (
      <Tag color={item ? "green" : "magenta"}>
        {item ? "Roll Over" : "Roll Under"}
      </Tag>
    ),
  },
  {
    title: "Win/Lose",
    dataIndex: "isWin",
    key: "isWin",
    responsive: ["xs", "sm"],
    render: (item) => (
      <Tag color={item ? "geekblue" : "orange"}>{item ? "Win" : "Lose"}</Tag>
    ),
  },
];
export const mockMyMoonColumns = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.DATE_TAB)}`,
    dataIndex: "date",
    key: "date",
    responsive: ["xs", "sm"],
    render: (item) => <span>{item}</span>,
  },
  {
    title: `${intl.formatMessage(translationsComponents.MULTIPLIERS_TAB)}`,
    dataIndex: "multiplier",
    key: "multiplier",
    responsive: ["xs", "sm"],
  },
  {
    title: `${intl.formatMessage(translationsComponents.AMOUNT_TAB)}`,
    dataIndex: "amount",
    key: "amount",
    responsive: ["xs", "sm"],
    render: (item) => <AmountUI data={item} />,
  },
  {
    title: `${intl.formatMessage(translationsComponents.PROFIT_TAB)}`,
    dataIndex: "profit",
    key: "profit",
    responsive: ["xs", "sm"],
  },
  {
    title: `${intl.formatMessage(translationsComponents.STATUS_TAB)}`,
    dataIndex: "state",
    key: "state",
    responsive: ["xs", "sm"],
    render: (item) => (
      <Tag color={item === "CASHOUT" ? "yellow" : "green"}>{item}</Tag>
    ),
  },
];
export const mockMyNewDiceColumns = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.DATE_TAB)}`,
    dataIndex: "date",
    key: "date",
    responsive: ["xs", "sm"],
    render: (item) => <span>{item}</span>,
  },
  {
    title: `${intl.formatMessage(translationsComponents.MULTIPLIERS_TAB)}`,
    dataIndex: "multiplier",
    key: "multiplier",
    responsive: ["xs", "sm"],
  },
  {
    title: `${intl.formatMessage(translationsComponents.AMOUNT_TAB)}`,
    dataIndex: "amount",
    key: "amount",
    responsive: ["xs", "sm"],
    render: (item) => <AmountUI data={item} />,
  },
  {
    title: "Win/End",
    dataIndex: "winEnd",
    key: "winEnd",
    responsive: ["xs", "sm"],
    render: (item) => (
      <div>
        <Tag color="green">
          {`${item.isWin ? "Win" : "Lose"} / ${item.isEnd ? "End" : "Run"}`}
        </Tag>
      </div>
    ),
  },
  {
    title: `${intl.formatMessage(translationsComponents.PROFIT_TAB)}`,
    dataIndex: "profit",
    key: "profit",
    responsive: ["xs", "sm"],
  },
  {
    title: `${intl.formatMessage(translationsComponents.RESULT_TAB)}`,
    dataIndex: "numbers",
    key: "numbers",
    responsive: ["xs", "sm"],
    render: (item) => (
      <div style={{ display: "flex" }}>
        {item?.length > 0
          ? item.map((num, idx) => (
              <div
                key={idx}
                style={{
                  padding: 3,
                }}
              >
                <TurnDiceFace number={num} />
              </div>
            ))
          : null}
      </div>
    ),
  },
];
