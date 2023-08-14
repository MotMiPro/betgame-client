import React, { Fragment, useCallback, useEffect, useState } from "react";
import { API_METHOD, appColor, pathAPI } from "~/settings/constants";
import { Col, Row, Spin } from "antd";
import { ButtonWrapper } from "~/view/UI/components/antComponents";
import { v4 as uuid } from "uuid";
import { pushNotification } from "~/ultils/pushNotifications";
import { CardView } from "~/view/UI/components/CardWrapper";
import { MutualWrap } from "~/view/UI/reuseAbles";
import HomePageTable from "~/view/presentations/tables/homePageTable";
import { pagingSample } from "../../../settings/constants";
import { parseTimer } from "~/settings/config";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { useFetchAPI } from "~/customHooks/useFetchAPI";
import { parseUrlToQuery } from "~/ultils/parseQuery";
import translationsComponents from "~/languageProvider/translateKeys";

const AFName = (intl) => [
  {
    id: "AF",
    title: `${intl.formatMessage(translationsComponents.AFFILIATE)}`,
  },
  {
    id: "TAF",
    title: `${intl.formatMessage(translationsComponents.TOTAL_AFFILIATE)}`,
  },
  {
    id: "AF1",
    title: `${intl.formatMessage(translationsComponents.TOAL_AFFILATE_1)}`,
  },
];

const handleInfos = (infos) => {
  const { intl } = infos;
  return AFName(intl).map((item) => {
    return {
      title: item.title,
      key: uuid(),
      value: infos[item.id],
    };
  });
};

