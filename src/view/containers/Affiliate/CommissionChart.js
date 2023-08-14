import { Spin } from "antd";
import { useIntl } from "react-intl";
import { Line } from "@ant-design/charts";
import { parseUrlToQuery } from "~/ultils/parseQuery";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { CardView } from "~/view/UI/components/CardWrapper";
import React, { useCallback, useEffect, useState } from "react";
import { API_METHOD, pathAPI, USDT } from "~/settings/constants";
import translationsComponents from "~/languageProvider/translateKeys";

const CommissionChart = () => {
  const intl = useIntl();
  const { fetchDataEvent } = useFetchAPI();

  const [dataChart, setDataChart] = useState(null);

  const getCommission = useCallback(async () => {
    try {
      const query = {
        days: 10,
        currency: USDT,
      };

      const data = await fetchDataEvent({
        endpoint: `${pathAPI.AFILIATE_COMMISSION}${parseUrlToQuery(query)}`,
        method: API_METHOD.GET,
      });

      if (data?.status) {
        const dataCommission = data?.fetchData?.dailyCommisson ?? [];
        const chartByDay = dataCommission.map((item) => {
          return {
            day: item.date,
            value: item.commission,
          };
        });
        if (chartByDay) {
          const config = {
            data: chartByDay,
            xField: "day",
            yField: "value",
            point: {
              size: 5,
              shape: "diamond",
              style: {
                fill: "white",
                stroke: "#5B8FF9",
                lineWidth: 2,
              },
            },
            tooltip: { showMarkers: false },
            state: {
              active: {
                style: {
                  shadowBlur: 4,
                  stroke: "#000",
                  fill: "red",
                },
              },
            },
            interactions: [{ type: "marker-active" }],
          };
          setDataChart(config);
        }
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    getCommission();
  }, []);

  return (
    <CardView
      title={intl.formatMessage(translationsComponents.COMMISSION_CHART)}
    >
      <Spin spinning={false}>{!!dataChart && <Line {...dataChart} />}</Spin>
    </CardView>
  );
};
export default React.memo(CommissionChart);
