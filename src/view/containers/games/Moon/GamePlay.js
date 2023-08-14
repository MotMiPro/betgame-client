import AccountBalance from "../BalanceInGame";
import { RootContext } from "~/contextAPI/Authen";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { ColWrapper, RowWrapper } from "~/view/UI/components/antComponents";
import {
  ENOUGHBALANCE_CODE,
  GAME_RUNNING,
  moonGameAllStates,
  USDT,
} from "~/settings/constants";
import { isMobile } from "react-device-detect";
import {
  boomAssets,
  cloudAssets,
  cloudAssetsBottom,
  cometAssets,
  drawCtx,
  meteorsAssets,
  planetArr,
  planetAssets,
  rocketAssets,
  starsAssets,
  turnAssets,
} from "./turnAssets";
import {
  moonSocketEmitter,
  moonSocketSubscriber,
} from "~/customHooks/useSocket";
import GameForm from "./gameForm";
import { useForm } from "antd/lib/form/Form";
import { socketTypes } from "~/settings/config";
import { Countdown } from "~/ultils/gameCountDown";
import styled from "styled-components";

import { useIntl } from "react-intl";
import { useHistory } from "react-router";
import { ScreenView } from "~/view/UI/components";
import translationsComponents from "~/languageProvider/translateKeys";
import explosion from "~/assets/audios/moonSoundEffects/explosion.mp3";
import gamerLeaveWin from "~/assets/audios/moonSoundEffects/leaveWin.wav";
import rocketLauch from "~/assets/audios/moonSoundEffects/rocketLauch.mp3";
import bgGame from "~/assets/audios/moonSoundEffects/background.mp3";
import NotifyToSignUpgame from "~/view/presentations/games/NotifyToSignUpgame";
import { useExceptions } from "~/customHooks/useExceptions";
import useAudio from "~/customHooks/useAudios";
import { subNameCode } from "~/view/UI/components/AmountUI";
import Players from "./Players";

const blueColor = "#172239";

let tempMulti = 1.0;
let savingData = null;
let isFinish = false;
let dy = 0;
let usersLeave = [];
let soundEffectGlobal = false;
let tempDataWhenRun = null;
let placeBetSuccess = false;
const TIME_OUT = 150;

