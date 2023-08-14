import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import translationsComponents from "~/languageProvider/translateKeys";
import { parseTimer } from "~/settings/config";
import { API_METHOD, pagingSample, pathAPI } from "~/settings/constants";
import { parseUrlToQuery } from "~/ultils/parseQuery";
import HomePageTable from "~/view/presentations/tables/homePageTable";
import { CardView } from "~/view/UI/components/CardWrapper";
import { MutualWrap } from "~/view/UI/reuseAbles";

function SwapTable() {
  const intl = useIntl();
  const { fetchDataEvent } = useFetchAPI();
  const [tableHistory, setTableHistory] = useState(pagingSample);

  const getSwapHistory = async (pageing, size = 10) => {
    try {
      const query = {
        page: pageing,
        limit: size,
      };
      const swapHistory = await fetchDataEvent({
        endpoint: `${pathAPI.SWAP_HISTORY}${parseUrlToQuery(query)}`,
        method: API_METHOD.GET,
      });
      if (swapHistory?.status) {
        const { data, limit, page, total } = swapHistory?.fetchData;
        setTableHistory({
          ...tableHistory,
          _column: swapColumnHistory(intl),
          _data: getTableSwap(data),
          _pagination: {
            current: page,
            pageSize: limit,
            total: total,
          },
        });
      }
    } catch (error) {}
  };

  const handlePagingSwapHistory = (pagin) => {
    const { current, pageSize } = pagin;
    getSwapHistory(current, pageSize);
  };

  useEffect(() => {
    getSwapHistory(1);
  }, []);

  return (
    <MutualWrap>
      <CardView
        title={intl.formatMessage(translationsComponents.SWAP_HISTORY)}
        icon={<i className="fas fa-clipboard-list" />}
      >
        <HomePageTable
          isTabTable={false}
          tableData={tableHistory}
          handleTableChange={handlePagingSwapHistory}
        />
      </CardView>
    </MutualWrap>
  );
}

export default SwapTable;

const getTableSwap = (arr) => {
  return arr.map((item, index) => ({
    date: parseTimer(item.createdAt, true),
    from: item?.from,
    fromAmount: item?.fromAmount,
    toAmount: item?.toAmount,
    to: item?.to,
    fee: item?.fee,
    atPrice: item?.atPrice,
    key: `_${index}`,
  }));
};

const swapColumnHistory = (intl) => [
  {
    title: (
      <TabStyle>{intl.formatMessage(translationsComponents.DATE_TAB)}</TabStyle>
    ),
    dataIndex: "date",
    key: "date",
    responsive: ["xs", "sm"],
  },
  {
    title: (
      <TabStyle>{intl.formatMessage(translationsComponents.FROM_TAB)}</TabStyle>
    ),
    dataIndex: "from",
    key: "from",
    responsive: ["xs", "sm"],
  },
  {
    title: (
      <TabStyle>
        {intl.formatMessage(translationsComponents.FROM_TO_TAB)}
      </TabStyle>
    ),
    dataIndex: "to",
    key: "to",
    responsive: ["xs", "sm"],
  },
  {
    title: (
      <TabStyle>
        {intl.formatMessage(translationsComponents.FROM_AMOUNT_TAB)}
      </TabStyle>
    ),
    dataIndex: "fromAmount",
    key: "fromAmount",
    responsive: ["xs", "sm"],
  },
  {
    title: (
      <TabStyle>
        {intl.formatMessage(translationsComponents.TO_AMOUNT_TAB)}
      </TabStyle>
    ),
    dataIndex: "toAmount",
    key: "toAmount",
    responsive: ["xs", "sm"],
  },
  {
    title: (
      <TabStyle>{intl.formatMessage(translationsComponents.FEE_TAB)}</TabStyle>
    ),
    dataIndex: "fee",
    key: "fee",
    responsive: ["xs", "sm"],
  },
  {
    title: (
      <TabStyle>
        {intl.formatMessage(translationsComponents.AT_PRICE_TAB)}
      </TabStyle>
    ),
    dataIndex: "atPrice",
    key: "atPrice",
    responsive: ["xs", "sm"],
  },
];

const TabStyle = styled.span`
  font-size: 13px;
`;
