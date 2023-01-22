onload = async () => {
  const langTranslations = {
    "en": {
      "Time to rest": "Time to rest",
      "Time to focus": "Time to focus",
    },
    "es": {
      "Time to rest": "Tiempo de descanso",
      "Time to focus": "Tiempo de concentrarse",
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

  const body = document.querySelector('body');
  const img = document.querySelector('img');
  const h1 = document.querySelector('h1');

  const { status, type } = await chrome.storage.local.get(null);
  const { language = 'en', sound = 'ping1' } = await chrome.storage.sync.get(null);

  if (status === 'focusing' && type === 'finish') {
    body.style.background = 'linear-gradient(to right, rgb(50 19 59 / 63%), rgb(23 1 56 / 84%)), url(./img/pattern.png)';
    img.src = './img/robot.gif'
    h1.textContent = langTranslations[language]['Time to rest'];
    setBadgeIconByColor('yellow');
  } else {
    body.style.background = 'linear-gradient(to right, rgb(179 4 4 / 63%), rgb(208 0 0 / 78%)), url(./img/pattern.png)';
    img.src = './img/robot2.gif';
    h1.textContent = langTranslations[language]['Time to focus'];
    setBadgeIconByColor('purple');
  }

  const audioAlarm = new Audio(`./assets/sound_${sound}.mp3`);
  audioAlarm.volume = '1';
  audioAlarm.loop = true;
  await audioAlarm.play();

  setTimeout(close, 7000);
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
