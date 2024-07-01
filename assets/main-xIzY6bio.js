import "./global-modpre.js";
const n = document.querySelector("#local-time");
let e = new Date();
const o = () => {
  const t = e.getHours() > 12 ? e.getHours() - 12 : e.getHours(),
    r = e.getHours() > 12 ? "PM" : "AM";
  n &&
    ((n.children[0].innerHTML = t < 10 ? `0${t}` : `${t}`),
    (n.children[2].innerHTML = `${
      e.getMinutes() < 10 ? `0${e.getMinutes()}` : e.getMinutes()
    } ${r}`));
};
o();
setInterval(() => {
  o(), (e = new Date());
}, 5e3);
//# sourceMappingURL=main-xIzY6bio.js.map
