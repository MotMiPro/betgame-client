import React from "react";

export default function SidebarFooter() {
  return (
    <div style={{ color: "#bbbec5", padding: "20px 10px" }}>
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "50% 50%",
            marginTop: 40,
            textAlign: "center",
          }}
          className="referece-link"
        >
          <span>Affispanate program</span>
          <span>Updates</span>
          <span>Beginners guide</span>
          <span>support 24/7</span>
          <span>privacy pospancy</span>
          <span>terms of use</span>
          <span>Suggest event</span>
          <span>Redeem code</span>
        </div>
      </div>
      <p
        style={{
          fontSize: "10px",
          textAlign: "center",
          marginTop: 30,
        }}
      >
        All www.onehash.com products are operated by Blockchain Entertainment
        B.V. registered address, Fransche Bloemweg 4, Willemstad, Curacao. A
        company licensed and regulated by the law of Curacao under the Master
        License Holder Curacao eGaming with license number 1668/JAZ.
      </p>
    </div>
  );
}
