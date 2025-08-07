browser.runtime.onInstalled.addListener(async (details) => {
    const { previousVersion, reason } = details;
    const { version } = browser.runtime.getManifest();

    if (reason === 'install') {
        browser.tabs.create({ url: 'popup/policy.html' });
    } else if (reason === 'update') {
        const { agreed, version: storedVersion } = await browser.storage.local.get(['accept-consent', 'version']);
        if (!agreed || storedVersion !== version) {
            browser.tabs.create({ url: 'popup/policy.html' });
        }
    }
});