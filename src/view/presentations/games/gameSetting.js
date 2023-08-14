import { parseCurrency } from "~/ultils/currency";
import React from "react";
import { appColor } from "~/settings/constants";
import { flatNumber } from "~/ultils/excuse";
import { iconCollection, parseTimer } from "~/settings/config";
import { Fragment } from "react";
import { Row, Col, Tag } from "antd";
import { v4 as uuid } from "uuid";
import AmountUI, { UsersUI } from "~/view/UI/components/AmountUI";
import { GameIcon } from "~/view/UI/components/GameIcons";
import translationsComponents from "~/languageProvider/translateKeys";

export const turnDiceMygame = (list, isSocket = false) => {
  if (list?.length === 0) return;
  return list.map((item, index) => {
    return {
      date: parseTimer(item?.createdAt, !isSocket),
      amount: item,
      isRollOver: item?.isRollOver,
      multiplier: item?.multiplier,
      profit: item?.profit,
      isWin: item?.isWin,
      roll: item?.roll,
      target: item?.target,
      winChance: item?.winChance,
      key: `${uuid()}_${index}`,
    };
  });
};

export const turnMoonMygame = (list, isSocket = false) => {
  if (list?.length === 0) return;
  return list.map((item, index) => {
    return {
      date: parseTimer(item.createdAt, !isSocket),
      amount: item,
      gameId: item?.gameId,
      multiplier: item?.multiplier,
      profit: item?.profit,
      state: item?.state,
      key: `${uuid()}_${index}`,
    };
  });
};
export const turnNewDiceMygame = (list, isSocket = false) => {
  if (list?.length === 0) return;
  return list.map((item, index) => {
    return {
      date: parseTimer(item.createdAt, !isSocket),
      amount: item,
      winEnd: item,
      multiplier: item?.multiplier,
      profit: item?.profit,
      numbers: item?.numbers,
      key: `${uuid()}_${index}`,
    };
  });
};
export const turnSlotMyGame = (list, isSocket = false) => {
  if (list?.length === 0) return;
  return list.map((item, index) => {
    return {
      date: parseTimer(item.createdAt, !isSocket),
      amount: item,
      isWin: item?.isWin,
      profit: item?.profit,
      numbers: item?.numbers,
      multipliers: item?.multipliers,
      key: `${uuid()}_${index}`,
    };
  });
};
export const turnTableRealtime = (list) => {
  if (list?.length === 0) return;
  return list.map((item, index) => {
    return {
      date: parseTimer(item.createdAt, true),
      user: item?.userId?.userName,
      amount: item,
      game: item?.game,
      multiplier: item?.multipliers ?? item?.multiplier,
      profit: item?.profit,
      numbers: item?.numbers,
      roll: item?.roll,
      key: `${uuid()}_${index}`,
    };
  });
};

