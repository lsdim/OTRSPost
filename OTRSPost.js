console.log('start');
const user = {};

const dev_chat = '-4228417669';
const prod_chat = '-4267367123';

const BOT_TOKEN = '7255647619:AAH0dKnIaCsFRx7Dg2qyezOWuum4ItZBkec';
const CHAT_ID = prod_chat;


document.body.style.border = "2px solid red";
let columns = getColumns();



//checkNewTicket(columns);

const intervalID = setInterval(checkNewTicket, 60000, columns);
//checkNewTicket(columns);


/*async function checkNewTicket(columns) {
	
	const now = new Date();
	const minute = now.getMinutes();
	const hours  = now.getHours()
	
	if (checkLogin()) {
		if (hours >= 8 && hours < 21) {						
			if (minute === 05 || minute === 20 || minute === 35 || minute === 50) {
				sendMessage(getAnswerLogin());
			}
		}
		return;
	}
	
	
	
	const rows = document.getElementsByClassName("MasterAction");


	/*
	0: "Пріоритет"​
	1: "Нове повідомлення"​
	2: "TicketNumber"​
	3: "Створено"​
	4: "Відкрита"​
	5: "Заголовок"​
	6: "Стан"​
	7: "Власник"​
	8: "Ім'я клієнта"​
	9: "Тег заявки"​
	10: "Черга"
	*/
	
/*	
	const ticketNumId = columns.findIndex(el => el === 'TicketNumber');
	const createdId = columns.findIndex(el => el === 'Створено');
	const ageId = columns.findIndex(el => el === 'Відкрита');
	const titleId = columns.findIndex(el => el === 'Заголовок');
	const stateId = columns.findIndex(el => el === 'Стан');
	const ownerId = columns.findIndex(el => el === 'Власник');
	const customerNameId = columns.findIndex(el => el === "Ім'я клієнта");
	const ticketTagId = columns.findIndex(el => el === 'Тег заявки');
	const queueId = columns.findIndex(el => el === 'Черга');

	//console.log('columns',columns);




	//console.log(rows);

	/*const tmp = getTickets();
	let tickets = [];
	tmp.tickets ? tickets = [...tmp.tickets] : console.log('tmp',tmp);
	*/
/*
	let tickets = [];

		let gettingItem = browser.storage.local.get('tickets');
		 gettingItem.then(tck => {
			 
			 tck.tickets ? tickets = [...tck.tickets] : console.log('tck',tck);
			 
			 console.log('tickets', tickets);		 
			 
			 
			 if (rows) {
				if (rows.length>0) {
					for (let i=0; i<rows.length; i++) {					
						if (tickets.findIndex(ticket => ticket === getInnerText(rows[i],ticketNumId)) === -1 && getInnerText(rows[i],stateId) === 'Призначена') {
							tickets.push(getInnerText(rows[i],ticketNumId));
							console.log('tickets - ' + i, tickets);
							
							
							const ticketURL = getTicketURL(rows[i], ticketNumId);
							
							getArticleID(ticketURL);
								
							console.log('tcktText end');
							
						/*	sendMessage(
							'<tg-emoji emoji-id="5368324170671202286">🚨</tg-emoji>' +columns[ticketNumId] 
							+ '<tg-emoji emoji-id="5368324170671202286">🚨</tg-emoji>' + '\t\n<b>' + getInnerText(rows[i],ticketNumId) + '</b>\t\n\n'  
							+ columns[createdId] + '\t\n<b>' + getInnerText(rows[i],createdId) + ' (' + getInnerText(rows[i],ageId) + ')</b>\t\n\n' 
							+ columns[ticketTagId] + '\t\n<b>' + getInnerText(rows[i],ticketTagId) + '</b>\t\n\n'
							+ columns[titleId] + '\t\n<b>' + getInnerText(rows[i],titleId) + '</b>\t\n\n' 
							+ columns[customerNameId] + ' <tg-emoji emoji-id="5368324170671202286">😭</tg-emoji>' 
							+ '\t\n<b>' + getInnerText(rows[i],customerNameId) + '</b>\t\n\n'
							+ columns[stateId] + '\t\n<b>' + getInnerText(rows[i],stateId) + '</b>\t\n\n' 
							+ columns[ownerId] + '\t\n<b>' + getInnerText(rows[i],ownerId) + '</b>\t\n\n' 
							 
							
							);		

						*/							
