(async () => {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    const blockSite = async () => {
        let blockedHtml = await fetch(await chrome.runtime.getURL('content_scripts/assets/html/blocked.html'));
        blockedHtml = await blockedHtml.text();
        blockedHtml = blockedHtml.replace('LOGO_IMG_PATH', await chrome.runtime.getURL('popup/assets/img/logo.png'));

        document.open();
        document.write(blockedHtml);
        document.close();

        // Give it a delay to load the logo image
        setTimeout(() => window.stop(), 500);
    }

    await blockSite();
})();
