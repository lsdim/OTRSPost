browser.runtime.onInstalled.addListener(async (details) => {
    const { previousVersion, reason } = details;
    const { version } = browser.runtime.getManifest();

    if (reason === 'install') {
        browser.tabs.create({ url: 'popup/policy.html' });
    } else if (reason === 'update') {
        const { consentGiven, version: storedVersion } = await browser.storage.local.get(['consentGiven', 'version']);
        if (!consentGiven || storedVersion !== version) {
            browser.tabs.create({ url: 'popup/policy.html' });
        }
    }
});