import countdown from "~/assets/audios/moonSoundEffects/countdown.wav";

export function Countdown(elem, seconds, isPlaySound) {
  const that = {};
  const audioCountdown = new Audio(countdown);
  that.elem = elem;
  that.seconds = seconds;
  that.totalTime = seconds * 100;
  that.usedTime = 0;
  that.startTime = +new Date();
  that.timer = null;

  that.count = function () {
    that.usedTime = Math.floor((+new Date() - that.startTime) / 10);

    const tt = that.totalTime - that.usedTime;
    if (tt <= 0) {
      if (that.elem) {
        that.elem.innerText = "00:00:00";
      }
      clearInterval(that.timer);
    } else {
      const mi = Math.floor(tt / (60 * 100));
      const ss = Math.floor((tt - mi * 60 * 100) / 100);
      const ms = tt - Math.floor(tt / 100) * 100;
      if (that.elem) {
        that.elem.innerText = `${that.fillZero(mi)}:${that.fillZero(
          ss
        )}.${that.fillZero(ms)}`;
      }
      if (that.fillZero(ss) <= 2 && isPlaySound) {
        audioCountdown.play();
      }
    }
  };

  that.init = function () {
    if (that.timer) {
      clearInterval(that.timer);
      that.totalTime = seconds * 100;
      that.usedTime = 0;
      that.startTime = +new Date();
      that.timer = null;
    }
  };
  that.reset = function () {
    if (that.timer) {
      clearInterval(that.timer);
      that.elem.innerText = ``;
      that.totalTime = seconds * 100;
      that.usedTime = 0;
      that.startTime = +new Date();
      that.timer = null;
    }
  };

  that.start = function () {
    if (!that.timer) {
      that.timer = setInterval(that.count, 1);
    }
  };

  that.fillZero = function (num) {
    return num < 10 ? "0" + num : num;
  };

  return that;
}