export default function InviteFriends() {
  const intl = useIntl();
  const [dataFriend, setDataFriend] = useState(null);
  const [tableData, setTableData] = useState(pagingSample);
  const { userInfos } = useSelector((state) => state.userReducer);
  const { _inviteCode = "", _affiliate } = userInfos;

  const { fetchDataEvent } = useFetchAPI();

  const copyToClipboard = `${intl.formatMessage(
    translationsComponents.COPY_TO_CLIPBOARD
  )}`;
  const notClipboard = `${intl.formatMessage(
    translationsComponents.COULD_NOT_COPY
  )}`;

  const handleGetMemberCommission = useCallback(async () => {
    try {
      const getMemberResult = await fetchDataEvent({
        endpoint: pathAPI.AFILIATE_GETMEMBER,
        method: API_METHOD.GET,
      });
      if (getMemberResult?.status) {
        const { totalF1, members, page, total, limit } =
          getMemberResult?.fetchData;
        const result = handleInfos({
          AF: _affiliate,
          TAF: total,
          AF1: totalF1,
          intl,
        });
        setDataFriend(result);

        setTableData({
          ...tableData,
          _column: column(intl),
          _data: getTable(members),
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
    const initPage = 1;
    handleGetMemberCommission(initPage);
  }, []);

  const handleCopyClipboard = (text) => {
    if (text.length > 0) {
      navigator.clipboard.writeText(text).then(
        () => {
          pushNotification({
            mess: copyToClipboard,
            title: "BitWin",
            type: "success",
          });
        },
        () => {
          pushNotification({
            mess: notClipboard,
            title: "BitWin",
            type: "error",
          });
        }
      );
    }
  };

  const handleGetMember = useCallback(async (pageNum) => {
    const query = {
      page: pageNum,
      limit: 10,
    };
    const getMemberResult = await fetchDataEvent({
      endpoint: `${pathAPI.AFILIATE_GETMEMBER}${parseUrlToQuery(query)}`,
      method: API_METHOD.GET,
    });
    if (getMemberResult?.status) {
      const { members, page, total, limit } = getMemberResult?.fetchData;
      setTableData({
        ...tableHistory,
        _column: column(intl),
        _data: getTable(members),
        _pagination: {
          current: page,
          pageSize: limit,
          total: total,
        },
      });
    }
  }, []);

  const handlePagingHistory = ({ current }) => {
    handleGetMember(current);
  };

  return (
    <Fragment>
      <MutualWrap>
        <CardView
          title={intl.formatMessage(translationsComponents.AFFILIATE)}
          icon={<i className="fab fa-affiliatetheme" />}
        >
          <Spin spinning={false}>
            <Row
              gutter={[16, { xs: 8, sm: 16, md: 20, lg: 32 }]}
              align="middle"
              justify="space-between"
              style={{
                color: appColor.textWhiteColor,
                alignItems: "stretch",
                justifyContent: "center",
              }}
            >
              <Col
                xs={24}
                md={12}
                xl={12}
                style={{
                  textAlign: "left",
                  height: "auto",
                }}
              >
                <div
                  style={{
                    padding: 15,
                    borderRadius: 5,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: appColor.bgPrimaryColor,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 28 }}>
                      <h1
                        style={{
                          color: appColor.white,
                          textTransform: "capitalize",
                        }}
                      >
                        {intl.formatMessage(
                          translationsComponents.INVITE_FRIEND
                        )}
                      </h1>
                    </div>
                    <div>
                      <p
                        style={{
                          color: appColor.textSecondaryColor,
                        }}
                      >
                        {intl.formatMessage(
                          translationsComponents.INVITE_FRINE_DECRIPTION
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    {Array.apply(null, Array(2)).map((_, index) => {
                      const url = _inviteCode
                        ? `${window.location.host}/signup/?ref=${_inviteCode}`
                        : `${window.location.host}/signup`;
                      const code = _inviteCode;
                      return (
                        <div
                          key={index}
                          style={{
                            margin: "10px 0",
                          }}
                        >
                          <ButtonWrapper
                            style={{
                              width: "100%",
                              border: "none",
                              display: "flex",
                              maxWidth: "100%",
                              alignItems: "center",
                              color: appColor.white,
                              textTransform: "lowercase",
                              justifyContent: "space-between",
                              backgroundColor: appColor.borderPrimaryColor,
                            }}
                            onClick={() =>
                              handleCopyClipboard(index === 0 ? code : url)
                            }
                          >
                            <span
                              style={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                width: "500px",
                              }}
                            >
                              {index === 0 ? (code ? code : "#") : url}
                            </span>
                            <span>
                              <i className="far fa-copy" />
                            </span>
                          </ButtonWrapper>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div></div>
              </Col>
              <Col xs={24} md={12} xl={12} style={{ height: "auto" }}>
                <div
                  style={{
                    backgroundColor: appColor.bgPrimaryColor,
                    borderRadius: 5,
                    height: "100%",
                    padding: 10,
                  }}
                >
                  <Row
                    gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
                    style={{ padding: "0 10px", justifyContent: "center" }}
                  >
                    {dataFriend?.length > 0 &&
                      dataFriend.map((item, index) => (
                        <Col
                          xs={24}
                          md={10}
                          xl={10}
                          key={index}
                          style={{
                            padding: 10,
                            margin: 5,
                            height: 75,
                            width: "100%",
                            borderRadius: 5,
                            backgroundColor: appColor.borderPrimaryColor,
                            textAlign: "center",
                            textTransform: "capitalize",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "column",
                            overflow: "hidden",
                          }}
                        >
                          <div>{item.title}</div>
                          <div
                            style={{
                              padding: "0 10px",
                              borderRadius: 5,
                              fontWeight: 700,
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              width: "150px",
                            }}
                          >
                            {item.value ? item.value : "#"}
                          </div>
                        </Col>
                      ))}
                  </Row>
                </div>
              </Col>
            </Row>
          </Spin>
        </CardView>
      </MutualWrap>
      <MutualWrap>
        <CardView
          title={intl.formatMessage(translationsComponents.MEMBER_AFFILATE)}
          icon={<i className="fas fa-user" />}
        >
          <HomePageTable
            isTabTable={false}
            tableData={tableData}
            handleTableChange={handlePagingHistory}
          />
        </CardView>
      </MutualWrap>
    </Fragment>
  );
}

const getTable = (arr) => {
  return arr.map((item, index) => ({
    date: parseTimer(item.createdAt, true),
    member: item.userId.userName,
    level: item.level,
    key: `${item.transactionHash}_${index}`,
  }));
};

const column = (intl) => [
  {
    title: `${intl.formatMessage(translationsComponents.DATE_TAB)}`,
    dataIndex: "date",
    key: "date",
    responsive: ["xs", "sm"],
  },
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
];
