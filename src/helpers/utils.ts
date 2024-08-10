export const calcWinsize = () => {
  return { width: window.innerWidth, height: window.innerHeight };
};
// Gets the mouse position
export const getMousePos = (e: MouseEvent) => {
  return {
    x: e.clientX,
    y: e.clientY,
  };
};
export const distance = (x1: number, y1: number, x2: number, y2: number) => {
  var a = x1 - x2;
  var b = y1 - y2;

  return Math.hypot(a, b);
};
// Linear interpolation
export const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;
