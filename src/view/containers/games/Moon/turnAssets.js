import * as ASSETS from "./assets";
export const turnAssets = (canV) => {
  const { width: canvasFWidth } = canV.getBoundingClientRect();
  const canvasFHeight = (canvasFWidth * 2) / 3;

  const BASE = "BASE";
  const HOLE = "HOLE";

  const launchPadImg = new Image();
  launchPadImg.src = ASSETS.launchPadImg_ico;

  const lauchPad = {
    img: launchPadImg,
    x: canvasFWidth / 2 - 255 / 2,
    y: canvasFHeight - 145,
    w: 255,
    h: 145,
    flag: BASE,
  };

  const rocketImg = new Image();
  rocketImg.src = ASSETS.rocketImg_ico;

  const rocket = {
    img: rocketImg,
    x: canvasFWidth / 2 - 10,
    y: lauchPad.y + 70 / 2,
    w: 40,
    h: 70,
    flag: BASE,
  };

  const fireImg = new Image();
  fireImg.src = ASSETS.fireImg_ico;
  const fire = {
    img: fireImg,
    x: canvasFWidth / 2,
    y: rocket.y + rocket.h - 10,
    w: 20,
    h: 25,
  };

  const laserImg = new Image();
  laserImg.src = ASSETS.laser_01_ico;
  const laser = {
    img: laserImg,
    x: canvasFWidth / 2 - 5,
    y: rocket.y + rocket.h - 10,
    w: 30,
    h: 45,
  };

  const explosion_glareImg = new Image();
  explosion_glareImg.src = ASSETS.explosion_glare_ico;
  const explosion_glare = {
    img: explosion_glareImg,
    x: canvasFWidth / 2 - (rocket.w + 30),
    y: rocket.y - 280,
    w: 200,
    h: 200,
  };
  const explosion_flameImg = new Image();
  explosion_flameImg.src = ASSETS.explosion_flame_ico;
  const explosion_flame = {
    img: explosion_flameImg,
    x: canvasFWidth / 2 - (rocket.w + 30),
    y: rocket.y - 280,
    w: 200,
    h: 200,
  };

  const smokeImg = new Image();
  smokeImg.src = ASSETS.smoke_01_ico;
  const smoke = {
    img: smokeImg,
    x: canvasFWidth / 2 - (rocket.w + 30),
    y: rocket.y - 280,
    w: 150,
    h: 150,
  };

  const parachuteImg = new Image();
  parachuteImg.src = ASSETS.parachute_ico;

  const parachute = {
    img: parachuteImg,
    x: canvasFWidth / 2,
    y: rocket.y - 220,
    w: 75,
    h: 100,
  };

  const marsImg = new Image();
  marsImg.src = ASSETS.marsImg_ico;

  const planetMars = {
    img: marsImg,
    x: canvasFWidth / 3 + canvasFWidth / 2,
    y: -150,
    w: 150,
    h: 150,
    flag: BASE,
  };

  const jupiterImg = new Image();
  jupiterImg.src = ASSETS.jupiterImg_ico;

  const planetJupiter = {
    img: jupiterImg,
    x: canvasFWidth / 10 + canvasFWidth / 2,
    y: -450,
    w: 200,
    h: 200,
    flag: HOLE,
  };

  const neptuneImg = new Image();
  neptuneImg.src = ASSETS.neptuneImg_ico;

  const planetNeptune = {
    img: neptuneImg,
    x: Math.floor((Math.random() * canvasFWidth) / 2),
    y: -150,
    w: 150,
    h: 150,
    flag: BASE,
  };

  const saturnImg = new Image();
  saturnImg.src = ASSETS.saturn_ico;

  const planetSaturn = {
    img: saturnImg,
    x: Math.floor((Math.random() * canvasFWidth) / 3),
    y: -150,
    w: 150,
    h: 150,
    flag: HOLE,
  };

  const uranusImg = new Image();
  uranusImg.src = ASSETS.uranus_ico;

  const planetUranus = {
    img: uranusImg,
    x: Math.floor(Math.random() * canvasFWidth),
    y: -150,
    w: 150,
    h: 150,
    flag: HOLE,
  };

  const plutoImg = new Image();
  plutoImg.src = ASSETS.plutoImg_ico;

  const planetPluto = {
    img: plutoImg,
    x: Math.floor(Math.random() * canvasFWidth),
    y: -100,
    w: 100,
    h: 100,
    flag: BASE,
  };

  const blackHoleImg = new Image();
  blackHoleImg.src = ASSETS.blackhole_hole_ico;

  const blackHole = {
    img: blackHoleImg,
    x: Math.floor(Math.random() * canvasFWidth),
    y: -550,
    w: 500,
    h: 500,
    flag: HOLE,
  };

  const blackRingImg = new Image();
  blackRingImg.src = ASSETS.blackhole_ring_ico;

  const blackRing = {
    img: blackRingImg,
    x: Math.floor(Math.random() * canvasFWidth),
    y: -650,
    w: 600,
    h: 600,
    flag: HOLE,
  };

  return {
    planetNeptune,
    planetMars,
    planetJupiter,
    planetPluto,
    blackRing,
    blackHole,
    planetSaturn,
    planetUranus,
    fire,
    smoke,
    laser,
    rocket,
    lauchPad,
    parachute,
    explosion_glare,
    explosion_flame,
  };
};