function GamePlay() {
  const intl = useIntl();
  const [form] = useForm();
  const history = useHistory();
  const { handleException } = useExceptions();

  const { togglePlay } = useAudio(explosion);
  const { togglePlay: audioRocketLauch } = useAudio(rocketLauch);
  const { togglePlay: audiogamerLeaveWin } = useAudio(gamerLeaveWin);
  const { togglePlay: audiobgGame, audioStatus } = useAudio(bgGame, 0.2, true);

  const ref = useRef(null);
  const canvasRef = useRef(null);
  const initAmount = useRef(0);
  const winRate = useRef(0);
  const lossRate = useRef(0);

  const [isAuto, setIsAuto] = useState(false);
  const [gameState, setGameState] = useState(moonGameAllStates["FINISH"]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayInRun, setIsPlayInRun] = useState(false);

  const [hasSoundEffect, setHasSoundEffect] = useState(false);

  const { currentBalance, setCurrentBalance, setModalObject } =
    useContext(RootContext);
  const { userInfos } = useSelector((state) => state.userReducer);

  const balance = currentBalance?.length > 0 && currentBalance[0]?.amount;

  const canvasW =
    canvasRef.current && canvasRef.current.getBoundingClientRect().width;
  const canvasH = isMobile
    ? canvasW && (canvasW * 2) / 3
    : canvasW && (canvasW * 6) / 10;

  const ROCKET_APPEND = 55;
  const STAR_APPEND = 5000;
  const CLOUD_APPEND = 13000;
  const METEOR_APPEND = 32000 || 77000;
  const PLANET_APPEND = 20000;
  const COMET_APPEND = 75000 || 95000;
  let stopId;
  let startTime = Date.now();
  let elapsed = 0;
  let isStart = false;
  let isUmbrelaFly = false;

  useEffect(() => {
    if (!soundEffectGlobal) {
      audiobgGame(false);
      audioRocketLauch(false);
    }
    if (soundEffectGlobal) {
      audiobgGame(true);
      switch (gameState) {
        case moonGameAllStates["RUN"]:
          audioRocketLauch();
          break;

        default:
          break;
      }
    }
  }, [soundEffectGlobal, gameState]);

  const initRocketBase = () => {
    const getCanvas = () => canvasRef.current;
    const canvas = getCanvas();
    const ctx = canvas && canvas.getContext("2d");

    const run = () => {
      if (canvas) {
        const { height } = canvas.getBoundingClientRect();
        const allAssets = turnAssets(canvas);
        const assetResolved = planetArr(allAssets);
        const clouds = cloudAssets(canvas);
        const cloudsBottom = cloudAssetsBottom(canvas);
        const rockets = rocketAssets(allAssets);
        const stars = starsAssets(canvas);
        const comets = cometAssets(canvas);
        const meteors = meteorsAssets(canvas);
        const planets = planetAssets(canvas);
        const foundRocket = rockets.find((rocket) => rocket.name === "rocket");
        const booms = boomAssets(canvas, foundRocket);
        const handleAnimate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (isStart) {
            elapsed = Date.now() - startTime;
          }

          if (elapsed > COMET_APPEND) {
            comets.forEach((comet) => {
              drawCtx(ctx, comet);
              if (isStart) {
                comet.y = comet.y + 5;
                comet.x--;
              }
            });
          }
          if (elapsed > STAR_APPEND) {
            stars.forEach((star) => {
              drawCtx(ctx, star);
              if (isStart) {
                star.y = star.y + 3;
              }
            });
          }

          if (elapsed > METEOR_APPEND) {
            meteors.forEach((meteor) => {
              drawCtx(ctx, meteor);
              if (isStart) {
                meteor.y = meteor.y + 3;
              }
            });
            planets.forEach((planet) => {
              drawCtx(ctx, planet);
              isStart && planet.y++;
            });
          }

          if (elapsed > PLANET_APPEND) {
            assetResolved.forEach((option) => {
              if (option.append !== 0 && elapsed > option.append) {
                drawCtx(ctx, option.planet);
                if (isStart && option.isMove) {
                  if (option.planet.flag === "BASE") {
                    option.planet.x--;
                    option.planet.y++;
                  } else {
                    option.planet.y++;
                  }
                }
              }
            });
          }
          clouds.forEach((cloud) => {
            drawCtx(ctx, cloud);
            if (isStart) {
              cloud.y += 2;
            }
          });
          if (elapsed > CLOUD_APPEND) {
            if (isStart) {
              cloudsBottom.forEach((cloud) => {
                drawCtx(ctx, cloud);
                if (cloud.y > height - 50) {
                  cloud.y--;
                }
              });
            }
          }
          rockets.forEach(({ isMoveUp, src, name }) => {
            drawCtx(ctx, src);
            if (isStart) {
              if (isMoveUp) {
                if (
                  src.y >
                  (name === "rocket"
                    ? ROCKET_APPEND
                    : ROCKET_APPEND + foundRocket.src.h - 10)
                ) {
                  src.y--;
                  dy = src.y--;
                }
              } else {
                src.y++;
              }
            }
            if (isFinish && !isStart) {
              booms.forEach((boom) => {
                ctx.drawImage(
                  boom.img,
                  0,
                  0,
                  boom.img.width,
                  boom.img.height,
                  boom.x,
                  (boom.y = dy - foundRocket.src.h / 2),
                  boom.w,
                  boom.h
                );
                boom.y = boom.y + boom.ry;
                boom.x = boom.x + boom.rx;
              });
              ctx.drawImage(
                allAssets.explosion_glare.img,
                0,
                0,
                allAssets.explosion_glare.img.width,
                allAssets.explosion_glare.img.height,
                foundRocket.src.x - 75,
                foundRocket.src.y - 50,
                allAssets.explosion_glare.w,
                allAssets.explosion_glare.h
              );
              ctx.drawImage(
                allAssets.explosion_flame.img,
                0,
                0,
                allAssets.explosion_flame.img.width,
                allAssets.explosion_flame.img.height,
                foundRocket.src.x - 75,
                foundRocket.src.y - 50,
                allAssets.explosion_flame.w,
                allAssets.explosion_flame.h
              );
            }
          });

          if (isUmbrelaFly && usersLeave?.length > 0) {
            for (let i = 0; i < usersLeave.length; i++) {
              if (usersLeave[i].parachute == undefined) {
                usersLeave[i] = {
                  ...usersLeave[i],
                  parachute: Object.assign(
                    {},
                    {
                      ...allAssets.parachute,
                      y: foundRocket.src.y,
                      rx: Math.floor(Math.random() * 6) - 3,
                      ry:
                        Math.floor(Math.random() * 6) - 3 === 0
                          ? 1
                          : Math.floor(Math.random() * 6) - 3,
                    }
                  ),
                };
              }
              drawCtx(ctx, usersLeave[i].parachute);
              ctx.font = "16px Verdana";
              ctx.fillStyle = "#fff";
              ctx.fillText(
                subNameCode(usersLeave[i].userName),
                usersLeave[i].parachute.x,
                usersLeave[i].parachute.y
              );
              usersLeave[i].parachute.x =
                usersLeave[i].parachute.x + usersLeave[i].parachute.rx;
              usersLeave[i].parachute.y++;
            }
          }
          stopId = window.requestAnimationFrame(handleAnimate);
        };
        handleAnimate();
      }
    };

    const restartGame = () => {
      isStart = false;
      startTime = Date.now();
      elapsed = 0;
      cancelAnimationFrame(stopId);
      run();
    };

    restartGame();

    moonSocketSubscriber(socketTypes.MOON_TICK, (data) => {
      if (data) {
        tempMulti = turnFormatMulti(data?.multiplier);
        const getMultiText = document.getElementById("multi");
        if (getMultiText) {
          getMultiText.innerText = `x${turnFormatMulti(tempMulti)}`;
        }
        // multiCalculator(parseFloat(tempMulti));
      }
    });

    moonSocketSubscriber(socketTypes.MOON_PLAYER, (data) => {
      if (isStart) {
        if (data?.user?.state === moonGameAllStates["CASHOUT"]) {
          if (data?.user?.multiplier > 0 && soundEffectGlobal) {
            audiogamerLeaveWin();
          }
          let isInArray = false;
          for (let j = 0; j < usersLeave.length; j++) {
            if (data?.user.userName === usersLeave[j].userName) {
              isInArray = true;
            }
          }
          if (!isInArray) usersLeave.push({ ...data?.user });
        }
      }
    });

    moonSocketSubscriber(socketTypes.MOON_GET_STATE, (data) => {
      setGameState(data?.state);
      if (data?.state === moonGameAllStates["RUN"]) {
        if (!isStart) {
          restartGame();
          isStart = true;
        }
        if (!isUmbrelaFly) {
          isUmbrelaFly = true;
        }
      }
    });

    moonSocketSubscriber(socketTypes.MOON_STATE_WAIT, (data) => {
      const _moonOverlay = document.getElementById("_moonOverlay");
      const getHtml = document.getElementById("multi");
      if (_moonOverlay) {
        _moonOverlay.classList.add("moon-overlay");
      }
      if (getHtml) {
        getHtml.innerText = `x${turnFormatMulti(tempMulti)}`;
      }
      restartGame();
      isFinish = false;
      isUmbrelaFly = false;
      usersLeave = [];
      dy = 0;
      setGameState(data?.state);
    });

    moonSocketSubscriber(socketTypes.MOON_STATE_READY, (data) => {
      setGameState(data?.state);
      const _moonOverlay = document.getElementById("_moonOverlay");
      const getMultiID = document.getElementById("multi");
      if (_moonOverlay) {
        _moonOverlay.classList.add("moon-overlay-remove");
      }
      if (getMultiID) {
        getMultiID.innerText = `x1.00`;
      }
      const time = document.getElementById("time");
      const countdown = new Countdown(time, 5, soundEffectGlobal);
      countdown.init();
      countdown.start();
      if (!!tempDataWhenRun) {
        moonSocketEmitter(
          socketTypes.MOON_PLACE_BET,
          tempDataWhenRun,
          async (err) => {
            if (!!err) {
              const { fetchData } = await handleException(err);
              if (fetchData?.code === ENOUGHBALANCE_CODE) {
                form.setFields([
                  {
                    name: "amount",
                    errors: [fetchData?.message],
                  },
                ]);
              }
            }
          },
          () => console.log("success")
        );
        tempDataWhenRun = null;
        setIsPlayInRun(false);
        setIsPlaying(true);
      }
      if (savingData?.autoPlay) {
        setIsPlaying(true);
        const newAmount = form.getFieldValue("amount");
        const autoCashout = form.getFieldValue("autoCashout");
        const sendData = {
          accessToken: `Bearer ${userInfos?._token}`,
          amount: parseFloat(newAmount),
          currency: USDT,
          autoCashout: autoCashout ? autoCashout : 0,
        };
        moonSocketEmitter(
          socketTypes.MOON_PLACE_BET,
          sendData,
          async (err) => {
            if (!!err) {
              const { fetchData } = await handleException(err);
              if (fetchData?.code === ENOUGHBALANCE_CODE) {
                form.setFields([
                  {
                    name: "amount",
                    errors: [fetchData?.message],
                  },
                ]);
              }
            }
          },
          () => {
            placeBetSuccess = true;
          }
        );
      }
    });

    moonSocketSubscriber(socketTypes.MOON_STATE_RUN, (data) => {
      setGameState(data?.state);
      const time = document.getElementById("time");
      const countdown = new Countdown(time, 10);
      const _moonOverlay = document.getElementById("_moonOverlay");
      if (_moonOverlay) {
        _moonOverlay.classList.remove("moon-overlay");
        _moonOverlay.classList.remove("moon-overlay-remove");
      }
      countdown.reset();
      if (!isStart) {
        restartGame();
        isStart = true;
      }
      if (!isUmbrelaFly) {
        isUmbrelaFly = true;
      }
    });
    moonSocketSubscriber(socketTypes.MOON_STATE_FINISH, (data) => {
      isStart = false;
      isFinish = true;

      setGameState(data?.state);
      if (soundEffectGlobal) {
        togglePlay();
      }
    });

    moonSocketSubscriber(socketTypes.MOON_RESULT, (data) => {
      setIsPlaying(false);
      !!savingData && handleAutoAdvance(data);
    });

    moonSocketSubscriber(socketTypes.MOON_BALANCE, (data) => {
      setCurrentBalance([
        {
          amount: data?.balance,
          currency: data?.currency,
        },
      ]);
    });
  };

  useEffect(() => {
    initRocketBase();
    return () => cancelAnimationFrame(stopId);
  }, []);

  const handleSwitchAuto = (checked) => {
    setIsAuto(checked);
    if (!checked) {
      setIsPlaying(false);
      savingData = null;
      setIsAutoPlaying(false);
    }
  };

  // let count = 0,
  //   prev = 1;

  // const multiCalculator = (i1) => {
  //   let timeLeft = 0;
  //   if (count === 0) {
  //     count = 1;
  //     prev = i1;
  //   }
  //   const getMultiText = document.getElementById("multi");
  //   setTimeout(() => {
  //     timeLeft = i1 - prev;
  //     // if (prev <= i1) {
  //     //   // console.log(`prev-${prev} --- i1-${i1}`);
  //     //   const count =turnFormatMulti(prev + 0.01)
  //     //   getMultiText.innerText = `x${count}`;
  //     // }

  //     if (timeLeft > 0) {
  //       if (getMultiText) {
  //         setInterval(() => {
  //           getMultiText.innerText = `x${turnFormatMulti(
  //             parseFloat(prev) + 0.01
  //           )}`;
  //         }, 1);
  //       }
  //     }
  //     prev = i1;
  //   }, TIME_OUT);
  // };

  const handlePlay = (values) => {
    const amountHasValue = values?.amount;
    if (amountHasValue) {
      if (!userInfos) {
        setModalObject((modalObject) => ({
          ...modalObject,
          state: true,
          modalContent: (
            <NotifyToSignUpgame
              setModalObject={setModalObject}
              history={history}
            />
          ),
          title: null,
        }));
      } else {
        savingData = values;
        const sendData = {
          accessToken: `Bearer ${userInfos?._token}`,
          amount: parseFloat(values?.amount),
          currency: USDT,
          autoCashout: values?.leave ? values?.autoCashout : 0,
        };
        if (values?.autoPlay) {
          setIsAutoPlaying(true);
          lossRate.current = values?.loss ?? 0;
          winRate.current = values?.win ?? 0;
          initAmount.current = parseFloat(values?.amount);
        }
        setIsPlaying(true);
        if (gameState === moonGameAllStates["READY"] && !values?.autoPlay) {
          moonSocketEmitter(
            socketTypes.MOON_PLACE_BET,
            sendData,
            async (err) => {
              if (!!err) {
                const { fetchData } = await handleException(err);
                if (fetchData?.code === ENOUGHBALANCE_CODE) {
                  form.setFields([
                    {
                      name: "amount",
                      errors: [fetchData?.message],
                    },
                  ]);
                }
                if (fetchData?.code === GAME_RUNNING) {
                  setIsPlaying(false);
                }
              }
            },
            () => console.log("success")
          );
        }
        if (gameState === moonGameAllStates["READY"] && values?.autoPlay) {
          sendData.autoCashout = values?.autoCashout;
          moonSocketEmitter(
            socketTypes.MOON_PLACE_BET,
            sendData,
            async (err) => {
              if (!!err) {
                const { fetchData } = await handleException(err);
                if (fetchData?.code === ENOUGHBALANCE_CODE) {
                  form.setFields([
                    {
                      name: "amount",
                      errors: [fetchData?.message],
                    },
                  ]);
                }
              }
            },
            () => console.log("success")
          );
        }
        if (gameState !== moonGameAllStates["READY"] && !values?.autoPlay) {
          tempDataWhenRun = sendData;
          setIsPlayInRun(true);
        }
        if (gameState !== moonGameAllStates["READY"] && values?.autoPlay) {
          setIsPlaying(false);
        }
      }
    } else {
      form.setFields([
        {
          name: "amount",
          errors: [
            `${intl.formatMessage(translationsComponents.REQUIRED_ERROR)}`,
          ],
        },
      ]);
    }
  };

  const handleLeave = useCallback(() => {
    setIsPlaying(false);
    const sendData = {
      accessToken: `Bearer ${userInfos?._token}`,
    };
    moonSocketEmitter(
      socketTypes.MOON_LEAVE,
      sendData,
      (err) => {
        handleException(err);
      },
      () => console.log("success")
    );
  });

  const handleStop = () => {
    setIsPlaying(false);
    savingData = null;
    setIsAutoPlaying(false);
  };

  const handleAutoAdvance = (result) => {
    const getWin = form.getFieldValue("win");
    const getLoss = form.getFieldValue("loss");
    const getNum = form.getFieldValue("numberAdvance");

    placeBetSuccess &&
      form.setFieldsValue({
        numberAdvance: getNum > 0 ? getNum - 1 : 0,
      });
    placeBetSuccess = false;
    if (getNum === 1) {
      handleStop();
    }
    if (getLoss > 0 && getWin > 0) {
      if (result?.isWin) {
        turnAmountResult(winRate);
      }
      if (!result?.isWin) {
        turnAmountResult(lossRate);
      }
      return;
    }
    if (getWin > 0) {
      if (!result?.isWin) {
        form.setFieldsValue({
          amount: initAmount.current,
        });
      } else {
        turnAmountResult(winRate);
      }
      return;
    }
    if (getLoss > 0) {
      if (result?.isWin) {
        form.setFieldsValue({
          amount: initAmount.current,
        });
      } else {
        turnAmountResult(lossRate);
      }
      return;
    }
  };

  const turnAmountResult = (rate) => {
    const amountFromFeild = form.getFieldValue("amount");
    const newAmount =
      parseFloat(amountFromFeild) +
      (parseFloat(amountFromFeild) * rate.current) / 100;
    if (newAmount) {
      form.setFieldsValue({
        amount: newAmount.toFixed(2),
      });
    }
  };

  return (
    <ScreenView>
      <AccountBalance
        title={intl.formatMessage(translationsComponents.MOON_GAME)}
      />
      <section>
        <RowWrapper
          gutter={16}
          style={{ flexDirection: isMobile ? "column-reverse" : "initial" }}
        >
          <ColWrapper ref={ref} xs={24} md={16} xl={16}>
            <div
              style={{
                position: "relative",
              }}
            >
              <canvas
                id="canvas_moon"
                ref={canvasRef}
                style={{
                  width: "100%",
                  backgroundColor: blueColor,
                }}
                height={canvasH}
                width={canvasW}
              />
              <OverLayText>
                <div className="wrapper" id="_moonOverlay">
                  <span className="child" style={{ opacity: 0 }}>
                    {intl.formatMessage(translationsComponents.MOON_GAME)}
                  </span>
                  <span className=" child flex-view">
                    <span className="crash-at active-crash" id="crash">
                      {intl.formatMessage(translationsComponents.CRASHED_AT)}
                    </span>
                    <span id="multi" className="multi active-multi" />
                  </span>
                  <span className="child flex-view next active-next" id="next">
                    <span style={{ textTransform: "capitalize" }}>
                      {intl.formatMessage(
                        translationsComponents.TIME_NEXT_GAME
                      )}
                    </span>
                    <span id="time">00:00:00</span>
                  </span>
                </div>
              </OverLayText>
            </div>
            <div
              style={{
                maxWidth: 700,
                width: "100%",
                padding: "0 10px",
                margin: "20px auto 0 auto",
              }}
              className="game-actions"
            >
              <GameForm
                form={form}
                isAuto={isAuto}
                myBalance={balance}
                gameState={gameState}
                isPlaying={isPlaying}
                handleStop={handleStop}
                handlePlay={handlePlay}
                handleLeave={handleLeave}
                isAutoPlaying={isAutoPlaying}
                handleSwitchAuto={handleSwitchAuto}
                hasSoundEffect={audioStatus}
                tempDataWhenRun={isPlayInRun}
                handleControlSound={() => {
                  setHasSoundEffect((state) => !state);
                  soundEffectGlobal = !soundEffectGlobal;
                }}
              />
            </div>
          </ColWrapper>
          <Players listHeight={canvasH} />
        </RowWrapper>
      </section>
    </ScreenView>
  );
}

