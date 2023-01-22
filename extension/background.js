'use strict';

chrome.alarms.onAlarm.addListener(async ({ name }) => {
  const { sound = 'ping1' } = await chrome.storage.sync.get(null);

  if (name === 'focus') {
    let url = chrome.runtime.getURL('popup.html');
    chrome.storage.local.set({ status: 'focusing' });
    chrome.storage.local.set({ type: 'finish' });
    url += `?volume=1&src=./assets/sound_${sound}.mp3&length=10000&icon=yellow`;

    chrome.tabs.create({
      active: true,
      url,
    });
  }

  if (name === 'rest') {
    let url = chrome.runtime.getURL('popup.html');
    chrome.storage.local.set({ status: 'resting' });
    chrome.storage.local.set({ type: 'finish' });

    url += `?volume=1&src=./assets/sound_${sound}.mp3&length=10000&icon=purple`;

    chrome.tabs.create({
      active: true,
      url,
    });
  }
});


chrome.tabs.onActivated.addListener(async (event) => {
  const { type, status } = await chrome.storage.local.get(null);

  const {
    isWhiteListEnabled = false,
    whitelist = [],
    isBlackListEnabled = false,
    blacklist = [],
  } = await chrome.storage.sync.get(null);

  const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const url = new URL(activeTab.url).host;

  try {
    if (type === 'pending' && status === 'focusing') {
      const isBlackListed = blacklist.some(u => url.includes(u));
      const isWhiteListed = whitelist.some(u => url.includes(u));

      if ((isBlackListed && isBlackListEnabled) || (isWhiteListEnabled && !isWhiteListed && whitelist.length > 0)) {
        await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ['./injection.js'],
        });
      } else {
        cleanScript(activeTab.id);
      }
    } else {
      cleanScript(activeTab.id);
    }
  } catch (error) {
    console.warn(error);
  }
})

chrome.tabs.onUpdated.addListener(async (tabId, { status }, { url }) => {
  try {
    const { type, status: taskStatus } = await chrome.storage.local.get(null);
    const parsedUrl = new URL(url).host;

    const {
      isWhiteListEnabled = false,
      whitelist = [],
      isBlackListEnabled = false,
      blacklist = [],
    } = await chrome.storage.sync.get(null);

    const isBlackListed = blacklist.some(u => parsedUrl.includes(u));
    const isWhiteListed = whitelist.some(u => parsedUrl.includes(u));

    if (type === 'pending' && taskStatus === 'focusing' && status === 'complete') {
      if ((isBlackListed && isBlackListEnabled) || (isWhiteListEnabled && !isWhiteListed && whitelist.length > 0)) {
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ['./injection.js'],
        });
      } else {
        cleanScript(tabId);
      }
    } else {
      cleanScript(tabId);
    }
  } catch (error) {
    console.warn(error);
  }
});

const cleanScript = async (tabId) => {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ['./clean-injection.js'],
  });
};