export const rocketAssets = (mat) => {
  return [
    { isMoveUp: true, src: mat.rocket, name: "rocket" },
    { isMoveUp: false, src: mat.lauchPad, name: "pad" },
    { isMoveUp: true, src: mat.laser, name: "laser" },
    { isMoveUp: true, src: mat.fire, name: "fire" },
  ];
};

export const planetArr = (mat) => {
  return [
    {
      planet: mat.planetMars,

      isMove: true,
      append: 15000,
    },
    {
      planet: mat.planetJupiter,

      isMove: true,
      append: 30000,
    },
    {
      planet: mat.planetSaturn,
      isMove: true,
      append: 40000,
    },
    {
      planet: mat.blackHole,
      isMove: true,
      append: 950000,
    },
    {
      planet: mat.planetUranus,
      isMove: true,
      append: 52000,
    },
    {
      planet: mat.planetNeptune,

      isMove: true,
      append: 62000,
    },
    {
      planet: mat.blackRing,
      isMove: true,
      append: 1250000,
    },
    {
      planet: mat.planetPluto,

      isMove: true,
      append: 75000,
    },
  ];
};

export const drawCtx = (ctx, dir) => {
  ctx.drawImage(
    dir.img,
    0,
    0,
    dir.img.width,
    dir.img.height,
    dir.x,
    dir.y,
    dir.w,
    dir.h
  );
};

export function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const cloudAssetsBottom = (canvas) => {
  const { width: canvasFWidth } = canvas.getBoundingClientRect();
  const canvasFHeight = (canvasFWidth * 2) / 3;
  const m01_cloud_00Img = new Image();
  m01_cloud_00Img.src = ASSETS.m01_cloud_00_ico;
  let clouds = [];
  for (let index = 0; index < 5; index++) {
    clouds.push({
      img: m01_cloud_00Img,
      x: randomInteger(-301, canvasFWidth - 10),
      y: canvasFHeight,
      w: randomInteger(385, canvasFWidth),
      h: (((canvasFWidth * 80) / 100) * 2) / 3,
    });
  }
  return clouds;
};

export const cloudAssets = (canvas) => {
  let clouds = [];
  const { width: canvasFWidth } = canvas.getBoundingClientRect();
  const canvasFHeight = (canvasFWidth * 2) / 3;

  const m01_cloud_00Img = new Image();
  m01_cloud_00Img.src = ASSETS.m01_cloud_00_ico;

  for (let index = 0; index < 5; index++) {
    const x = Math.random() * canvasFWidth;
    const y = -(Math.random() * canvasFHeight);
    const w = randomInteger(1, 300);
    clouds.push({
      img: m01_cloud_00Img,
      x,
      y,
      w,
      h: (w * 2) / 3,
    });
  }
  return clouds;
};
export const starsAssets = (canvas) => {
  let stars = [];
  const { width: canvasFWidth } = canvas.getBoundingClientRect();
  const canvasFHeight = (canvasFWidth * 2) / 3;

  const star = new Image();
  star.src = ASSETS.star_ico;
  for (let index = 0; index < 1500; index++) {
    const x = Math.random() * canvasFWidth;
    const y = -(Math.random() * (canvasFHeight * 50));
    const w = Math.random() * 20;
    stars.push({
      img: star,
      x,
      y,
      w,
      h: w,
    });
  }
  return stars;
};

