import { Popover, Tag } from "antd";
import { parseTimer } from "~/settings/config";
import { API_METHOD, pagingSample, pathAPI } from "~/settings/constants";
import { MutualWrap } from "~/view/UI/reuseAbles";
import { CardView } from "~/view/UI/components/CardWrapper";
import { appColor } from "../../../../../settings/constants";
import React, { useCallback, useEffect, useState } from "react";
import HomePageTable from "~/view/presentations/tables/homePageTable";
import { isMobile } from "react-device-detect";
import translationsComponents from "~/languageProvider/translateKeys";
import { useIntl } from "react-intl";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { parseUrlToQuery } from "~/ultils/parseQuery";

function WithDrawHistory() {
  const intl = useIntl();
  const [tableHistory, setTableHistory] = useState(pagingSample);

  const { fetchDataEvent } = useFetchAPI();

  const hanldleGetWithdrawHistory = useCallback(async (pageNumber) => {
    const query = {
      page: pageNumber,
      limit: 10,
    };

    try {
      const withDraw = await fetchDataEvent({
        endpoint: `${pathAPI.GET_WIDTHDRAW_HISTORY}${parseUrlToQuery(query)}`,
        method: API_METHOD.GET,
      });
      if (withDraw.status) {
        const { data, page, total, limit } = withDraw?.fetchData;
        setTableHistory({
          ...tableHistory,
          _column: depositColumnHistory(intl),
          _data: getTablewithDrawtory(data),
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
    hanldleGetWithdrawHistory(1);
  }, []);

  const handlePagingHistory = ({ current }) => {
    hanldleGetWithdrawHistory(current);
  };

  return (
    <MutualWrap>
      <CardView
        title={intl.formatMessage(translationsComponents.WITHDRAW_HISTORY)}
      >
        <HomePageTable
          isTabTable={false}
          tableData={tableHistory}
          handleTableChange={handlePagingHistory}
        />
      </CardView>
    </MutualWrap>
  );
}

export default WithDrawHistory;
const getTablewithDrawtory = (arr) => {
  return arr.map((item, index) => ({
    date: parseTimer(item.createdAt, true),
    network: item.network,
    currency: item.currency,
    amount: item,
    fee: item.fee,
    address: item.address,
    status: item.status,
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
    title: `${intl.formatMessage(translationsComponents.FEE_TAB)}`,
    dataIndex: "fee",
    key: "fee",
    responsive: ["xs", "sm"],
  },
  {
    title: `${intl.formatMessage(translationsComponents.ADDRESS_TAB)}`,
    dataIndex: "address",
    key: "address",
    responsive: ["xs", "sm"],
    render: (item) => (
      <Popover
        style={{
          cursor: "pointer",
        }}
        content={item}
      >
        {item}
      </Popover>
    ),
    ellipsis: isMobile ? false : true,
  },
  {
    title: `${intl.formatMessage(translationsComponents.STATUS_TAB)}`,
    dataIndex: "status",
    key: "status",
    responsive: ["xs", "sm"],
    render: (item) => (
      <Tag color={item === "pending" ? "yellow" : appColor.textPrimaryColor}>
        {item}
      </Tag>
    ),
  },
];
