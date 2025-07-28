console.log('OTRSPost script loaded. Checking for consent...');

browser.storage.local.get('consentGiven').then(result => {
    if (result.consentGiven === true) {
        console.log('Consent given. Initializing main script.');
        main();
    } else {
        console.log('Consent not given. Script will not run.');
        document.body.style.border = "2px solid red"; // Visual indicator that script is blocked
    }
}).catch(err => {
    console.error('Error checking for consent:', err);
});

function main() {
    console.log('start');

    let user = {};
    let botInfo = {};
    let lastTime = '0000';

    getData('lastTime').then(value => {
        lastTime = value ? value : '0000';
    });

    const apiKey = 'AIzaSyDDQPP3Csks1c6p-gwZPXKHoLec1yQmkAo';
    const DBUrl = 'https://otrs-patterns-default-rtdb.europe-west1.firebasedatabase.app/info/TelegramBot.json';
    const AuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;


    async function getBotInfo() {
        getBotInfoFromDB(DBUrl).then(data => {
            if (data) {
                botInfo = { ...data };
                botInfo.CHAT_ID = botInfo.prod_chat;	 //botInfo.dev_chat or botInfo.prod_chat based on your environment
            } else {
                console.error('Failed to load bot info');
            }
        }).catch(error => {
            console.error('Error fetching bot info:', error);
        });
    }

    getBotInfo();

    document.body.style.border = "2px solid green"; // Green indicates script is running
    let columns = getColumns();

    let timeCheck = 60000;

    async function getTimeCheck() {
        await getData('timeCheck').then(value => {
            if (value) {
                timeCheck = +value * 1000;
            }
        });
    }

    (async function initializeInterval() {
        await getTimeCheck();
        setInterval(() => checkNewTicket(columns), timeCheck);
    })();


    //**************************************
    async function checkNewTicket(columns) {
        const now = new Date();
        const minute = now.getMinutes();
        const hours = now.getHours();

        if (checkDialog()) {
            console.log('checkDialog');
            window.location.reload();
            return;
        }

        if (checkNetError()) {
            console.log('checkNetError');
            window.location.reload();
            return;
        }

        if (checkLogin()) {

            await getData('user').then(value => {
                user = value ? { ...value } : {};
            });

            const loginError = getLoginError();
            console.log('loginError', loginError);

            if (user.username != '' && user.password != '') {
                login();
            }

            if (loginError) {
                sendPeriodicMessage(hours, minute, '<blockquote>' + loginError + '</blockquote>\t\n' + getAnswer(answersLogin), [5, 20, 35, 50]);
            } else {
                sendPeriodicMessage(hours, minute, getAnswer(answersLogin), [5, 20, 35, 50]);
            }

            return;
        }


        if (window.location.href != 'http://help.ukrposhta.loc/otrs/index.pl?Action=AgentDashboard' &&
            window.location.href != 'http://help.ukrposhta.loc/otrs/index.pl?') {
            // console.log('Not Dashboard', window.location.href);
            return;
        }


        const rows = document.getElementsByClassName("MasterAction");

        const idList = {};

        idList.ticketNumId = columns.findIndex(el => el === 'TicketNumber');
        idList.createdId = columns.findIndex(el => el === 'Створено');
        idList.ageId = columns.findIndex(el => el === 'Відкрита');
        idList.titleId = columns.findIndex(el => el === 'Заголовок');
        idList.stateId = columns.findIndex(el => el === 'Стан');
        idList.ownerId = columns.findIndex(el => el === 'Власник');
        idList.customerNameId = columns.findIndex(el => el === "Ім'я клієнта");
        idList.ticketTagId = columns.findIndex(el => el === 'Тег заявки');
        idList.queueId = columns.findIndex(el => el === 'Черга');

        let tickets = [];

        try {
            const gettingItem = await browser.storage.local.get('tickets');
            tickets = gettingItem.tickets ? [...gettingItem.tickets] : [];
        } catch (error) {
            console.error('Error getting tickets from storage:', error);
        }

        const MAX_TICKETS_TO_STORE = 2000;
        let sendMessageResult = false;

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                const ticketNumber = getInnerText(rows[i], idList.ticketNumId);
                const ticketState = getInnerText(rows[i], idList.stateId);
                if (!tickets.includes(ticketNumber) && ticketState === 'Призначена') {
                    
                    // FIFO queue logic to prevent storage overflow
                    if (tickets.length >= MAX_TICKETS_TO_STORE) {
                        tickets.shift(); // Remove the oldest ticket
                    }
                    tickets.push(ticketNumber);

                    const ticketURL = getTicketURL(rows[i], idList.ticketNumId);
                    const ticketText = await getTicketText(ticketURL);

                    sendMessageResult = await sendMessage(
                        `🚨<a href="${ticketURL}">` + columns[idList.ticketNumId] + '</a>🚨' + '\t\n'
                        + getInnerText(rows[i], idList.ticketNumId) + '\t\n\n'
                        + columns[idList.createdId] + '\t\n<b>' + getInnerText(rows[i], idList.createdId) + ' (' + getInnerText(rows[i], idList.ageId) + ')</b>\t\n\n'
                        + columns[idList.ticketTagId] + '\t\n<b>' + getInnerText(rows[i], idList.ticketTagId) + '</b>\t\n\n'
                        + columns[idList.titleId] + '\t\n<b>' + getInnerText(rows[i], idList.titleId) + '</b>\t\n\n'
                        + columns[idList.customerNameId] + ' 😭' + '\t\n<b>' + getInnerText(rows[i], idList.customerNameId) + '</b>\t\n\n'
                        + ticketText
                    );
                }
            }


            if (sendMessageResult) {
                try {
                    await browser.storage.local.set({ 'tickets': tickets });
                } catch (error) {
                    console.error('Error setting tickets to storage:', error);
                }

            }


            sendPeriodicMessage(hours, minute, getAnswer(answersOnline), [5]);

        } else {

            const answerNoTickets = `<tg-emoji emoji-id="5368324170671202286">😎</tg-emoji> На даний момент необроблених заявок немає`;

            sendPeriodicMessage(hours, minute, answerNoTickets, [5]);
        }
    }

    function sendPeriodicMessage(hours, minute, message, checkPoint) {
        if (hours >= 8 && hours < 21) {
            if (checkPoint.includes(minute)) {
                if (hours + '' + minute !== lastTime) {
                    sendMessage(message);
                }

                lastTime = hours + '' + minute;
                setData('lastTime', lastTime).then(() => {
                    console.log('lastTime saved:', lastTime);
                })
            }

        }
    }

    function setTicketCount() {
        const ticketsCount = document.getElementById('Dashboard0130-TicketOpenAll').innerText.split('(')[1].split(')')[0];
        console.log('ticketsCount', ticketsCount);
        uploadTicketCount(ticketsCount);
    }

    function uploadTicketCount(ticketsCount) {
        const url = `https://otrs-patterns-default-rtdb.europe-west1.firebasedatabase.app/info/ticketsCount.json`;

        const data = {
            Count: ticketsCount,
            timeUpdate: new Date().toLocaleString()
        };

        runUpload(url, data, 'PATCH');
    }

    function runUpload(url, data, method) {

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Upload successfully:', data);
            })
            .catch(error => {
                console.error(`Error Upload to ${url} using ${method}:`, error);
            });
    }

    async function getTicketText(url) {
        try {
            const responseID = await fetch(url);
            if (!responseID.ok) {
                throw new Error('Network response was not ok for the first fetch');
            }

            const htmlID = await responseID.text();
            const article = getArticleID(htmlID);
            const articleURL = article.url;

            if (!articleURL) {
                throw new Error('Article URL not found');
            }

            const response2 = await fetch(`http://help.ukrposhta.loc${articleURL}`);
            if (!response2.ok) {
                throw new Error('Network response was not ok for the second fetch');
            }

            const html2 = await response2.text();
            return getArticleText(html2, article.id);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    function getArticleID(text) {
        const html = stringToHTML(text);
        const content = html.getElementsByClassName('No');
        if (content.length === 0) {
            console.error('Article ID not found in content');
            return null;
        }

        const articleID = {
            id: content[content.length - 1].children[1].value,
            url: content[content.length - 1].children[0].value
        }
        return articleID;
    }

    async function getArticleText(text, articleId) {
        const articleBodyHtml = stringToHTML(text);
        const articleBody = articleBodyHtml.getElementsByClassName('ArticleBody');
        const messageBrowser = articleBodyHtml.getElementsByClassName('MessageBrowser');

        if (articleBody.length > 0) {
            const textMessage = articleBody[0].innerText.split('********************************************************************************')[0]
                .split('***');
            const mess = 'Текст заявки: \t\n<blockquote>' + textMessage[0].trim() + '</blockquote>'
                + '\n 📧<b>' + textMessage[1].split('\n')[1].trim() + '</b>';
            return mess;
        } else if (messageBrowser.length > 0) {
            const ifr = articleBodyHtml.getElementsByClassName('ArticleMailContentHTMLWrapper');

            if (ifr.length > 0) {
                const src = ifr[0].children[`Iframe${articleId}`].src;

                try {
                    const responseID = await fetch(src);
                    if (!responseID.ok) {
                        throw new Error('Network response was not ok for the first fetch');
                    }

                    const iframeText = await responseID.text();
                    const iframeHtml = stringToHTML(iframeText);
                    const textMessage = iframeHtml.innerText.trim();
                    const mess = 'Текст заявки: \t\n<blockquote expandable>' + textMessage + '</blockquote>';
                    return mess;
                } catch (error) {
                    console.error('There has been a problem with your fetch operation:', error);
                }

            }

            return 'Текст заявки: \t\n<b> Щоб побачити текст, відкрийте заявку</b> 😅';
        } else {
            console.error('ArticleBody not found');
            return 'Текст заявки: \t\n<b> Щоб побачити текст, відкрийте заявку</b> 😅';
        }
    }

    function login() {

        const graf = document.getElementsByClassName('D3GraphCanvas');
        if (graf.length > 0) {
            window.location.reload();
            return;
        }

        const userInput = document.getElementById('User');
        const passwordInput = document.getElementById('Password');

        if (userInput && passwordInput) {
            userInput.value = user.username;
            passwordInput.value = user.password;
            document.login.submit();
        }

    }

    function stringToHTML(text) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(text, 'text/html');
        return doc.body;
    }

    function checkDialog() {
        const dialog = document.getElementsByClassName('Dialog');
        return dialog.length > 0;
    }

    function checkNetError() {
        const errButt = document.getElementById('netErrorButtonContainer');
        const errOTRS = document.getElementsByClassName('ErrorMessage');

        if (errButt || errOTRS.length > 0) {
            return true
        } else {
            return false;
        }
    }

    function checkLogin() {
        const loginBox = document.getElementById('LoginBox');
        if (loginBox) {
            return true
        } else {
            return false;
        }
    }

    function getLoginError() {
        const err = document.getElementsByClassName('Error');

        if (err.length > 0) {
            for (let i = 0; i < err.length; i++) {
                if (err[0].innerText.trim() !== '') {
                    return err[0].innerText.trim()
                }
            }
        }
        return '';
    }

    function getAnswer(answers) {
        const id = Math.floor(Math.random() * ((answers.length - 1) - 0 + 1)) + 0;
        return answers[id];
    }


    function getKindTicket(count) {
        switch (count.substr(count.length - 1)) {
            case '1': return 'необроблена заявка';
                break;
            case '2':
            case '3':
            case '4': return 'необроблені заявки';
                break;
            default: return 'необроблених заявок'
        }

    }

    function getColumns() {
        let columns = [];
        const headers = document.getElementsByClassName("DashboardHeader");

        for (let i = 0; i < headers.length; i++) {
            columns.push(headers[i].children[0].title.split(',')[0]);
        }
        return columns;
    }

    function getInnerText(row, id) {
        return row.children[id].innerText
    }

    function getTicketURL(row, id) {
        return row.children[id].children[0].href
    }

    async function sendMessage(message) {
        if (!botInfo.BOT_TOKEN) {
            await getBotInfo();
        }

        if (!botInfo.BOT_TOKEN) {
            return false;
        }

        const url = `https://api.telegram.org/bot${botInfo.BOT_TOKEN}/sendMessage`;
        const data = {
            chat_id: botInfo.CHAT_ID,
            text: message,
            parse_mode: 'html'
        };

        console.log('try send message');

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                return true;
            })
            .catch(error => {
                console.error('Error sending message:', error);
                return false;
            });
        return true;
    }

    async function getData(key) {
        const gettingItem = await browser.storage.local.get(key);
        return gettingItem[key];
    }

    async function getBotInfoFromDB(url) {
        try {
            const token = await getToken();
            if (!token.idToken) {
                alert('OTRS Bot - Не вдалося отримати дані. Перевірте логін і пароль.');
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
            console.error('There has been a problem with your fetch operation:', error);
        }
    }


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
            alert('OTRS Bot - Не вказано логін або пароль');
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

    async function setData(key, value) {
        try {
            await browser.storage.local.set({ [key]: value });
        } catch (error) {
            console.error(`Error setting ${key} to storage:`, error);
        }

    }
}