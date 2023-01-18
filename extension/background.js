'use strict';

const notAllowedUrls = ['youtube', 'twitter', 'facebook', 'instagram', 'stack', 'deveser'];

chrome.alarms.onAlarm.addListener(({ name }) => {

  if (name === 'focus') {
    let url = chrome.runtime.getURL('popup.html');
    chrome.storage.local.set({ status: 'focusing' });
    chrome.storage.local.set({ type: 'finish' });
    url += '?volume=0.8&src=./sounds/src_tones_ping1.mp3&length=10000&icon=yellow&text=Time+to+rest';

    chrome.tabs.create({
      active: true,
      url,
    });
  }

  if (name === 'rest') {
    let url = chrome.runtime.getURL('popup.html');
    chrome.storage.local.set({ status: 'resting' });
    chrome.storage.local.set({ type: 'finish' });

    url += '?volume=0.8&src=./sounds/src_tones_ping1.mp3&length=10000&icon=green&text=Time+to+focus';

    chrome.tabs.create({
      active: true,
      url,
    });
  }

});


chrome.tabs.onActivated.addListener(async (event) => {
  const { type, status } = await chrome.storage.local.get(null);

  if (type === 'pending' && status === 'focusing') {
    const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

    if (notAllowedUrls.some(u => activeTab.url.includes(u))) {

      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ['./injection.js'],
      });
    }
  }
})

chrome.tabs.onUpdated.addListener(async (tabId, { status }, { url }) => {
  const { type, status: taskStatus } = await chrome.storage.local.get(null);

  if (type === 'pending' && taskStatus === 'focusing') {
    if (status === 'complete' && notAllowedUrls.some(u => url.includes(u))) {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['./injection.js'],
      });
    }
  }
});