/*							
						}
					}
					
					browser.storage.local.set({ 'tickets': tickets }).then(setItem, onError);
					
					if (hours >= 8 && hours < 21) {
						
						if (minute === 05) {
						
						//let ticketsCount = document.getElementById('Dashboard0130-TicketOpenAll').innerText.split('(')[1].split(')')[0]; 

						//sendMessage(
						//	'<tg-emoji emoji-id="5368324170671202286">📯</tg-emoji>' + ` Зараз є ${+ticketsCount} ${getKindTicket(ticketsCount)} `
						//	);
						sendMessage(getAnswerOnline());
						/* sendMessage(
							'<tg-emoji emoji-id="5368324170671202286">😎</tg-emoji>' + ' Просто нагадую, що я працюю'
							);
							*/
/*					}
					} 
					
					
							
				} else {
					if (hours >= 8 && hours < 21) {
						if (minute === 05) {
							sendMessage(
								'<tg-emoji emoji-id="5368324170671202286">😎</tg-emoji>' + ' На даний момент необроблених заявок немає'
								);
						}
					}
					
				} 
			}

		}, onError);
}

*/



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
	
	;
	
	

    if (checkLogin()) {
		
		try {
			const gettingItem = await browser.storage.local.get('username');
			user.username = gettingItem.username ? gettingItem.username : '';
		} catch (error) {
			console.error('Error getting username from storage:', error);
		}
		
		try {
			const gettingItem = await browser.storage.local.get('password');
			user.password = gettingItem.password ? gettingItem.password : '';
		} catch (error) {
			console.error('Error getting password from storage:', error);
		}
		
		//console.log('user', user.username);
		//console.log('password', user.password);
		
		const loginError = getLoginError();
		console.log('loginError', loginError);
		
		if (user.username != '' && user.password != '') {
			login();
		}
		
        if (hours >= 8 && hours < 21) {						
            if ([5, 20, 35, 50].includes(minute)) {
				if (loginError) {
					sendMessage('<blockquote>' + loginError + '</blockquote>\t\n' + getAnswer(answersLogin));
				} else {
					sendMessage(getAnswer(answersLogin));
				}				
                
            }
        }
        return;
    }
	
	
	if (window.location.href != 'http://help.ukrposhta.loc/otrs/index.pl?Action=AgentDashboard' &&
		window.location.href != 'http://help.ukrposhta.loc/otrs/index.pl?') {
		console.log('Not Dashboard', window.location.href);
		return;
	}

    const rows = document.getElementsByClassName("MasterAction");
	
	/*
	0: "Пріоритет"​
	1: "Нове повідомлення"​
	2: "TicketNumber"​
	3: "Створено"​
	4: "Відкрита"​
	5: "Заголовок"​
	6: "Стан"​
	7: "Власник"​
	8: "Ім'я клієнта"​
	9: "Тег заявки"​
	10: "Черга"
	*/

    const ticketNumId = columns.findIndex(el => el === 'TicketNumber');
    const createdId = columns.findIndex(el => el === 'Створено');
    const ageId = columns.findIndex(el => el === 'Відкрита');
    const titleId = columns.findIndex(el => el === 'Заголовок');
    const stateId = columns.findIndex(el => el === 'Стан');
    const ownerId = columns.findIndex(el => el === 'Власник');
    const customerNameId = columns.findIndex(el => el === "Ім'я клієнта");
    const ticketTagId = columns.findIndex(el => el === 'Тег заявки');
    const queueId = columns.findIndex(el => el === 'Черга');

    let tickets = [];

    try {
        const gettingItem = await browser.storage.local.get('tickets');
        tickets = gettingItem.tickets ? [...gettingItem.tickets] : [];
    } catch (error) {
        console.error('Error getting tickets from storage:', error);
	}
	
	//setTicketCount();

    if (rows.length > 0) {
        for (let i = 0; i < rows.length; i++) {
            const ticketNumber = getInnerText(rows[i], ticketNumId);
            const ticketState = getInnerText(rows[i], stateId);
            if (!tickets.includes(ticketNumber) && ticketState === 'Призначена') {
			//if (!tickets.includes(ticketNumber)) {
                tickets.push(ticketNumber);
                const ticketURL = getTicketURL(rows[i], ticketNumId);
                const ticketText = await getTicketText(ticketURL); // Асинхронний виклик

              /*  sendMessage(
                    `<tg-emoji emoji-id="5368324170671202286">🚨</tg-emoji>${columns[ticketNumId]}<tg-emoji emoji-id="5368324170671202286">🚨</tg-emoji>
                    \t\n<b>${getInnerText(rows[i], ticketNumId)}</b>\t\n\n${columns[createdId]}
                    \t\n<b>${getInnerText(rows[i], createdId)} (${getInnerText(rows[i], ageId)})</b>\t\n\n${columns[ticketTagId]}
                    \t\n<b>${getInnerText(rows[i], ticketTagId)}</b>\t\n\n${columns[titleId]}
                    \t\n<b>${getInnerText(rows[i], titleId)}</b>\t\n\n${columns[customerNameId]} <tg-emoji emoji-id="5368324170671202286">😭</tg-emoji>
                    \t\n<b>${getInnerText(rows[i], customerNameId)}</b>\t\n\n${columns[stateId]}
                    \t\n<b>${getInnerText(rows[i], stateId)}</b>\t\n\n${columns[ownerId]}
                    \t\n<b>${getInnerText(rows[i], ownerId)}</b>\t\n\n${ticketText}`
                );
				*/
				
				sendMessage(
							`🚨<a href="${ticketURL}">` +columns[ticketNumId] + '</a>🚨' + '\t\n' 
							+ getInnerText(rows[i],ticketNumId) + '\t\n\n'  
							+ columns[createdId] + '\t\n<b>' + getInnerText(rows[i],createdId) + ' (' + getInnerText(rows[i],ageId) + ')</b>\t\n\n' 
							+ columns[ticketTagId] + '\t\n<b>' + getInnerText(rows[i],ticketTagId) + '</b>\t\n\n'
							+ columns[titleId] + '\t\n<b>' + getInnerText(rows[i],titleId) + '</b>\t\n\n' 
							+ columns[customerNameId] + ' 😭' + '\t\n<b>' + getInnerText(rows[i],customerNameId) + '</b>\t\n\n'
							+ ticketText 
							//+ columns[stateId] + '\t\n<b>' + getInnerText(rows[i],stateId) + '</b>\t\n\n' 
							//+ columns[ownerId] + '\t\n<b>' + getInnerText(rows[i],ownerId) + '</b>\t\n\n' 
							 
							
							);
            }
        }

        try {
            await browser.storage.local.set({ 'tickets': tickets });
        } catch (error) {
            console.error('Error setting tickets to storage:', error);
        }

        if (hours >= 8 && hours < 21 && minute === 5) {
            sendMessage(getAnswer(answersOnline));
        }
    } else {
        if (hours >= 8 && hours < 21 && minute === 5) {
            sendMessage('<tg-emoji emoji-id="5368324170671202286">😎</tg-emoji> На даний момент необроблених заявок немає');
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
    .then(response => response.json())
    .then(data => {
        console.log('Upload successfully:', data);
		// showLog(`Завантаженно шаблон ${data.name}`);
    })
    .catch(error => {
        console.error('Error Upload:', error);
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
		
		//console.log('article', article);

        if (!articleURL) {
            throw new Error('Article URL not found');
        }

		//console.log(`${url}#${articleURL}`);
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
	
	//console.log('no', content, content[content.length-1].children[1].value);
	const articleID = {id: content[content.length-1].children[1].value,
					  url: content[content.length-1].children[0].value}
    return articleID;
}

async function getArticleText(text, articleId) {
    const articleBodyHtml = stringToHTML(text);
    const articleBody = articleBodyHtml.getElementsByClassName('ArticleBody');
	const messageBrowser = articleBodyHtml.getElementsByClassName('MessageBrowser');
	
	//console.log('articleBody', articleBodyHtml);

    if (articleBody.length > 0) {
       // console.log('ArticleBody', articleBody);
		const textMessage = articleBody[0].innerText.split('********************************************************************************')[0]
							.split('***'); 
        const mess = 'Текст заявки: \t\n<blockquote>' + textMessage[0].trim() + '</blockquote>'
							+ '\n 📧<b>' + textMessage[1].split('\n')[1].trim() + '</b>';
        //console.log('mess', mess);
        return mess;			
    } else if (messageBrowser.length > 0) {		
		const ifr = articleBodyHtml.getElementsByClassName('ArticleMailContentHTMLWrapper');
		
		if (ifr.length>0) {			
			const src = ifr[0].children[`Iframe${articleId}`].src;			

			try {
				const responseID = await fetch(src);
				if (!responseID.ok) {
					throw new Error('Network response was not ok for the first fetch');
				}

				const iframeText = await responseID.text();				
				const iframeHtml = stringToHTML(iframeText);
				const textMessage = iframeHtml.innerText.trim(); 
				//console.log('textMessage',textMessage);
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

//**************************************	


//*************Login***********************
function login() {
	
	const graf = document.getElementsByClassName('D3GraphCanvas');
	if (graf.length>0) {
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

//*************End Login*******************

function stringToHTML (text) {
	let parser = new DOMParser();
	let doc = parser.parseFromString(text, 'text/html');
	return doc.body;
}

function checkDialog() {
	const dialog = document.getElementsByClassName('Dialog'); 
	return dialog.length>0;
}

function checkNetError() {
	const errButt = document.getElementById('netErrorButtonContainer');
	const errOTRS = document.getElementsByClassName('ErrorMessage');
	//const errAjax = document.getElementById('AjaxErrorDialog');
	
	if (errButt || errOTRS.length>0) {	
		//console.log(errButt, errOTRS.length);
		return true
	} else {
		return false;
	}
	/*
	if (errButt) {
		window.location.reload();
	}*/
}

function checkLogin() {
	const loginBox = document.getElementById('LoginBox');
	//console.log('loginBox',loginBox);
	//console.log(document.getElementsByClassName('Error'));
	if (loginBox) {	
		 
		return true
	} else {
		return false;
	} 
}

function getLoginError() {
	const err = document.getElementsByClassName('Error');
	
	if (err.length>0) {
		for (let i=0; i<err.length; i++) {
			if (err[0].innerText.trim() !== '') {
				return err[0].innerText.trim()
			}
		}		
	}	
	return '';
}

function getAnswer(answers) {	
	const id = Math.floor(Math.random() * ((answers.length - 1) - 0 + 1)) + 0;
	console.log('id',id);
	return answers[id];
}


function getKindTicket(count) {
	switch (count.substr(count.length - 1)) {
		case '1': return 'необроблена заявка';
			break;
		case '2': 
		case '3':
		case '4':	return 'необроблені заявки';
			break;
		default: return 'необроблених заявок'
	}
	
}

function getColumns() {
	let columns = [];
	const headers = document.getElementsByClassName("DashboardHeader");

	for (let i=0; i<headers.length; i++) {
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

/*function setItem() {
  console.log("OK");
}*/

/*function onError(error) {
  console.log(error);
}*/

/*function onGot(item) {
	console.log('onGot', item);
}*/

function sendMessage(message) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const data = {
        chat_id: CHAT_ID,
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
        //console.log('Message sent successfully:', data);
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
}

/*function oldSendMessage(message) {
	let url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
	
	const data = JSON.stringify({
        chat_id: CHAT_ID,
        text: message
    });
	
	let formData = new FormData();

	formData.append("chat_id", CHAT_ID);
	formData.append("text", message);
	
	console.log('data',data);
    try {
		let oReq = new XMLHttpRequest();
		oReq.open("POST", url, true);
	
		oReq.setRequestHeader('Content-Type', 'application/json');
		oReq.setRequestHeader('Origin', 'http://ukrposhta.loc');
		
		oReq.send(formData);
		console.log('Message sent successfully', url);
	} catch (error) {
		console.error('Error sending message:', error);
	}
    
}*/










