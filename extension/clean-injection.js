function loadScript() {
  const popup = document.querySelector('#focus-your-mind-block');
  console.log({ popup })
  if (!popup) return;

  popup.remove();
}
loadScript();