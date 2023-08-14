import { Form } from "antd";
import QRCode from "qrcode.react";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";
import { appColor } from "~/settings/constants";
import {
  ButtonWrapper,
  SelectWrapper,
} from "~/view/UI/components/antComponents";
import { ggAddress } from "../../../../../settings/constants";
import { copyToClipboard } from "../../../../../ultils/copytoClipboard";

const DepositeRightColumn = (props) => {
  const intl = useIntl();
  const { dataView, username, coinList, handleChangeCurrencies } = props;

  const selectCoinList = useMemo(
    () =>
      coinList.map((item) => ({ label: item?.network, value: item?.network })),
    [coinList]
  );

  const ggAuth = ggAddress({
    email: username?._email,
    key: dataView?.address,
  });

  const handleCopy = (text) => {
    return copyToClipboard(text);
  };

  return (
    <div>
      <Form layout="vertical">
        <Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 5,
              alignItems: "center",
            }}
          >
            <div>
              {selectCoinList?.length > 1 ? (
                <SelectWrapper
                  allowClear={false}
                  value={dataView?.network}
                  style={{
                    width: 150,
                    borderRadius: 5,
                    color: appColor.white,
                    border: `1px solid ${appColor.textSecondaryColor}`,
                  }}
                  selectList={selectCoinList}
                  placeholder="Select an option"
                  handleChange={handleChangeCurrencies}
                />
              ) : (
                <ButtonWrapper
                  style={{
                    backgroundColor: "transparent",
                    pointerEvents: "none",
                    color: appColor.textSecondaryColor,
                    width: 150,
                    border: `1px solid ${appColor.textSecondaryColor}`,
                    borderRadius: 5,
                  }}
                >
                  {dataView?.network}
                </ButtonWrapper>
              )}
            </div>
          </div>
        </Form.Item>

        {!!ggAuth && (
          <div
            style={{
              marginBottom: 15,
              textAlign: "center",
            }}
          >
            <QRCode
              id="qrcode-deposite"
              value={ggAuth}
              size={290}
              level={"H"}
              includeMargin={true}
            />
          </div>
        )}

        <Form.Item
          label={
            <span
              style={{
                textTransform: "capitalize",
                color: appColor.textSecondaryColor,
              }}
            >
              {intl.formatMessage(translationsComponents.ADDRESS_TAB)}
            </span>
          }
        >
          <ButtonWrapper
            style={{
              borderRadius: 5,
              border: `none`,
              backgroundColor: appColor.borderPrimaryColor,
              textAlign: "left",
              color: appColor.textSecondaryColor,
              maxWidth: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textTransform: "unset",
            }}
            onClick={() => handleCopy(dataView?.address)}
          >
            <span
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "500px",
              }}
            >
              {dataView?.address}
            </span>
            <span
              style={{
                color: appColor.textPrimaryColor,
              }}
            >
              <i className="far fa-copy" />
            </span>
          </ButtonWrapper>
        </Form.Item>
        {dataView?.memo && (
          <Form.Item
            label={
              <span
                style={{
                  textTransform: "capitalize",
                  color: appColor.textSecondaryColor,
                }}
              >
                {intl.formatMessage(translationsComponents.MEMO_TAB)}
              </span>
            }
          >
            <ButtonWrapper
              style={{
                borderRadius: 5,
                border: `none`,
                backgroundColor: appColor.borderPrimaryColor,
                textAlign: "left",
                color: appColor.textSecondaryColor,
                maxWidth: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "unset",
              }}
              onClick={() => handleCopy(dataView?.memo)}
            >
              <span
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  width: "500px",
                }}
              >
                {dataView?.memo}
              </span>
              <span
                style={{
                  color: appColor.textPrimaryColor,
                }}
              >
                <i className="far fa-copy" />
              </span>
            </ButtonWrapper>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default React.memo(DepositeRightColumn);
