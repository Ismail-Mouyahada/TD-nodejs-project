



(function () {
    const server = 'http://127.0.0.1:3000';
    const socket = io(server);

    socket.on('notification', (data) => {
        console.log('Message depuis le seveur:', data);

    })

    fetch(`${server}/test`).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data);
    })

})();

date = new Date();
let parent = document.querySelector('.chat-list ul');
let parentMember = document.querySelector('.member-list');
let actual = document.querySelector('#actual');
let button = document.querySelector('#addMessage');
let input = document.querySelector('#messageData');
let hoursMin = date.getHours() + ':' + date.getMinutes()

async function getData() {
    await fetch('http://localhost:3000/history').then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data);
        return data
    }).catch((error) => {

        console.log(`Désolé une erreur est sevenu lors de la récolte des données .` + error);
    })
}


async function addData(message, index, member) {
    try {


        let obj = {
            "text": message,
            "number": index,
            "user": member

        }
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        };

        await fetch('http://localhost:3000/create', options)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                window.top.location.reload()
            })
            .catch(err => console.error(err));


    } catch (error) {
        console.log(`Désolé une erreur est sevenu lors de l'envoie des données .` + error)

    }

}



async function createMessage() {
    if (localStorage.getItem('member') === null) {
        const member = prompt(`c'est quoi votre prénom " ?`)
        localStorage.setItem('member', member)
    } else {
        member = localStorage.getItem('member')
    }

    let server = 'http://localhost:3000';
    let socket = io(server);

    await socket.on('notification', (data) => {
        addData(input.value, Math.random() * 100, member);
        console.log('Message depuis le seveur:', data);
    })

}

button.addEventListener('click', createMessage);


async function start() {
    if (localStorage.getItem('member') === null) {
        actual.innerHTML = `incunu`
    } else {
        actual.innerHTML = localStorage.getItem('member')
    }
    await fetch('http://localhost:3000/history')
        .then((res) => { return res.json() })
        .then((data) => {
            for (let i = 0, len = data.length; i < len; i++) {
                console.log('un element :' + data.length);
                let message = document.createElement('li');
                let member = document.createElement('li');
                message.innerHTML = `
  
                    <div class="name">
                        <span class=""> ${data[i].user}</span>
                    </div>
                    <div class="message">
                        <p>${data[i].text}</p>
                        <span class="msg-time">${data[i].date}</span>
                    </div>
                
                     `;
                member.innerHTML = `
                                    <li>
                                        <span class="status online">
                                        <i class="fa fa-circle-o"></i>
                                        </span>
                                        <span>${data[i].user}</span>
                                    </li>
                                    `;
                parentMember.appendChild(member);
                parent.appendChild(message);
            };
            return data
        }).catch((error) => {

            console.log(`Désolé une erreur est sevenu lors de la récolte des données .` + error);
        })

}

start();