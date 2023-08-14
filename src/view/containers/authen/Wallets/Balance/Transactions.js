import { useIntl } from "react-intl";
import { parseTimer } from "~/settings/config";
import { ScreenView } from "../../../../UI/components";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { parseUrlToQuery } from "~/ultils/parseQuery";
import React, { useCallback, useEffect, useState } from "react";
import { CardView } from "../../../../UI/components/CardWrapper";
import translationsComponents from "~/languageProvider/translateKeys";
import HomePageTable from "~/view/presentations/tables/homePageTable";
import { API_METHOD, pagingSample, pathAPI } from "~/settings/constants";

function Transactions() {
  const intl = useIntl();
  const [tableHistory, setTableHistory] = useState(pagingSample);
  const { fetchDataEvent } = useFetchAPI();

  const hanldleGetbalanceHistory = useCallback(async (pageing, size) => {
    const query = {
      page: pageing,
      limit: size,
    };

    try {
      const balance = await fetchDataEvent({
        endpoint: `${pathAPI.GET_BALANCE_HISTORY}${parseUrlToQuery(query)}`,
        method: API_METHOD.GET,
      });
      if (balance.status) {
        const { data, page, total, limit } = balance?.fetchData;
        setTableHistory({
          ...tableHistory,
          _column: balanceColumnHistory(intl),
          _data: getTablebalancetory(data),
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
    hanldleGetbalanceHistory(1);
  }, []);
  const handlePagingHistory = (pagin) => {
    const { current, pageSize } = pagin;
    hanldleGetbalanceHistory(current, pageSize);
  };

  return (
    <ScreenView>
      <CardView
        title={intl.formatMessage(translationsComponents.TRANSACTION)}
        icon={<i className="fas fa-exchange-alt" />}
        style={{ marginTop: 10 }}
      >
        <HomePageTable
          isTabTable={false}
          tableData={tableHistory}
          handleTableChange={handlePagingHistory}
        />
      </CardView>
    </ScreenView>
  );
}
export default React.memo(Transactions);

const getTablebalancetory = (arr) => {
  return arr.map((item, index) => ({
    date: parseTimer(item.createdAt, true),
    amount: item,
    status: item.status,
    key: `${item.transactionHash}_${index}`,
  }));
};

const balanceColumnHistory = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.DATE_TAB)}`,
    dataIndex: "date",
    key: "date",
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
    title: `${intl.formatMessage(translationsComponents.STATUS_TAB)}`,
    dataIndex: "status",
    key: "status",
    responsive: ["xs", "sm"],
  },
];
