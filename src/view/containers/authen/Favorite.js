import React from "react";
import { ScreenView } from "../../UI/components";
import { CardView } from "../../UI/components/CardWrapper";
import { appColor } from "../../../settings/constants";
import {
  ButtonWrapper,
  ColWrapper,
  FormItemWrapper,
  FormWrapper,
  RowWrapper,
  SelectWrapper,
} from "../../UI/components/antComponents";
import translationsComponents from "~/languageProvider/translateKeys";
import { useIntl } from "react-intl";

export default function Favorite(props) {
  const intl = useIntl();
  const { title, icon = null } = props;

  return (
    <CardView title={title} icon={icon}>
      <ScreenView bgColor="transparent">
        <FormWrapper
          name="favorite"
          initialValues={{ remember: true }}
          layout="vertical"
        >
          <RowWrapper
            gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
            align="middle"
            justify="space-between"
          >
            <ColWrapper xs={24} md={12} xl={6}>
              <FormItemWrapper
                name="category"
                rules={[{ required: true }]}
                label={
                  <span
                    style={{
                      textTransform: "uppercase",
                      color: appColor.textSecondaryColor,
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    {intl.formatMessage(translationsComponents.ADDING_CATEGORY)}
                  </span>
                }
              >
                <SelectWrapper
                  placeholder={intl.formatMessage(
                    translationsComponents.SELECT_AN_OPTION
                  )}
                  style={{
                    borderRadius: 8,
                    width: 200,
                  }}
                />
              </FormItemWrapper>
            </ColWrapper>
            <FormItemWrapper>
              <ColWrapper
                xs={24}
                md={12}
                xl={{ span: 8, offset: 10 }}
                style={{ margin: "auto 0" }}
              >
                <ButtonWrapper
                  type="primary"
                  htmlType="submit"
                  style={{ minWidth: 170 }}
                >
                  {intl.formatMessage(translationsComponents.ADDING)}
                </ButtonWrapper>
              </ColWrapper>
            </FormItemWrapper>
          </RowWrapper>
        </FormWrapper>
      </ScreenView>
    </CardView>
  );
}
