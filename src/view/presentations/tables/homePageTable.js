import { Tabs, Table } from "antd";
import React, { Fragment } from "react";
import styled, { css, keyframes } from "styled-components";
import { ScreenView } from "../../UI/components";

const { TabPane } = Tabs;

const paginDefault = {
  current: 1,
  pageSize: 10,
};

function HomePageTable(props) {
  const {
    className,
    tableData,
    handlePaging,
    stateTable = [],
    dataTableHost,
    loading = false,
    isTabTable = true,
    handleTableChange,
  } = props;
  const {
    _data = [],
    _column = [],
    _pagination = paginDefault,
  } = !!tableData && tableData;

  return (
    <ScreenView>
      {isTabTable ? (
        <Fragment>
          <Tabs
            style={{
              color: "#fff",
              padding: "5px 10px",
              textTransform: "capitalize",
            }}
            onChange={handleTableChange}
            defaultActiveKey={dataTableHost}
            destroyInactiveTabPane={true}
          >
            {stateTable?.length > 0 &&
              stateTable.map((item, index) => {
                return (
                  <WrappTabPane tab={item?.title} key={index}>
                    <Table
                      loading={loading}
                      pagination={item?.pagin ? item?.pagin : false}
                      columns={item?.column}
                      className={`live-table ${className}`}
                      dataSource={item?.data}
                      rowClassName={(_, index) =>
                        index % 2 === 0
                          ? `table-row-light ${
                              index === 0 ? "first-highlight" : ""
                            }`
                          : `table-row-dark `
                      }
                      bordered={false}
                      scroll={{ x: 350 }}
                      rowKey={(row) => {
                        return row.key;
                      }}
                      onChange={handlePaging}
                    />
                  </WrappTabPane>
                );
              })}
          </Tabs>
        </Fragment>
      ) : (
        <Fragment>
          <Table
            columns={_column}
            dataSource={_data}
            loading={loading}
            pagination={_pagination}
            className={`live-table reset-table ${className}`}
            rowClassName={(_, index) =>
              index % 2 === 0 ? `table-row-light` : `table-row-dark `
            }
            bordered={false}
            scroll={{ x: 350 }}
            rowKey={(row) => row.key}
            onChange={handleTableChange}
          />
        </Fragment>
      )}
    </ScreenView>
  );
}
export default React.memo(HomePageTable);

const WrappTabPane = styled(TabPane)`
  .first-highlight {
    animation: ${() =>
      css`
        ${highlight} .7s
      `};
    animation-fill-mode: forwards;
  }
  .ant-empty-description {
    color: whitesmoke;
  }
`;

const highlight = keyframes`
0%{
  background-color: #34363d;
}
25%{
  background-color: rgba(29, 165, 122,.3);
}
50%{
  background-color: #34363d;
}
75%{
  background-color: rgba(29, 165, 122,.7);
}
100%{
  background-color: #34363d;
}
`;
