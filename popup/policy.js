document.getElementById('accept-consent').addEventListener('click', () => {
    browser.storage.local.set({ consentGiven: true, version: browser.runtime.getManifest().version });
    window.close();
});

document.getElementById('reject-consent').addEventListener('click', () => {
    browser.management.uninstallSelf();
});
