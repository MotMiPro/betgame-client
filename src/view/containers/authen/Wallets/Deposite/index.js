import React from "react";
import DepositHistory from "./DepositHistory";
import { MutualWrap } from "~/view/UI/reuseAbles";
import DepositeViewHeader from "./DepositeViewHeader";
import { CardView } from "~/view/UI/components/CardWrapper";
import { useIntl } from "react-intl";
import translationsComponents from "~/languageProvider/translateKeys";

export default function DepositeTransaction() {
  const intl = useIntl();

  return (
    <main>
      <DepositeViewHeader />
      <MutualWrap>
        <CardView
          title={intl.formatMessage(translationsComponents.DEPOSIT_HISTORY)}
        >
          <DepositHistory />
        </CardView>
      </MutualWrap>
    </main>
  );
}
