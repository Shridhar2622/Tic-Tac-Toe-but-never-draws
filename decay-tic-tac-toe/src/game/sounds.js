export function createSounds() {
  const xSound = new Audio("/sounds/x.mp3");
  const oSound = new Audio("/sounds/o.mp3");
  const popSound = new Audio("/sounds/pop-402324.mp3");
  const winSound = new Audio("/sounds/win.mp3");
  const music = new Audio("/sounds/music.mp3");

  music.loop = true;
  music.volume = 0.4;

  return {
    xSound,
    oSound,
    popSound,
    winSound,
    music
  };
}
