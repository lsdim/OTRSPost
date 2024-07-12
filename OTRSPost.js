

const BOT_TOKEN = '7255647619:AAH0dKnIaCsFRx7Dg2qyezOWuum4ItZBkec';
const CHAT_ID = '-4267367123';

document.body.style.border = "2px solid red";
let columns = getColumns();


const intervalID = setInterval(checkNewTicket, 60000, columns);
//checkNewTicket(columns);


function checkNewTicket(columns) {
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

	//console.log('columns',columns);




	//console.log(rows);

	/*const tmp = getTickets();
	let tickets = [];
	tmp.tickets ? tickets = [...tmp.tickets] : console.log('tmp',tmp);
	*/

	let tickets = [];

		let gettingItem = browser.storage.local.get('tickets');
		 gettingItem.then(tck => {
			 
			 tck.tickets ? tickets = [...tck.tickets] : console.log('tck',tck);
			 
			 console.log('tickets', tickets);
			 
			 let now = new Date();
			 let minute = now.getMinutes();
			 
			 if (rows) {
				if (rows.length>0) {
					for (let i=0; i<rows.length; i++) {					
						if (tickets.findIndex(ticket => ticket === getInnerText(rows[i],ticketNumId)) === -1 && getInnerText(rows[i],stateId) === 'Призначена') {
							tickets.push(getInnerText(rows[i],ticketNumId));
							console.log('tickets - ' + i, tickets);
							
							sendMessage(
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
							
						}
					}
					
					browser.storage.local.set({ 'tickets': tickets }).then(setItem, onError);
					
					if (minute === 00 || minute === 30) {
						
						let ticketsCount = document.getElementById('Dashboard0130-TicketOpenAll').innerText.split('(')[1].split(')')[0]; 

						sendMessage(
							'<tg-emoji emoji-id="5368324170671202286">📯</tg-emoji>' + ` Зараз є ${+ticketsCount} ${getKindTicket(ticketsCount)} `
							);
					}
					
							
				} else {
					if (minute === 00 || minute === 30) {
						sendMessage(
							'<tg-emoji emoji-id="5368324170671202286">😎</tg-emoji>' + ' На даний момент необроблених заявок немає'
							);
					}
				} 
			}

		}, onError);
}

	




/*function getTickets() {
	
	let tickets = [];
	browser.storage.local.get('tickets').then(onGot, onError);

	let gettingItem = browser.storage.local.get('tickets');
	 gettingItem.then(tck => { tck.tickets ? tickets = [...tck.tickets] : console.log('tck',tck)}, onError);
	console.log('tickets', tickets);
	return tickets;
}
*/
/*
async function getTickets() {
  const storageData = await browser.storage.local.get('tickets');
  console.log('storageData', storageData);  // stored object, not a promise anymore!
  return storageData;
}*/

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

function setItem() {
  console.log("OK");
}

function onError(error) {
  console.log(error);
}

function onGot(item) {
	console.log('onGot', item);
}

function sendMessage(message) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const data = {
        chat_id: CHAT_ID,
        text: message,
		parse_mode: 'html'
    };

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



