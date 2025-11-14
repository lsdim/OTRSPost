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


const targetUrlPattern = "http://help.ukrposhta.loc/otrs/index.pl?Action=AgentDashboard";
// Функція, яка перезавантажує вкладку з невеликою затримкою
function reloadTab(tabId) {
    console.log(`Помилка завантаження. Перезавантажую вкладку ${tabId}...`);
    // Невелика затримка, щоб уникнути нескінченного циклу миттєвих перезавантажень
    setTimeout(() => {
        browser.tabs.reload(tabId);
    }, 5000); 
}

// Прослуховуємо подію onCompleted від webRequest API
// Фільтруємо лише основні запити (main_frame), щоб не перезавантажувати сторінку через помилку зображення чи скрипта
browser.webRequest.onCompleted.addListener(
    (details) => {
        // Перевіряємо статус HTTP. Статуси 4xx і 5xx часто означають помилку на стороні сервера або клієнта.
        // Також перевіряємо, чи це основний запит сторінки.
		//console.log('details.type', details.type);
        if (details.type === "main_frame" && details.statusCode >= 400) {
            console.error(`Помилка HTTP ${details.statusCode} для URL: ${details.url}`);
            reloadTab(details.tabId);
        }
    },
    { urls: [targetUrlPattern] }
);

browser.webRequest.onErrorOccurred.addListener(
    (details) => {
		//console.log('details.type onErrorOccurred', details.type);
        if (details.type === "main_frame") {
            console.error(`Мережева помилка: ${details.error} для URL: ${details.url}`);
            reloadTab(details.tabId);
        }
    },
    { urls: [targetUrlPattern] } // <-- Використовуємо конкретний URL або ["<all_urls>"]
);