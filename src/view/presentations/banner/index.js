import React from "react";
import { ScreenView } from "../../UI/components";
import banner from "~/assets/images/gameBanners/moon-banner.png";

export default function BanerHome() {
  return (
    <ScreenView style={{ padding: 0 }}>
      <div
        style={{ cursor: "pointer", position: "relative" }}
        className="zoom-animated slash-animated"
      >
        <figure>
          <img src={banner} alt="play now" style={{ width: "100%" }} />
        </figure>
      </div>
    </ScreenView>
  );
}