export const cometAssets = (canvas) => {
  let comets = [];
  const { width: canvasFWidth } = canvas.getBoundingClientRect();
  const canvasFHeight = (canvasFWidth * 2) / 3;

  const comet = new Image();
  comet.src = ASSETS.comet_ico;
  for (let index = 0; index < 20; index++) {
    const x = Math.random() * canvasFWidth;
    const y = -(Math.random() * (canvasFHeight * 2));
    const h = Math.random() * 40;
    comets.push({
      img: comet,
      x,
      y,
      w: h * 4,
      h,
    });
  }
  return comets;
};

export const meteorsAssets = (canvas) => {
  let meteors = [];
  const { width: canvasFWidth } = canvas.getBoundingClientRect();
  const canvasFHeight = (canvasFWidth * 2) / 3;

  const meteor = new Image();
  meteor.src = ASSETS.meteor_ico;
  for (let index = 0; index < 30; index++) {
    const x = Math.random() * canvasFWidth;
    const y = -(Math.random() * (canvasFHeight * 20));
    const w = Math.random() * 100;
    meteors.push({
      img: meteor,
      x,
      y,
      w,
      h: w,
    });
  }
  return meteors;
};

export const planetAssets = (canvas) => {
  let planets = [];
  const { width: canvasFWidth } = canvas.getBoundingClientRect();
  const canvasFHeight = (canvasFWidth * 2) / 3;
  for (let index = 0; index < 15; index++) {
    const planet_1 = new Image();
    planet_1.src = ASSETS.planet_01_ico;
    const planet_2 = new Image();
    planet_2.src = ASSETS.planet_02_ico;
    const planet_3 = new Image();
    planet_3.src = ASSETS.planet_03_ico;
    const x = Math.random() * canvasFWidth;
    const y = -(Math.random() * (canvasFHeight * 15));
    const w = Math.random() * 50;
    planets.push({
      img: planet_1,
      x,
      y,
      w,
      h: w,
    });
    planets.push({
      img: planet_2,
      x,
      y,
      w,
      h: w,
    });
    planets.push({
      img: planet_3,
      x,
      y,
      w,
      h: w,
    });
  }
  return planets;
};

export const boomAssets = (canvas, foundRocket) => {
  let booms = [];
  const { width: canvasFWidth } = canvas.getBoundingClientRect();

  for (let index = 0; index < 6; index++) {
    const explosion_shard_01 = new Image();
    const explosion_shard_02 = new Image();

    explosion_shard_01.src = ASSETS.explosion_shard_01_ico;
    explosion_shard_02.src = ASSETS.explosion_shard_02_ico;
    const x = canvasFWidth / 2;
    const w = Math.random() * 35;
    booms.push({
      img: explosion_shard_01,
      x: foundRocket.src.x,
      y: foundRocket.src.y,
      w,
      h: w,
      rx:
        Math.floor(Math.random() * 6) - 3 === 0
          ? 1
          : Math.floor(Math.random() * 6) - 3,
      ry: Math.floor(Math.random() * 6) - 3,
    });
    booms.push({
      img: explosion_shard_02,
      x,
      x: foundRocket.src.x,
      y: foundRocket.src.y,
      h: w,
      rx: Math.floor(Math.random() * 6) - 3,
      ry:
        Math.floor(Math.random() * 6) - 3 === 0
          ? 1
          : Math.floor(Math.random() * 6) - 3,
    });
  }
  return booms;
};
