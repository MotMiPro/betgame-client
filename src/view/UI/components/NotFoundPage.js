import React from "react";
import { appColor } from "../../../settings/constants";

export default function NotFound() {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column-reverse",
        height: "100%",
        fontSize: 40,
        textAlign: "center",
      }}
    >
      <div>
        <strong>404.</strong>
        <span style={{ color: appColor.textSecondaryColor, marginLeft: 15 }}>
          That's a error
        </span>
        <div>
          <p style={{ color: appColor.textSecondaryColor, fontSize: 22 }}>
            The request url was not found
          </p>
        </div>
      </div>
    </section>
  );
}
