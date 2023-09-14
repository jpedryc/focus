const STORAGE_RULES_ITEMS = 'ruleItems';

const initStorage = async () => {
    const storageRuleItems = await chrome.storage.local.get(STORAGE_RULES_ITEMS);

    if (Object.keys(storageRuleItems).length === 0) {
        await chrome.storage.local.set({ ruleItems: [] });
    }
}

/**
 * Adds/Updates a rule item to extension storage
 *
 * @param domain Domain name which should be blocked
 * @param time Time (in seconds) of daily blocking time
 * @returns {Promise<void>}
 */
const addOrUpdateRule = async (domain, time) => {
    let ruleItemsObj = await chrome.storage.local.get(STORAGE_RULES_ITEMS);

    if (!('ruleItems' in ruleItemsObj)) {
        await initStorage();
        ruleItemsObj = await chrome.storage.local.get(STORAGE_RULES_ITEMS);
    }

    const existingItemId = ruleItemsObj.ruleItems.findIndex(item => item.domain === domain);

    // Apply changes depending on if domain rule already exists
    if (existingItemId === -1) {
        ruleItemsObj.ruleItems.push({domain, time, timeInit: time, lastChange: Date.now()});
    } else {
        ruleItemsObj.ruleItems[existingItemId].time = time;
        ruleItemsObj.ruleItems[existingItemId].lastChange = Date.now();
    }

    await chrome.storage.local.set({
        ruleItems: ruleItemsObj.ruleItems,
    });
};