export const mockSlotMygameColumns = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.DATE_TAB)}`,
    dataIndex: "date",
    key: "date",
    responsive: ["xs", "sm"],
  },
  {
    title: `Win`,
    dataIndex: "isWin",
    key: "isWin",
    responsive: ["xs", "sm"],
    render: (item) => (
      <Tag color={item ? "green" : "red"}>{`${item ? "Win" : "Lose"}`}</Tag>
    ),
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
    render: (item) => (
      <span
        style={{
          color:
            item > 0
              ? appColor.textPrimaryColor
              : item === 0
              ? appColor.red
              : appColor.textSecondaryColor,
        }}
      >
        {parseCurrency(item)}
      </span>
    ),
  },
  {
    title: `${intl.formatMessage(translationsComponents.MULTIPLIERS_TAB)}`,
    dataIndex: "multipliers",
    key: "multipliers",
    responsive: ["xs", "sm"],
    render: (item) => {
      if (Array.isArray(item)) {
        return (
          <div>
            {flatNumber(item).map((mul, i) => {
              return <div key={i}>{formatView(mul)}</div>;
            })}
          </div>
        );
      }
      return <span>{formatView(item)}</span>;
    },
  },
  {
    title: `${intl.formatMessage(translationsComponents.GAME_TAB)}`,
    dataIndex: "numbers",
    key: "numbers",
    responsive: ["xs", "sm"],
    render: (item) => <TurnGameIcon item={item} />,
    width: "15%",
  },
];

export const mockColumns = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.DATE_TAB)}`,
    dataIndex: "date",
    key: "date",
    responsive: ["xs", "sm"],
    render: (item) => <span>{parseTimer(item)}</span>,
  },
  {
    title: `${intl.formatMessage(translationsComponents.USER_TAB)}`,
    dataIndex: "user",
    key: "user",
    responsive: ["xs", "sm"],
    render: (item) => <UsersUI user={item} />,
  },
  {
    title: `${intl.formatMessage(translationsComponents.GAME_TAB)}`,
    dataIndex: "game",
    key: "game",
    responsive: ["xs", "sm"],
    render: (item) => <GameIcon name={item} />,
  },
  {
    title: `${intl.formatMessage(translationsComponents.MULTIPLIERS_TAB)}`,
    dataIndex: "multiplier",
    key: "multiplier",
    responsive: ["xs", "sm"],
    render: (item) => {
      if (Array.isArray(item)) {
        return (
          <div>
            {flatNumber(item).map((mul, i) => {
              return <div key={i}>{formatView(mul)}</div>;
            })}
          </div>
        );
      }
      return <span>{formatView(item)}</span>;
    },
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
    render: (item) => (
      <span
        style={{
          color:
            item > 0
              ? appColor.textPrimaryColor
              : item === 0
              ? appColor.red
              : appColor.textSecondaryColor,
        }}
      >
        {parseCurrency(item)}
      </span>
    ),
  },
];

export const mockColumnsHighest = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.DATE_TAB)}`,
    dataIndex: "date",
    key: "date",
    responsive: ["xs", "sm"],
    render: (item) => <span>{parseTimer(item)}</span>,
  },
  {
    title: `${intl.formatMessage(translationsComponents.USER_TAB)}`,
    dataIndex: "user",
    key: "user",
    responsive: ["xs", "sm"],
    render: (item) => <UsersUI user={item} />,
  },
  {
    title: `${intl.formatMessage(translationsComponents.AMOUNT_TAB)}`,
    dataIndex: "amount",
    key: "amount",
    responsive: ["xs", "sm"],
    render: (item) => <AmountUI data={item} />,
  },
  {
    title: `${intl.formatMessage(translationsComponents.MULTIPLIERS_TAB)}`,
    dataIndex: "multiplier",
    key: "multiplier",
    responsive: ["xs", "sm"],
    render: (item) => {
      if (Array.isArray(item)) {
        return (
          <div>
            {flatNumber(item).map((mul, i) => {
              return <div key={i}>{formatView(mul)}</div>;
            })}
          </div>
        );
      }
      return <span>{formatView(item)}</span>;
    },
  },
  {
    title: `${intl.formatMessage(translationsComponents.PROFIT_TAB)}`,
    dataIndex: "profit",
    key: "profit",
    responsive: ["xs", "sm"],
    render: (item) => (
      <span
        style={{
          color:
            item > 0
              ? appColor.textPrimaryColor
              : item === 0
              ? appColor.red
              : appColor.textSecondaryColor,
        }}
      >
        {parseCurrency(item)}
      </span>
    ),
  },
  {
    title: `${intl.formatMessage(translationsComponents.GAME_TAB)}`,
    dataIndex: "numbers",
    key: "numbers",
    responsive: ["xs", "sm"],
    render: (item) => !!item && <TurnGameIcon item={item} />,
    width: "15%",
  },
];

export const TurnGameIcon = ({ item }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <Row>
        {flatNumber(item).map((item, index) => {
          return (
            <Col span={8} key={index}>
              <img
                key={index}
                style={{
                  width: 25,
                  height: 25,
                  padding: 3,
                }}
                src={iconCollection[item]}
                alt={`img_${index}`}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export const formatView = (item) => {
  return !item || item === "0" ? (
    `_`
  ) : (
    <Fragment>
      <span style={{ fontSize: 10 }}>x</span>
      <span style={{ fontSize: 16 }}>{item}</span>
    </Fragment>
  );
};

export const turnResponsive = (name) => {
  switch (name) {
    case "amount":
      return 12;
    case "multiplier":
      return 3;
    case "winChance":
      return 3;
    default:
      return 6;
  }
};
