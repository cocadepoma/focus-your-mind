'use strict';

chrome.alarms.onAlarm.addListener(async ({ name }) => {
  if (name === 'focus') {
    let url = chrome.runtime.getURL('popup.html');
    chrome.storage.local.set({ status: 'focusing' });
    chrome.storage.local.set({ type: 'finish' });

    chrome.tabs.create({
      active: true,
      url,
    });
  }

  if (name === 'rest') {
    let url = chrome.runtime.getURL('popup.html');
    chrome.storage.local.set({ status: 'resting' });
    chrome.storage.local.set({ type: 'finish' });

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

  try {
    const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const url = new URL(activeTab.url).host;

    if (type === 'pending' && status === 'focusing') {
      const isBlackListed = blacklist.some(u => url.includes(u));
      const isWhiteListed = whitelist.some(u => url.includes(u));

      if ((isBlackListed && isBlackListEnabled) || (isWhiteListEnabled && !isWhiteListed && whitelist.length > 0)) {
        if (activeTab.url.includes('chrome-extension://') || activeTab.url.includes('chrome://')) return;

        await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ['./injection.js'],
        });
      } else {
        cleanScript(activeTab.id, activeTab.url);
      }
    } else {
      cleanScript(activeTab.id, activeTab.url);
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
        if (url.includes('chrome-extension://') || url.includes('chrome://')) return;

        await chrome.scripting.executeScript({
          target: { tabId },
          files: ['./injection.js'],
        });
      } else {
        cleanScript(tabId, url);
      }
    } else {
      cleanScript(tabId, url);
    }
  } catch (error) {
    console.warn(error);
  }
});

const cleanScript = async (tabId, url) => {
  if (url.includes('chrome-extension://') || url.includes('chrome://')) return;

  await chrome.scripting.executeScript({
    target: { tabId },
    files: ['./clean-injection.js'],
  });
};