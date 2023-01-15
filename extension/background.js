'use strict';

chrome.alarms.onAlarm.addListener(({ name }) => {
  // const audio = new Audio('./sounds/src_tones_ping1.mp3');
  // audio.play();

  if (name === 'focus') {
    let url = chrome.runtime.getURL('popup.html');
    chrome.storage.local.set({ status: 'focusing' });
    chrome.storage.local.set({ type: 'finish' });
    url += '?volume=0.8&src=./sounds/src_tones_ping1.mp3&length=7000&icon=yellow&text=Time+to+rest';

    chrome.windows.create({
      type: 'popup',
      focused: true,
      top: 300,
      left: 300,
      height: 100,
      width: 300,
      url,
    });
  }

  if (name === 'rest') {
    let url = chrome.runtime.getURL('popup.html');
    chrome.storage.local.set({ status: 'resting' });
    chrome.storage.local.set({ type: 'finish' });

    url += '?volume=0.8&src=./sounds/src_tones_ping1.mp3&length=7000&icon=green&text=Time+to+focus';

    chrome.windows.create({
      type: 'popup',
      focused: true,
      top: 300,
      left: 300,
      height: 100,
      width: 300,
      url,
    });
  }

});

chrome.runtime.onMessage.addListener((request) => {
  console.log(request);

  // if (request.stop) {
  //   audio.pause();
  // }
})
// chrome.notifications.onButtonClicked.addListener(async () => {
//   const item = await chrome.storage.sync.get(['minutes']);

//   chrome.action.setBadgeText({ text: 'ON' });
//   chrome.alarms.create({ delayInMinutes: item.minutes });
// });