export default React.memo(GamePlay);

const turnFormatMulti = (number) => (Math.round(number * 100) / 100).toFixed(2);

const OverLayText = styled.div`
  top: 0px;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  justify-content: center;
  .wrapper {
    font-weight: 700;
    letter-spacing: 1px;
    text-align: center;
    color: rgb(255, 255, 255);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    .child {
      &:nth-child(1) {
        flex: 1 1 50%;
      }
      &:nth-child(2) {
        flex: 1 1 35%;
      }
      &:nth-child(3) {
        flex: 1 1 15%;
      }
    }
    .crash-at {
      font-size: 2.3vw;
      opacity: 0;
      color: red;
      transition: all 0.3s ease-in-out;
      text-transform: uppercase;
    }
    .multi {
      font-size: 6vw;
    }
    .next {
      opacity: 0;
      font-size: 2.3vw;
    }
    .flex-view {
      display: flex;
      justify-content: center;
      flex-direction: column;
      transition: all 0.3s ease-in-out;
    }
  }
  .moon-overlay {
    -webkit-backdrop-filter: blur(10px);
    -moz-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    background-color: rgba(0, 0, 0, 0.5);
    .active-crash {
      opacity: 1;
    }
    .active-multi {
      color: red;
    }
  }
  .moon-overlay-remove {
    .active-multi {
      color: white;
    }
    .crash-at {
      opacity: 0;
    }
    .active-next {
      opacity: 1;
    }
  }
`;
