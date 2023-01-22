async function loadScript() {
  const langTranslations = {
    "en": {
      "This page is blocked in Time to Focus, please, come back later or check your black/white list": "This page is blocked in Time to Focus, please, come back later or check your black/white list"
    },
    "es": {
      "This page is blocked in Time to Focus, please, come back later or check your black/white list": "Esta página está bloqueada en el Tiempo de Concentrarse, por favor, vuelve más tarde o revise tu lista blanca/negra"
    },
    "fr": {
      "This page is blocked in Time to Focus, please, come back later or check your black/white list": "Cette page est bloquée dans Le temps de se Concentrer, merci de revenir plus tard ou de vérifier votre liste noire/blanche"
    },
    "de": {
      "This page is blocked in Time to Focus, please, come back later or check your black/white list": "Diese Seite ist in Zeit, sich zu konzentrieren blockiert, bitte kommen Sie später wieder oder überprüfen Sie Ihre schwarze/weiße Liste"
    }
  };

  const popup = document.querySelector('#focus-your-mind-block');
  if (popup) return;

  const { language = 'en' } = await chrome.storage.sync.get(null);

  const content = `
    <div id="focus-your-mind-block" style="width: 100vw; height: 100vh; z-index: 9999; position: fixed; top: 0; display: flex; align-items: center; justify-content: center; background: linear-gradient(to right, rgb(50 19 59 / 96%), rgb(23 1 56 / 95%));">
      <h1 style="font-family: monospace!important;color: #fff!important;font-size: 25px!important;text-transform: uppercase!important;line-height: 1.5!important;font-weight: 100!important;letter-spacing: 0.4rem!important;text-align: center!important;padding: 0 10vw;max-width: 110rem">${langTranslations[language]['This page is blocked in Time to Focus, please, come back later or check your black/white list']}</h1>
    </div>
  `
  const html = document.querySelector('html');
  document.body.insertAdjacentHTML('beforeend', content);

  html.style.overflow = 'hidden';
}
loadScript();