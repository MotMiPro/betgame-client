import React, { useCallback, useEffect, useState } from "react";
import HomePageTable from "~/view/presentations/tables/homePageTable";
import { Popover } from "antd";
import { parseTimer } from "~/settings/config";
import { API_METHOD, pagingSample, pathAPI } from "~/settings/constants";
import { handleSplitString } from "~/ultils/aboutStrings";
import translationsComponents from "~/languageProvider/translateKeys";
import { useIntl } from "react-intl";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { parseUrlToQuery } from "~/ultils/parseQuery";

function DepositHistory() {
  const intl = useIntl();
  const [tableHistory, setTableHistory] = useState(pagingSample);

  const { fetchDataEvent } = useFetchAPI();

  const hanldleGetCommissionHistory = useCallback(async (pageNumber) => {
    const query = {
      page: pageNumber,
      limit: 10,
    };

    try {
      const depositeHis = await fetchDataEvent({
        endpoint: `${pathAPI.GET_DEPOSIT_HISTORY}${parseUrlToQuery(query)}`,
        method: API_METHOD.GET,
      });
      if (depositeHis.status) {
        const { data, page, total, limit } = depositeHis?.fetchData;
        setTableHistory({
          ...tableHistory,
          _column: depositColumnHistory(intl),
          _data: getTableDepositeHistory(data),
          _pagination: {
            current: page,
            pageSize: limit,
            total: total,
          },
        });
      }
    } catch (error) {
      console.log({ error });
    }
  }, []);

  useEffect(() => {
    hanldleGetCommissionHistory(1);
  }, []);

  const handlePagingHistory = ({ current }) => {
    hanldleGetCommissionHistory(current);
  };

  return (
    <HomePageTable
      isTabTable={false}
      tableData={tableHistory}
      handleTableChange={handlePagingHistory}
    />
  );
}

export default React.memo(DepositHistory);

const getTableDepositeHistory = (arr) => {
  return arr.map((item, index) => ({
    date: parseTimer(item.createdAt, true),
    network: item.network,
    currency: item.currency,
    amount: item,
    transactionHash: item.transactionHash,
    address: item.address,
    key: `${item.transactionHash}_${index}`,
  }));
};

const depositColumnHistory = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.DATE_TAB)}`,
    dataIndex: "date",
    key: "date",
    responsive: ["xs", "sm"],
  },
  {
    title: `${intl.formatMessage(translationsComponents.NETWORK_TAB)}`,
    dataIndex: "network",
    key: "network",
    responsive: ["xs", "sm"],
    width: 150,
  },
  {
    title: `${intl.formatMessage(translationsComponents.AMOUNT_TAB)}`,
    dataIndex: "amount",
    key: "amount",
    responsive: ["xs", "sm"],
    render: (item) => {
      return (
        <span>
          {item.amount} {item.currency}
        </span>
      );
    },
  },
  {
    title: `${intl.formatMessage(translationsComponents.TRANSACTION_HASH_TAB)}`,
    dataIndex: "transactionHash",
    key: "transactionHash",
    responsive: ["xs", "sm"],
    render: (item) => {
      const result = handleSplitString(item);
      return (
        <Popover
          style={{
            cursor: "pointer",
          }}
          content={item}
        >
          {result}
        </Popover>
      );
    },
  },
  {
    title: `${intl.formatMessage(translationsComponents.ADDRESS_TAB)}`,
    dataIndex: "address",
    key: "address",
    responsive: ["xs", "sm"],
    render: (item) => {
      const result = handleSplitString(item);
      return (
        <Popover
          style={{
            cursor: "pointer",
          }}
          content={item}
        >
          {result}
        </Popover>
      );
    },
  },
];
