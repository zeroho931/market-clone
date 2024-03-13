function startchat(event) {
  const chat = document.querySelector(".chating");
  chat.style = "display: flex;flex-direction: column;";
}

async function createchat(value) {
  const res = await fetch("/chats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: new Date(),
      content: value,
    }),
  });
  readchat();
}

function displaychats(chating) {
  const ul = document.querySelector(".chat_ul");
  const li = document.createElement("li");
  li.innerText = `[id:${chating.id}] ${chating.content}`;
  ul.appendChild(li);
}

async function readchat() {
  const res = await fetch("/chats");
  const jsonRes = await res.json();
  const ul = document.querySelector(".chat_ul");
  ul.innerText = "";
  jsonRes.forEach(displaychats);
}

function submitchat(event) {
  event.preventDefault();
  const input = document.querySelector("#chating-input");
  createchat(input.value);
  input.value = "";
}

const chating = document.querySelector(`.footer-icons[data-index='chat']`);
chating.addEventListener("click", startchat);

const chat_sub = document.querySelector("#chating");

chat_sub.addEventListener("submit", submitchat);

const calcTime = (timestamp) => {
  const curTime = new Date().getTime() - 9 * 60 * 60 * 1000;
  const time = new Date(curTime - timestamp);
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  if (hour > 0) return `${hour} 시간 전 `;
  else if (minute > 0) return `${minute} 분 전 `;
  else if (second >= 0) return `${second} 초 전 `;
  else "방금 전";
};

const renderDate = (data) => {
  const main = document.querySelector("main");

  data.reverse().forEach(async (obj) => {
    const imgDiv = document.createElement("div");
    imgDiv.className = "item-list__img";

    const img = document.createElement("img");
    const resImg = await fetch(`/images/${obj.id}`);
    const blob = await resImg.blob();
    const url = URL.createObjectURL(blob);
    img.src = url;

    imgDiv.appendChild(img);

    const div = document.createElement("div");
    div.className = "item-list";

    const InfoDiv = document.createElement("div");
    InfoDiv.className = "item-list__info";

    const InfoTitleDiv = document.createElement("div");
    InfoTitleDiv.className = "item-list__info-title";
    InfoTitleDiv.innerText = obj.title;

    const InfoMetaDiv = document.createElement("div");
    InfoMetaDiv.className = "item-list__info-meta";
    InfoMetaDiv.innerText = obj.place + " " + calcTime(obj.insertAt);

    const InfoPriceDiv = document.createElement("div");
    InfoPriceDiv.className = "item-list__info-price";
    InfoPriceDiv.innerText = obj.price;

    InfoDiv.appendChild(InfoTitleDiv);
    InfoDiv.appendChild(InfoMetaDiv);
    InfoDiv.appendChild(InfoPriceDiv);
    div.appendChild(imgDiv);
    div.appendChild(InfoDiv);

    main.appendChild(div);
  });
};

const fetchList = async () => {
  const accessToken = window.localStorage.getItem("token");
  const res = await fetch("/items", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.status === 401) {
    alert("로그인이 필요합니다");
    window.location.pathname = "/login.html";
    return;
  }
  const data = await res.json();
  renderDate(data);
};

fetchList();
