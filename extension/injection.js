function loadScript() {
  const popup = document.querySelector('#focus-your-mind-block');
  if (popup) return;

  const content = `
    <div id="focus-your-mind-block" style="width: 100vw; height: 100vh; z-index: 9999; position: fixed; top: 0; display: flex; align-items: center; justify-content: center; background: linear-gradient(to right, rgb(50 19 59 / 96%), rgb(23 1 56 / 95%));">
      <h1 style="font-family: monospace!important;color: #fff!important;font-size: 30px!important;text-transform: uppercase!important;line-height: 1.5!important;font-weight: 100!important;letter-spacing: 0.4rem!important;text-align: center!important;padding: 0 10vw;max-width: 110rem">This page is blocked in Focus mode, please, come back later or check your black/white list</h1>
    </div>
  `
  const html = document.querySelector('html');
  document.body.insertAdjacentHTML('beforeend', content);

  html.style.overflow = 'hidden';
}
loadScript();