import k from "../kaplayContext.js";

//used for getting local json data
export async function fetchData(path) {
  return await (await fetch(path)).json();
}

//used for looping animations
export function playAnimIfNotPlaying(gameObj, animName) {
  if (gameObj.curAnim() !== animName) {
    gameObj.play(animName);
  }
}

export function setBackgroundColor(color) {
  k.add([k.rect(k.width(), k.height()), k.color(k.rgb(color)), k.fixed(), k.layer("background")]);
}

export function debugLog(verbosity, message) {
  switch (verbosity) {
    case "warn":
      console.warn(message);
      k.debug.log(message);
      break;
    case "error":
      console.error(message);
      k.debug.error(message);
      break;
    default:
      console.log(message);
      k.debug.log(message);
      break;
  }
}

export function screenFx() {
  return [
    k.rect(k.width(), k.height()),
    k.color(k.WHITE),
    k.fixed(),
    k.opacity(0),
    k.layer("foreground"),
    {
      flash() {
        blinkEffect(this, 2, 0.3, true);
      },
    },
  ];
}

export async function blinkEffect(entity, loops = 1, duration = 0.1, appear = false) {
  for (let i = 0; i < loops; i++) {
    await k.tween(
      entity.opacity,
      appear ? 1 : 0,
      duration,
      (val) => (entity.opacity = val),
      k.easings.linear,
    );
    await k.tween(
      entity.opacity,
      appear ? 0 : 1,
      duration,
      (val) => (entity.opacity = val),
      k.easings.linear,
    );
  }
}

// TODO explosion with particles
export function explosion(pos) {}

export function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

//use k.randi(min, max) instead
export function randomIntRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + 1);
}
