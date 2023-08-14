import React from "react";
import { Row, Col } from "antd";
import { MutualWrap } from "../../UI/reuseAbles";
import { gameSlider } from "~/settings/config";

export default function GameSlider({ history }) {
  const handleSwitchGame = (path) => {
    history.push(path);
  };
  return (
    <MutualWrap style={{ marginTop: 20 }}>
      <Row style={{ overflowX: "scroll", flexWrap: "nowrap" }}>
        {gameSlider.map((game, index) => {
          return (
            <Col
              key={index}
              xs={{ span: 24 }}
              lg={{ span: 8 }}
              style={{ cursor: "pointer" }}
            >
              <div
                style={{ padding: "5px" }}
                className="slash-animated"
                onClick={() => handleSwitchGame(game.path)}
              >
                <figure>
                  <img
                    src={game.url}
                    alt={game.label}
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </figure>
              </div>
            </Col>
          );
        })}
      </Row>
    </MutualWrap>
  );
}
