

onload = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const body = document.querySelector('body');
  body.style.backgroundColor = urlParams.get('icon') || 'green';

  const h1 = document.querySelector('h1');
  h1.textContent = urlParams.get('text');

  const audioAlarm = new Audio(urlParams.get('src'));
  audioAlarm.volume = urlParams.get('volume');
  await audioAlarm.play();

  setBadgeIconByColor(urlParams.get('icon'));

  setTimeout(close, urlParams.get('length'));
};

const setBadgeIconByColor = (color) => {
  chrome.action.setIcon({
    path: {
      "16": `./icons/${color}/16-${color}.png`,
      "32": `./icons/${color}/32-${color}.png`,
      "48": `./icons/${color}/48-${color}.png`,
      "128": `./icons/${color}/128-${color}.png`,
    }
  });
};
