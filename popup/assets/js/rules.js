const rulesTableBody = document.getElementById('rules-table-body');

/**
 * Translates seconds into human readable format of seconds, minutes, hours, days, and years
 *
 * @param  {number} seconds The number of seconds to be processed
 * @return {string}         The phrase describing the amount of time
 */
function forHumans ( seconds ) {
    let levels = [
        [Math.floor(seconds / 31536000), 'years'],
        [Math.floor((seconds % 31536000) / 86400), 'days'],
        [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
        [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
        [(((seconds % 31536000) % 86400) % 3600) % 60, 'seconds'],
    ];
    let returntext = '';

    for (let i = 0, max = levels.length; i < max; i++) {
        if ( levels[i][0] === 0 ) continue;
        returntext += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length-1): levels[i][1]);
    }

    returntext = returntext.trim();

    return returntext === '' ? 'None' : returntext;
}

const refreshRulesTable = async () => {
    // rulesTableBody.innerHTML = '';

    let ruleItemsObj = await chrome.storage.local.get(STORAGE_RULES_ITEMS);

    if (ruleItemsObj.ruleItems === undefined
        || ruleItemsObj.ruleItems === []
        || Object.keys(ruleItemsObj).length === 0
        || ruleItemsObj.ruleItems === null
        || ruleItemsObj.ruleItems.length === 0
    ) {
        rulesTableBody.innerHTML = '<tr><td colspan="3"><strong style="color:#dbdbdb;">No entries yet</strong></td></tr>';

        return;
    }

    let rulesHtml = '';
    ruleItemsObj.ruleItems.forEach(function (item) {
        rulesHtml += '<tr>';
        rulesHtml += '<td>';
        rulesHtml += item.domain;
        rulesHtml += '</td>';
        rulesHtml += '<td>';
        rulesHtml += new Date(item.time * 1000).toLocaleTimeString('en-GB', {
            timeZone:'Etc/UTC',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        rulesHtml += '</td>';
        rulesHtml += '<td>';
        rulesHtml += forHumans(item.timeInit);
        rulesHtml += '</td>';
        rulesHtml += '<td>';
        rulesHtml += `<button type="button" class="clear-rule-btn remove-btn" data-domain="${item.domain}">Remove rule</button>`;
        rulesHtml += '</td>';
        rulesHtml += '</tr>';
    });

    rulesTableBody.innerHTML = rulesHtml;

    const clearRuleBtns = document.getElementsByClassName('clear-rule-btn');

    for (var i = 0; i < clearRuleBtns.length; i++) {
        clearRuleBtns[i].addEventListener(
            'click',
            async (event) => {
                await clearRule(event.target.getAttribute('data-domain'));
            });
    }
}

(async function () {
    await refreshRulesTable()
})();

chrome.storage.local.onChanged.addListener(async () => {
    await refreshRulesTable();
});

const clearRule = async (domain) => {
    let ruleItemsObj = await chrome.storage.local.get('ruleItems');

    if (!('ruleItems' in ruleItemsObj)) {
        return;
    }

    const existingItemId = ruleItemsObj.ruleItems.findIndex(item => item.domain === domain);

    if (existingItemId === -1) {
        return;
    }

    ruleItemsObj.ruleItems.splice(existingItemId, 1);

    await chrome.storage.local.set({
        ruleItems: ruleItemsObj.ruleItems,
    });

    await refreshRulesTable();
    await chrome.runtime.sendMessage({action: 'ruleRemoved', domain});
};
