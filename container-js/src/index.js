import "./index.css";
import "./AppHeader.css";

const NAME_LIST = ["Browse", "Restaurant", "Vue"];

let currentMicroFrontend = "";
let prevMicroFrontend = "";

const getCurrentDomain = () => {
  const protocol = window.location.protocol;
  const port = window.location.port;
  const hostname = window.location.hostname;
  return protocol + "//" + hostname + (port ? ":" + port : "");
};

function getManifestUrl(type) {
  let domain;
  switch (type) {
    case "Browse":
      domain = "http://localhost:3201";
      break;
    case "Restaurant":
      domain = "http://localhost:3202";
      break;
    case "Vue":
      domain = "http://localhost:3203";
      break;
    default:
      domain = "http://localhost:3201";
  }
  return domain;
}

document.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
  document.querySelector("#navList").addEventListener("click", handleClickNav);

  // 初始化子前端系统
  urlReroute();

  // window.addEventListener("hashchange", urlReroute);
  window.addEventListener("popstate", urlReroute);
}

function handleClickNav(e) {
  console.log(e);
  const name = e.target.dataset.route;
  const path = e.target.dataset.path || "";
  setCurrentMicroFrontend(name);
  // initMicroFrontend();
  window.history.pushState(
    {},
    "",
    `${getCurrentDomain()}/${name.toLowerCase()}${path}`
  );
}

function setCurrentMicroFrontend(name) {
  prevMicroFrontend = currentMicroFrontend;
  currentMicroFrontend = name;

  initMicroFrontend();
}

function initMicroFrontend() {
  const name = currentMicroFrontend;
  const host = getManifestUrl(name);

  const scriptId = `micro-frontend-script-${name}`;

  if (document.getElementById(scriptId)) {
    renderMicroFrontend(name);
    return;
  }

  fetch(`${host}/asset-manifest.json`)
    .then((res) => res.json())
    .then((manifest) => {
      const script = document.createElement("script");
      script.id = scriptId;
      script.crossOrigin = "";
      script.src = `${host}${manifest["main.js"]}`;
      script.onload = () => {
        renderMicroFrontend(name);
      };
      document.head.appendChild(script);
    });
}

function renderMicroFrontend(name) {
  if (NAME_LIST.indexOf(prevMicroFrontend) > -1) {
    const prevUnmount = window[`unmount${prevMicroFrontend}`];
    prevUnmount && prevUnmount("root");
  }

  window[`render${name}`]("root");
}

function urlReroute() {
  const pathname = window.location.pathname;
  const pathnameArr = pathname.split("/");
  console.log(pathnameArr);
  if (pathnameArr.length >= 2 && pathnameArr[1]) {
    let name = pathnameArr[1][0].toUpperCase() + pathnameArr[1].substr(1);
    console.log(name);
    if (NAME_LIST.indexOf(name) > -1) {
      if (currentMicroFrontend != name) {
        setCurrentMicroFrontend(name);
        // initMicroFrontend();
      }
      return;
    }
  }
  setCurrentMicroFrontend("Browse");
  // initMicroFrontend();
}
