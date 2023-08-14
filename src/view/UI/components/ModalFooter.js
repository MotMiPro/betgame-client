import React from "react";
import { ButtonWrapper } from "./antComponents";

export default function ModalFooter(props) {
  const { handleLeft, btnLeft = false, btnRight = "confirm" } = props;
  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {btnLeft && (
          <ButtonWrapper
            onClick={handleLeft}
            htmlType="button"
            style={{ marginRight: 15, minWidth: 100 }}
          >
            {btnLeft}
          </ButtonWrapper>
        )}

        <ButtonWrapper
          style={{ minWidth: 100 }}
          htmlType="submit"
          type="primary"
        >
          {btnRight}
        </ButtonWrapper>
      </div>
    </section>
  );
}
