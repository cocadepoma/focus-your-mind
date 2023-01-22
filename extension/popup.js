const lang = {
  "en": {
    "Time to rest": "Time to rest",
    "Time to focus": "Time to focus",
  },
  "es": {
    "Time to rest": "Tiempo de descanso",
    "Time to focus": "Tiempo de concentración",
  },
  "fr": {
    "Time to rest": "Temps de repos",
    "Time to focus": "Le temps de se concentrer",
  },
  "de": {
    "Time to rest": "Zeit zum ausruhen",
    "Time to focus": "Zeit, sich zu konzentrieren",
  }
};

onload = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const badgeColor = urlParams.get('icon');

  const body = document.querySelector('body');
  const img = document.querySelector('img');
  const h1 = document.querySelector('h1');

  const { language = 'en' } = await chrome.storage.sync.get(null);

  if (badgeColor === 'yellow') {
    body.style.background = 'linear-gradient(to right, rgb(50 19 59 / 63%), rgb(23 1 56 / 84%)), url(./img/pattern.png)';
    img.src = './img/robot.gif'
    h1.textContent = lang[language]['Time to rest'];
  } else {
    body.style.background = 'linear-gradient(to right, rgb(179 4 4 / 63%), rgb(208 0 0 / 78%)), url(./img/pattern.png)';
    img.src = './img/robot2.gif';
    h1.textContent = lang[language]['Time to focus'];
  }

  const audioAlarm = new Audio(urlParams.get('src'));
  audioAlarm.volume = urlParams.get('volume');
  audioAlarm.loop = true;
  await audioAlarm.play();

  setBadgeIconByColor(badgeColor);

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
