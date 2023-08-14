import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { CardView } from "../../UI/components/CardWrapper";
import HomePageTable from "../../presentations/tables/homePageTable";
import translationsComponents from "~/languageProvider/translateKeys";
import { API_METHOD, pathAPI } from "~/settings/constants";
import { useSelector } from "react-redux";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { parseTimer } from "~/settings/config";
import { parseUrlToQuery } from "~/ultils/parseQuery";

const mockdata = {
  _column: [],
  _data: [],
  _pagination: null,
};

export default function HistoryLogin({ icon, title }) {
  const intl = useIntl();
  const { fetchDataEvent } = useFetchAPI();
  const [tableData, setTableData] = useState(mockdata);

  const { authHeader } = useSelector((state) => state.userReducer);
  const mockColumn = columns(intl);

  const handleGetLoginHistory = useCallback(
    async ({ pageNum = 1, max = 10 }) => {
      const query = {
        page: pageNum,
        limit: max,
      };
      const { status, fetchData } = await fetchDataEvent({
        endpoint: `${pathAPI.USER_LOGIN_HISTORY}${parseUrlToQuery(query)}`,
        method: API_METHOD.GET,
        attachAuth: authHeader,
      });
      if (status) {
        const { data, total, page, limit } = fetchData;
        setTableData((state) => ({
          ...state,
          _column: mockColumn,
          _data: turnDataLoginHistory(data),
          _pagination: {
            current: page,
            pageSize: limit,
            total: total,
          },
        }));
      }
    },
    [intl]
  );

  const handlePaging = ({ current }) => {
    handleGetLoginHistory({ pageNum: current });
  };

  useEffect(() => {
    handleGetLoginHistory({ pageNum: 1 });
  }, []);

  return (
    <CardView title={title} icon={icon}>
      <HomePageTable
        isTabTable={false}
        tableData={tableData}
        handleTableChange={handlePaging}
      />
    </CardView>
  );
}

const turnDataLoginHistory = (arr) => {
  if (!arr) return;
  return arr.map((item, idx) => ({
    date: parseTimer(item?.updatedAt, true),
    country: item?.countryName,
    city: item?.city,
    ip: item?.ip,
    browser: item?.browser,
    device: item?.device,
    key: idx,
  }));
};

const columns = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.DATE_TAB)}`,
    dataIndex: "date",
    key: "date",
  },
  // {
  //   title: `${intl.formatMessage(translationsComponents.COUNTRY_TAB)}`,
  //   dataIndex: "country",
  //   key: "country",
  // },
  // {
  //   title: `${intl.formatMessage(translationsComponents.CITY_TAB)}`,
  //   dataIndex: "city",
  //   key: "city",
  // },
  {
    title: `${intl.formatMessage(translationsComponents.IP_TAB)}`,
    dataIndex: "ip",
    key: "ip",
  },
  {
    title: `${intl.formatMessage(translationsComponents.BROWSER_TAB)}`,
    dataIndex: "browser",
    key: "browser",
  },
  {
    title: `device`,
    dataIndex: "device",
    key: "device",
  },
];
