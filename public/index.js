// import { openEditModal } from "./adminPanel";


const form = document.getElementById('loginForms').firstElementChild;
const storedAdminId = localStorage.getItem('loggedInAdminId');
const storedJudgeId = localStorage.getItem('loggedInJudgeId');

document.getElementById('loginForms').firstElementChild.addEventListener('submit', function(event){
    event.preventDefault();
    console.log("Formulario enviado");
    onLogin();
});

async function onLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    await fetch(`${form.id === 'loginFormUser'? '/login':'admin/login'}`, {
        method: 'POST',
        body: JSON.stringify({ username: username, password: password }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json())
    .then( data => {
        if(data.msg == 'Nombre de usuario o contraseña incorrectos.'){
            console.log('Si la data es incorrecta', data.msg);
            openInfoModal(`${data.msg}`);
        } else {
            console.log(data);
            localStorage.clear();
            localStorage.setItem(`${form.id === 'loginFormUser'? 'loggedInJudgeId':'loggedInAdminId'}`, data.id);
            localStorage.setItem(`${form.id === 'loginFormUser'? 'loggedInJudgeName':'loggedInAdminName'}`, data.name);
            window.location.href = `${form.id === 'loginFormUser'? 'userPanel.html':'adminPanel.html'}`;
        }
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('soyJuez').addEventListener('click', function(e){
    e.preventDefault();
    if(form.id !== 'loginFormUser'){
        form.id = 'loginFormUser';
        document.getElementById('soyJuez').classList.add('loginBtnSelected');
        document.getElementById('soyAdmin').classList.remove('loginBtnSelected');
    }
});

document.getElementById('soyAdmin').addEventListener('click', function(e){
    e.preventDefault();
    if(form.id !== 'loginFormAdmin'){
        form.id = 'loginFormAdmin';
        document.getElementById('soyAdmin').classList.add('loginBtnSelected');
        document.getElementById('soyJuez').classList.remove('loginBtnSelected');
    }
});

function openInfoModal(msg) {
    const   modal = document.createElement('div');
            modal.classList.add('modal');

    const   deleteModal = document.createElement('div');
            deleteModal.classList.add('modal-content');
    const   textModal = document.createElement('h1');
            textModal.classList.add('onlyTextModal');
            textModal.innerText = `${msg}`;
            textModal.classList.add('textModal');
    deleteModal.appendChild(textModal);
    const   deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn','btn-green','btn-center');
            deleteBtn.innerText = 'Copiado we';
            deleteBtn.addEventListener('click', async function(e){
                e.preventDefault();
                try {
                    modal.remove();
                } catch (error) {
                    console.error('Error borrando objeto:', error);
                }
            });
            const   btnClose = document.createElement('button');
        btnClose.innerHTML = '<span class="material-symbols-outlined">close</span>';
        btnClose.classList.add('btn', 'btn-green', 'btn-round','onlyClose');
        btnClose.addEventListener('click', function(e){
            e.preventDefault();
            modal.remove();
        });

    deleteModal.appendChild(btnClose);
    deleteModal.appendChild(deleteBtn);
    modal.appendChild(deleteModal);

    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    };

    document.body.appendChild(modal);

    modal.style.display = 'block';
}