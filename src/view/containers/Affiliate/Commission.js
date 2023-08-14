import { useIntl } from "react-intl";
import { MutualWrap } from "~/view/UI/reuseAbles";
import { parseUrlToQuery } from "~/ultils/parseQuery";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { CardView } from "~/view/UI/components/CardWrapper";
import HomePageTable from "~/view/presentations/tables/homePageTable";
import translationsComponents from "~/languageProvider/translateKeys";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { API_METHOD, pagingSample, pathAPI } from "../../../settings/constants";
import { parseTimer } from "~/settings/config";

function Commission() {
  const intl = useIntl();
  const [tableData, setTableData] = useState(pagingSample);

  const [tableHistory, setTableHistory] = useState(pagingSample);
  const { fetchDataEvent } = useFetchAPI();

  const handleGetMemberCommission = useCallback(async (pageNum) => {
    try {
      const body = {
        limit: 10,
        page: pageNum,
        filterBy: {
          currency: "USDT",
        },
        sortBy: {
          amount: -1,
        },
      };
      const data = await fetchDataEvent({
        endpoint: pathAPI.AFILIATE_MEMBER_COMMISSION,
        method: API_METHOD.POST,
        sendData: body,
      });
      if (data?.status) {
        const commission = data?.fetchData?.membersCommission ?? [];
        const { page, total, limit } = data?.fetchData;
        setTableData({
          ...tableData,
          _column: column(intl),
          _data: getTableDataMembers(commission, 1),
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

  const hanldleGetCommissionHistory = useCallback(async (pageing) => {
    const query = {
      page: pageing,
      limit: 10,
    };
    try {
      const data = await fetchDataEvent({
        endpoint: `${pathAPI.AFILIATE_COMMISSION_HISTORY}${parseUrlToQuery(
          query
        )}`,
        method: API_METHOD.GET,
      });
      if (data?.status) {
        const { commisionHistory, page, total, limit } = data?.fetchData;
        setTableHistory({
          ...tableHistory,
          _column: columnHistory(intl),
          _data: getTableDataMembers(commisionHistory, 2),
          _pagination: {
            current: page,
            pageSize: limit,
            total: total,
          },
        });
      }
    } catch (error) {}
  }, []);

  const handlePagingHistory = ({ current }) => {
    hanldleGetCommissionHistory(current);
  };

  const handlePagination = ({ current }) => {
    handleGetMemberCommission(current ?? 1);
  };

  useEffect(() => {
    const initPage = 1;
    handleGetMemberCommission(initPage);
    hanldleGetCommissionHistory(initPage);
  }, []);

  return (
    <Fragment>
      <MutualWrap>
        <CardView
          title={intl.formatMessage(translationsComponents.MEMBER_COMMISISON)}
        >
          <HomePageTable
            isTabTable={false}
            tableData={tableData}
            handleTableChange={handlePagination}
          />
        </CardView>
      </MutualWrap>
      <MutualWrap>
        <CardView
          title={intl.formatMessage(translationsComponents.COMMISSION_HISTORY)}
        >
          <HomePageTable
            isTabTable={false}
            tableData={tableHistory}
            handleTableChange={handlePagingHistory}
          />
        </CardView>
      </MutualWrap>
    </Fragment>
  );
}

export default React.memo(Commission);

const getTableDataMembers = (arr, type) => {
  if (type === 1) {
    return arr.map((item, index) => {
      return {
        amount: item.amount,
        member: item.childId.userName,
        currency: item.currency,
        level: item.level,
        key: `${item._id}_${index}`,
      };
    });
  }
  return arr.map((item, index) => {
    return {
      amount: item.amount,
      member: item.childId.userName,
      currency: item.currency,
      game: item.game,
      date: parseTimer(item.createdAt, true),
      key: `${item._id}_${index}`,
    };
  });
};

const column = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.MEMBER_AFFILATE)}`,
    dataIndex: "member",
    key: "member",
    responsive: ["xs", "sm"],
  },
  {
    title: `${intl.formatMessage(translationsComponents.LEVEL_TAB)}`,
    dataIndex: "level",
    key: "level",
    responsive: ["xs", "sm"],
  },
  {
    title: `${intl.formatMessage(translationsComponents.AMOUNT_TAB)}`,
    dataIndex: "amount",
    key: "amount",
    responsive: ["xs", "sm"],
  },
  {
    title: `${intl.formatMessage(translationsComponents.CURRENCY_TAB)}`,
    dataIndex: "currency",
    key: "currency",
    responsive: ["xs", "sm"],
  },
];
const columnHistory = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.DATE_TAB)}`,
    dataIndex: "date",
    key: "date",
    responsive: ["xs", "sm"],
  },
  {
    title: `${intl.formatMessage(translationsComponents.GAME_TAB)}`,
    dataIndex: "game",
    key: "game",
    responsive: ["xs", "sm"],
  },
  {
    title: `${intl.formatMessage(translationsComponents.MEMBER_AFFILATE)}`,
    dataIndex: "member",
    key: "member",
    responsive: ["xs", "sm"],
  },
  {
    title: `${intl.formatMessage(translationsComponents.AMOUNT_TAB)}`,
    dataIndex: "amount",
    key: "amount",
    responsive: ["xs", "sm"],
  },
  {
    title: `${intl.formatMessage(translationsComponents.CURRENCY_TAB)}`,
    dataIndex: "currency",
    key: "currency",
    responsive: ["xs", "sm"],
  },
];
