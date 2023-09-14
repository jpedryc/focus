// ERRORS
const ERROR_NO_TIME = 'No blocking time selected';
const ERROR_NO_DOMAIN = 'No domain was given';

// CONSTANTS
const predefinedRules = {
    youtube: 'youtube.com',
    facebook: 'facebook.com',
    twitter: 'twitter.com',
    reddit: 'reddit.com',
    ninegag: '9gag.com',
}

const timeInput = document.getElementById('time');
const addRuleBtn = document.getElementById('add-rule-btn');
const predefinedSelect = document.getElementById('predefined-select');
const customDomain = document.getElementById('custom-domain');

/**
 * Handles the creation of a new rule
 */
addRuleBtn.addEventListener('click', async () => {
    hideError();

    // Check time input
    if (timeInput.value === undefined || timeInput.value === '') {
        showError(ERROR_NO_TIME);
        return;
    }

    let domain;

    if (!predefinedRulesTab.classList.contains('active')) {
        // --- ADD NEW CUSTOM RULE
        // Check domain
        if (customDomain.value === undefined || customDomain.value === '') {
            showError(ERROR_NO_DOMAIN);
            return;
        }

        domain = customDomain.value;
    } else {
        // --- ADD NEW PREDEFINED RULE
        domain = predefinedRules[predefinedSelect.value];
    }

    await addOrUpdateRule(domain, timeInput.value);
    customDomain.value = '';
    await refreshRulesTable();
    await chrome.runtime.sendMessage({action: 'ruleAdded'});
});
