document.querySelectorAll('.menu a').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const consentScreen = document.getElementById('consent-screen');
    const loginPage = document.querySelector('.login-page');
    const acceptButton = document.getElementById('accept-consent');
    const rejectButton = document.getElementById('reject-consent');

    browser.storage.local.get('consentGiven').then(result => {
        if (result.consentGiven === true) {
            showLoginPage();
        } else {
            showConsentScreen();
        }
    });

    acceptButton.addEventListener('click', () => {
        browser.storage.local.set({ consentGiven: true }).then(() => {
            showLoginPage();
            browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
                if (tabs[0] && tabs[0].id) {
                    browser.tabs.reload(tabs[0].id);
                }
            });
        });
    });

    rejectButton.addEventListener('click', () => { window.close(); });

    function showConsentScreen() {
        consentScreen.style.display = 'block';
        if(loginPage) loginPage.style.display = 'none';
    }

    function showLoginPage() {
        consentScreen.style.display = 'none';
        if(loginPage) loginPage.style.display = 'block';
        initializeLoginForm();
    }
});

function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const apiKey = document.getElementById("apiKey"); // Added apiKey
    const timeCheck = document.getElementById("timeCheck");
	const filterSrt = document.getElementById("filterSrt");

    if (!loginForm) return;

    let user = {};
	let filtersList = [];

    getData('timeCheck').then(value => { if (value) { timeCheck.value = value; } });
    getData('apiKey').then(value => { if (value) { apiKey.value = value; } }); // Added apiKey

    getData('user').then(value => {
        if (value) {
            user = { ...value };
            username.value = user.username;
            password.value = user.password;
        }
    });
	
	getData('filtersList').then(value => {
		filtersList = value ? [...value] : [];		
		fillFilterList(filtersList);
		getData('filterTicket').then(value => {
			filterSrt.value = value;
		})
	});

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (username.value == "" || password.value == "" || apiKey.value == "") { // Added apiKey check
            alert("Заповніть всі поля!");
        } else {
            user.username = username.value;
            user.password = password.value;
            setData('user', user);
            setData('apiKey', apiKey.value); // Added apiKey save
            setData('timeCheck', timeCheck.value);
			setData('filterTicket', filterSrt.value);
            alert("Збережено!");
        }
    });
}

function fillFilterList(filterList) {
	const filterSrt = document.getElementById("filterSrt");
	for (const filterStr of filterList) {
		let opt = document.createElement('option');
		opt.value = filterStr;
		opt.innerHTML = filterStr;
		filterSrt.appendChild(opt);
	}
}

async function setData(key, value) {
    try {
        await browser.storage.local.set({ [key]: value });
    } catch (error) {
        console.error('Error setting data to storage:', error);
    }
}

async function getData(key) {
    try {
        const gettingItem = await browser.storage.local.get(key);
        return gettingItem[key];
    } catch (error) {
        console.error('Error getting data from storage:', error);
        return null;
    }
}
