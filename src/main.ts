// Real timer
const realTimeNode = document.querySelector("#local-time");
let today = new Date();

const setTime = () => {
  const hours =
    today.getHours() > 12 ? today.getHours() - 12 : today.getHours();
  const time = today.getHours() > 12 ? "PM" : "AM";
  if (realTimeNode) {
    realTimeNode.children[0].innerHTML = hours < 10 ? `0${hours}` : `${hours}`;
    realTimeNode.children[2].innerHTML = `${
      today.getMinutes() < 10 ? `0${today.getMinutes()}` : today.getMinutes()
    } ${time}`;
  }
};

setTime();
setInterval(() => {
  setTime();
  today = new Date();
}, 5000);
