
browser.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        browser.tabs.create({
            url: "popup/policy.html"
        });
    }
});
