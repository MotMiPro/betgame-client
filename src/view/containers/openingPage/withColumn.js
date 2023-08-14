import { parseTimer } from "~/settings/config";
import { appColor } from "~/settings/constants";

import { parseCurrency } from "~/ultils/currency";
import { formatView } from "~/ultils/formatView";
import React from "react";
import AmountUI, { UsersUI } from "~/view/UI/components/AmountUI";
import { GameIcon } from "~/view/UI/components/GameIcons";
import translationsComponents from "~/languageProvider/translateKeys";

export const withColumn = (intl) => {
  return [
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
};
