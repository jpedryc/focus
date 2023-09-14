const getCurrentTab = async () => {
    let  [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true});
    return tab;
}

const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
}

const restartTimeCounterForRule = async (ruleItemsObj, existingItemId) => {
    console.log(ruleItemsObj, existingItemId);
    ruleItemsObj.ruleItems[existingItemId].time = ruleItemsObj.ruleItems[existingItemId].timeInit;
    ruleItemsObj.ruleItems[existingItemId].lastChange = Date.now();

    await chrome.storage.local.set({
        ruleItems: ruleItemsObj.ruleItems,
    });
}

/*
 Restart alarm for the currently active tab, whenever the user navigates.
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log('chrome.tabs.onUpdated');
    if (!changeInfo.url) {
        return;
    }

    const currentTab = await getCurrentTab();
    if (tabId === currentTab.id) {
        restartAlarm(tabId);
    }
    // gettingActiveTab.then((tabs) => {
    //     if (tabId === tabs[0].id) {
    //         restartAlarm(tabId);
    //     }
    // });
});

/*
 Restart alarm for the currently active tab, whenever a new tab becomes active.
 */
chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log('chrome.tabs.onActivated');
    restartAlarm(activeInfo.tabId);
});

/*
 restartAlarm: clear all alarms,
 then set a new alarm for the given tab.
 */
const restartAlarm = async (tabId) => {
    // chrome.pageAction.hide(tabId);
    await chrome.alarms.clearAll();
    const tab = await chrome.tabs.get(tabId);
    let ruleItemsObj = await chrome.storage.local.get('ruleItems');

    if (!('ruleItems' in ruleItemsObj) || tab === undefined) {
        console.log('no ruleItems or tab not found');
        return;
    }

    let domain = (new URL(tab.url));
    domain = domain.hostname.replace('www.', '');

    console.log(domain);
    const isUrl = ruleItemsObj.ruleItems.filter((item) => item.domain === domain).length > 0;

    console.log(isUrl);
    if (!isUrl) {

        return;
    }

    const existingItemId = ruleItemsObj.ruleItems.findIndex(item => item.domain === domain);

    if (!isToday(new Date(ruleItemsObj.ruleItems[existingItemId].lastChange))) {
        await restartTimeCounterForRule(ruleItemsObj, existingItemId);
        ruleItemsObj = await chrome.storage.local.get('ruleItems');
    }

    if (ruleItemsObj.ruleItems[existingItemId].time > 0) {
        chrome.alarms.create("", {when: Date.now()});
    } else {
        console.log('blockings website 1');
        // Block website
        chrome.scripting.executeScript({
            target: {tabId},
            files: ['content_scripts/blocker.js']
        });
        // chrome.tabs.executeScript({
        //     file: 'content_scripts/blocker.js',
        // });
    }
    // gettingTab.then(async (tab) => {
    //     let ruleItemsObj = await chrome.storage.local.get('ruleItems');
    //
    //     if (!('ruleItems' in ruleItemsObj)) {
    //         return;
    //     }
    //
    //     let domain = (new URL(tab.url));
    //     domain = domain.hostname.replace('www.', '');
    //
    //     const isUrl = ruleItemsObj.ruleItems.filter((item) => item.domain === domain).length > 0;
    //
    //     if (!isUrl) {
    //
    //         return;
    //     }
    //
    //     const existingItemId = ruleItemsObj.ruleItems.findIndex(item => item.domain === domain);
    //
    //     if (!isToday(new Date(ruleItemsObj.ruleItems[existingItemId].lastChange))) {
    //         await restartTimeCounterForRule(ruleItemsObj);
    //         ruleItemsObj = await chrome.storage.local.get('ruleItems');
    //     }
    //
    //     if (ruleItemsObj.ruleItems[existingItemId].time > 0) {
    //         chrome.alarms.create("", {when: Date.now()});
    //     } else {
    //         // Block website
    //         chrome.tabs.executeScript({
    //             file: 'content_scripts/blocker.js',
    //         });
    //     }
    // });
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === 'ruleAdded' || request.action === 'ruleRemoved') {
        const tab = await getCurrentTab();
        await restartAlarm(tab.id);
        await chrome.tabs.reload(tab.id);
    }
});

/*
 Restart alarm for the currently active tab, whenever background.js is run.
 */
(async () => {
    let currentTab = await getCurrentTab();
    restartAlarm(currentTab.id);
    console.log('Restarting alarm on current tab');
})();
// gettingActiveTab.then((tabs) => {
//     restartAlarm(tabs[0].id);
// });

chrome.webNavigation.onCommitted.addListener(async (details) => {
    if (["reload", "link", "typed", "generated"].includes(details.transitionType)) {

        const currentTab = await getCurrentTab();
        await restartAlarm(currentTab.id);
    }
});

/*
 On alarm, show the page action.
 */
chrome.alarms.onAlarm.addListener(async (alarm) => {
    const currentTab = await getCurrentTab();

    if (currentTab === undefined) {
        return;
    }

    let domain = (new URL(currentTab.url));
    domain = domain.hostname.replace('www.', '');

    let ruleItemsObj = await chrome.storage.local.get('ruleItems');

    if (!('ruleItems' in ruleItemsObj)) {
        return;
    }

    const existingItemId = ruleItemsObj.ruleItems.findIndex(item => item.domain === domain);

    if (existingItemId === -1) {
        return;
    }

    if (ruleItemsObj.ruleItems[existingItemId].time > 0) {
        ruleItemsObj.ruleItems[existingItemId].time -= 1;

        await chrome.storage.local.set({
            ruleItems: ruleItemsObj.ruleItems,
        });
    }

    // chrome.pageAction.show(tabs[0].id);
    if (ruleItemsObj.ruleItems[existingItemId].time > 0) {
        let now = new Date();
        now.setSeconds(now.getSeconds() + 1);
        chrome.alarms.create("", {when: now.getTime()});
    } else {
        console.log('blockings website 1');
        chrome.scripting.executeScript({
            target: {tabId: currentTab.id},
            files: ['content_scripts/blocker.js']
        });
        // chrome.tabs.executeScript({
        //     file: 'content_scripts/blocker.js',
        // });
    }

    // gettingActiveTab.then(async (tabs) => {
    //
    //     let domain = (new URL(tabs[0].url));
    //     domain = domain.hostname.replace('www.', '');
    //
    //     let ruleItemsObj = await chrome.storage.local.get('ruleItems');
    //
    //     if (!('ruleItems' in ruleItemsObj)) {
    //         return;
    //     }
    //
    //     const existingItemId = ruleItemsObj.ruleItems.findIndex(item => item.domain === domain);
    //
    //     if (existingItemId === -1) {
    //         return;
    //     }
    //
    //     if (ruleItemsObj.ruleItems[existingItemId].time > 0) {
    //         ruleItemsObj.ruleItems[existingItemId].time -= 1;
    //
    //         await chrome.storage.local.set({
    //             ruleItems: ruleItemsObj.ruleItems,
    //         });
    //     }
    //
    //     // chrome.pageAction.show(tabs[0].id);
    //     if (ruleItemsObj.ruleItems[existingItemId].time > 0) {
    //         setTimeout(() => {
    //             chrome.alarms.create("", {when: Date.now()});
    //         }, 1000);
    //     } else {
    //         chrome.tabs.executeScript({
    //             file: 'content_scripts/blocker.js',
    //         });
    //     }
    // });
});