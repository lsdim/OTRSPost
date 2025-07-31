document.getElementById('accept-consent').addEventListener('click', function () {
    browser.storage.local.set({ consentGiven: true }).then(() => {
        window.close();
    });
});

document.getElementById('reject-consent').addEventListener('click', function () {
    browser.storage.local.set({ consentGiven: false }).then(() => {
        window.close();
    });
});
