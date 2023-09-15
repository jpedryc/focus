// ERRORS
const ERROR_NO_TIME = 'No blocking time selected';
const ERROR_NO_DOMAIN = 'No domain was given';
const ERROR_NOT_DOMAIN = 'Not a valid domain name';

// CONSTANTS
const PREDEFINED_DOMAINS = {
    youtube: 'youtube.com',
    facebook: 'facebook.com',
    twitter: 'twitter.com',
    reddit: 'reddit.com',
    ninegag: '9gag.com',
    amazon: 'amazon.com',
    instagram: 'instagram.com',
    tiktok: 'tiktok.com',
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

        if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(customDomain.value)) {
            showError(ERROR_NOT_DOMAIN);
            return;
        }

        domain = customDomain.value;
    } else {
        // --- ADD NEW PREDEFINED RULE
        domain = PREDEFINED_DOMAINS[predefinedSelect.value];
    }

    await addOrUpdateRule(domain, timeInput.value);
    customDomain.value = '';
    await refreshRulesTable();
    await chrome.runtime.sendMessage({action: 'ruleAdded'});
});
