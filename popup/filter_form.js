document.querySelectorAll('.menu a').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});


const filtersTable = document.getElementById('filtersTable');
const filterStr = document.getElementById("filterStr");
const filterForm = document.getElementById('filterForm');

/*let apiKey = '';
let DBUrl = '';
let AuthUrl = '';
let botInfo = {};
let user = {};
*/

let filtersList = [];

 getData('filtersList').then(value => {
		filtersList = value ? [...value] : [];		
		filtersList.forEach(filterStr => addRow(filterStr));
 });
 
 
filterForm.addEventListener("submit", async(e) => {
  e.preventDefault();  

  if (filterStr.value == "") {
    alert("Заповніть поле!");
  } else {
	  
	  filtersList.push(filterStr.value);
	  await setData('filtersList', filtersList);
	  addRow(filterStr.value);	 

	  filterForm.reset();

  }
  
  console.log('submit');

}); 

let buttons = document.querySelectorAll("table button");
filtersTable.addEventListener('click', async (e) => {
	if (e.target.nodeName === 'BUTTON' && e.target.name === 'remove') {				
		filtersList.splice(filtersList.indexOf(e.target.closest('tr').cells[0].innerHTML),1);
		await setData('filtersList', filtersList);
		e.target.closest('tr').remove();
	}
});		  
 

function addRow(filterStr){
	
		const row = filtersTable.insertRow(0);

		const cell1 = row.insertCell(0);
		const cell2 = row.insertCell(1);

		cell1.textContent = filterStr;
		cell2.innerHTML = '<button type="button" name="remove">Видалити</button>'; 
	
}



/*getData('apiKey').then(key => {
        if (key) {
            apiKey = key;
			showCustomAlert('Завантаження, зачекайте...', 'warning');
			
			
			getData('user').then(value => {
				if (value) {
					user = { ...value };
				}
				
				if (user.username) {
					DBUrl = `https://otrs-patterns-default-rtdb.europe-west1.firebasedatabase.app/info/${user.username}/TelegramBot.json`;
					AuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
					getBotInfo(); // Now we can get bot info
				} else {
					showCustomAlert('Не вказано логін або пароль', 'error');
				}	
			});	
            
        } else {
            console.error('Firebase API Key is not set in the extension options.');
			showCustomAlert('Не вказано Firebase API Key в налаштуваннях розширення!', 'error');           
        }
});*/
	
/*	
telegramForm.addEventListener("submit", async (e) => {
        e.preventDefault();
		
		
        if (botToken.value == "" || chatId.value == "") { 
            alert("Заповніть всі поля!");
        } else {
			
			//const user = await getData('user');
			if (user.username) {
				await syncUserSettings({TelegramBot: { BOT_TOKEN: botToken.value, prod_chat: chatId.value }}, user.username);
				alert("Збережено!");				
			} else {
				showCustomAlert('Не вказано облікові дані', 'error');
			}
        }
});
*/
/*
async function getBotInfo() {
        getBotInfoFromDB(DBUrl).then(data => {
            if (data) {
                botInfo = { ...data };
                botInfo.CHAT_ID = botInfo.prod_chat;	 //botInfo.dev_chat or botInfo.prod_chat based on your environment
				botToken.value = botInfo.BOT_TOKEN;
				chatId.value = botInfo.CHAT_ID
				showCustomAlert('Налаштування Телеграм отримано', 'saccess');
            } else {
				showCustomAlert('Відсутні налаштування Телеграм', 'error');
                console.error('Failed to load bot info');
            }
        }).catch(error => {
			showCustomAlert('Не вдалось отримати налаштування Телеграм', 'error');
            console.error('Error get bot info:', error);
        });
    }

async function getBotInfoFromDB(url) {
        try {
            const token = await getToken();
            if (!token.idToken) {
				showCustomAlert('Не вдалося отримати дані. Перевірте логін і пароль.', 'error');               
                return;
            }
            url = url + `?auth=${token.idToken}`;
            const responseID = await fetch(url);
            if (!responseID.ok) {
                throw new Error('Network response was not ok for the first fetch');
            }

            const json = await responseID.json();
            return json;

        } catch (error) {
			showCustomAlert(`Помилка: ${error}`, 'error');
            console.error('There has been a problem with your fetch operation:', error);
        }
}
*/
/*
async function getToken() {

        let token = {};
        await getData('token').then(value => {
            token = value ? { ...value } : {};
        });

        if (token.expiresIn) {
            const dateExp = new Date(token.expiresIn);
            if (new Date() > dateExp) {
                console.log('Token expired');
                token = await loginDB();
            } else {
            }
        }
        else {
            token = await loginDB();
        }

        return token;
}

async function loginDB() {
        let user = {};
        await getData('user').then(value => {
            if (value) {
                user = { ...value };
            }
        });

        if (!user.username || !user.password) {
			showCustomAlert('Не вказано логін або пароль', 'error');
            return {};
        }

        const data = {
            email: `${user.username}@ukrposhta.ua`,
            password: user.password,
            returnSecureToken: true
        };

        let loginData = {};
        await runPost(AuthUrl, data).then(response => {
            loginData = { ...response };
        });

        if (loginData.error) {
			showCustomAlert('Помилка при авторизації: ' + loginData.error.message, 'error');
            console.error('Помилка при авторизації', loginData.error.message);
            return {};
        }

        const dateExp = new Date(new Date().getTime() + +loginData.expiresIn * 1000);
        const token = {
            idToken: loginData.idToken,
            expiresIn: dateExp.toString()
        };
        await setData('token', token);

        return token;

}

async function runPost(url, data) {

        try {
            const responseID = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify(data)
            });
            if (!responseID.ok) {
                console.log('responseID', responseID);
            }

            const json = await responseID.json();
            return json;

        } catch (error) {
            console.error('There has been a problem:', error);
        }
}
	
*/
	



/*
async function syncUserSettings(settings, userName) {
    const UserSettingsUrl = `https://otrs-patterns-default-rtdb.europe-west1.firebasedatabase.app/info/${userName}.json`;

    try {
        const authToken = await getToken();
        if (!authToken.idToken) {
            throw new Error("Authentication failed");
        }

        const response = await fetch(UserSettingsUrl + `?auth=${authToken.idToken}`, {
            method: 'PATCH', // Use PATCH to update without overwriting other data
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });

        if (!response.ok) {
            throw new Error('Failed to sync user settings to Firebase');
        }

    } catch (error) {
        console.error('Error syncing user settings:', error);
        alert(`Помилка синхронізації: ${error.message}`);
    }
}
*/

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

function showCustomAlert(messageText, messageType) {
	  const alertContainer = document.createElement('div');
	  alertContainer.classList.add('custom-alert');
	  alertContainer.textContent = messageText;
	  switch(messageType){
		  case 'warning': alertContainer.classList.add('warning-alert');
			break;
		  case 'error': alertContainer.classList.add('error-alert');
			break;
		  case 'saccess': alertContainer.classList.add('saccess-alert');
			break;
		default: alertContainer.classList.add('warning-alert');
	  }
	  
	  const closeButton = document.createElement('span');
	  closeButton.classList.add('custom-alert-close');
	  closeButton.textContent = '×';
	  closeButton.onclick = function() {
		alertContainer.remove();
	  };

	  alertContainer.appendChild(closeButton);
	  document.body.appendChild(alertContainer); 

	 
	  setTimeout(() => {
		if (alertContainer.parentNode) {
		  alertContainer.remove();
		}
	  }, 5000);
	}
	
