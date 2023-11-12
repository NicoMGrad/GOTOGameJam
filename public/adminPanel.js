
window.addEventListener('DOMContentLoaded', async (event) => {
    try {
        await fetchAdminDetails();
        // await fetchNotVotedGames();
        await populateGamesTable();
    } catch (error) {
        console.error("Error al inicializar la página:", error);
    }
});

document.getElementById('closeSession').addEventListener('click', function(e){
    e.preventDefault();
    localStorage.clear();
    window.location.href = `index.html`;
});

async function fetchAdminDetails() {
    const adminId = getAdminIdFromLocalStorage();
    if (!adminId) return;

    try {
        const response = await fetch(`/admins/${adminId}`);
        if (!response.ok) {
            throw new Error('Error de conexión al buscar al admin');
        }
        const admin = await response.json();
        localStorage.setItem('adminName', admin.name);
        localStorage.setItem('adminId', admin._id.toString());
        displayAdminName(admin.name);
    } catch (error) {
        console.error('Error invocando los datos del admin:', error);
    }
}


function displayAdminName(name) {
    document.getElementById('adminName').textContent = name;
}


async function deleteGame(gameId) {
    try {
        const response = await fetch(`/games/delete/${gameId}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Datos recibidos:", data);
    } catch (error) {
        console.error('Error al borrar un juego:', error);
    }
}

async function registerGame(model,gameId = '') {
    const name = document.getElementById('name').value;
    const edition = document.getElementById('edition').value;
    /*Members*/
    const members = document.getElementById('member').value;
    const arrayMembers = members.split(',');
    /*Genres*/
    const genres = document.getElementById('genre').value;
    const arrayGenres = genres.split(',');

    console.log(model, gameId);

    try {
        const response = await fetch(`${ model == 'registrar'? '/games/register' : '/games/update/'+gameId }`, {
            method: `${ model == 'registrar'? 'POST' : 'PUT' }`,
            body: JSON.stringify({
                name: name.trim(),
                genre: [
                    ...arrayGenres
                ],
                members: [
                    ...arrayMembers
                ],
                edition: parseInt(edition)
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        console.log("Datos recibidos:", data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function populateGamesTable() {
    try {
        const allGames = await (await fetch('/games')).json();
        renderCards(allGames);
    } catch (error) {
        console.error("Error cargando los juegos:", error);
    }
}


function getAdminIdFromLocalStorage() {
    const adminId = localStorage.getItem('loggedInAdminId');
    if (!adminId) {
        console.error('No se encuentra id de admin en el local storage');
        return null;
    }
    return adminId;
}

document.getElementById('abcFilter').addEventListener('click', async function(e){
    console.log('Botón funciona');
    e.preventDefault();
    try {
        const response = await fetch('/games/orderBy');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const orderedGames = await response.json();
        console.log('Ordered games', orderedGames);
    } catch (error) {
        console.error('Error trayendo los juegos ordenados:', error);
    }
});

function openEditModal(game,model) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    if(model == 'borrar'){

        const   deleteModal = document.createElement('div');
                deleteModal.classList.add('modal-content');
        const   textModal = document.createElement('h1');
                textModal.classList.add('onlyTextModal');
                textModal.innerText = `¿Estás seguro de borrar ${game.name}?`;
                textModal.classList.add('textModal');
        deleteModal.appendChild(textModal);
        const   deleteBtn = document.createElement('button');
                deleteBtn.classList.add('btn','btn-green','btn-center');
                deleteBtn.innerText = 'Sí, borrar >:@';
                deleteBtn.addEventListener('click', async function(e){
                    e.preventDefault();
                    console.log(game._id);
                    try {
                        await deleteGame(game._id);
                        populateGamesTable();
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

    } else if(model == 'info'){

        const   infoModal = document.createElement('div');
                infoModal.classList.add('modal-content');
            const   gameTitle = document.createElement('h2');
                    gameTitle.innerText = `${game.name}`;
            const   table = document.createElement('div');
                    table.id = 'judgesVotesTableContainer';
                    fetchAndDisplayJudgesVotes(game._id);
            const   btnClose = document.createElement('button');
                    btnClose.innerHTML = '<span class="material-symbols-outlined">close</span>';
                    btnClose.classList.add('btn', 'btn-green','btn-round','onlyClose');
                    btnClose.addEventListener('click', function(e){
                        e.preventDefault();
                        modal.remove();
                    });
            infoModal.appendChild(btnClose);
            infoModal.appendChild(gameTitle);
            infoModal.appendChild(table);

        modal.appendChild(infoModal);
    
    } else {
        const modalForm = document.createElement('form');
        modalForm.classList.add('modal-content');
    
        modalForm.innerHTML = `
            ${(function (){
                if(model === 'editar'){
                    return `<input name="game" class="inputHidden" id="game" value="${game._id}" type="hidden" disabled></input>`
                } else {
                    return ''
                }
            })()}
            
            <div class="inputContainer">
                <label for="name">Nombre:</label>
                <input type="text" name="name" id="name" value="${ game.name ? game.name : '' }" required>
            </div>
            <div class="inputContainer">
                <label>Géneros:</label>
                <input type="text" name="genre" id="genre" value="${ game.genre ? game.genre.join(', ') : '' }" required>
            </div>
    
            <div class="inputContainer">
                <label>Miembros:</label>
                <input type="text" name="member" id="member" value="${ game.members ? game.members.join(', ') : '' }" required>
            </div>
    
            <div class="inputContainer">
            <label for="edition">Edition:</label>
            <input type="number" name="edition" min="1960" id="edition" value="${ game.edition ? game.edition : '' }" max="2023" required>
            </div>
        `;

        const saveBtn = document.createElement('input');
        saveBtn.type = 'submit';
        saveBtn.classList.add('btn','btn-green');
        saveBtn.value = 'Guardar';
        modalForm.addEventListener('submit', async function(e){
            e.preventDefault();
            try {
                if(model == 'editar'){
                    await registerGame('editar', game._id);
                } else {
                    await registerGame('registrar');
                }
                populateGamesTable();
                modal.remove();
            } catch (error) {
                console.error('Error registrando el voto:', error);
            }
        
        });
        modalForm.appendChild(saveBtn);
        modal.appendChild(modalForm);
    }

    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    };

    document.body.appendChild(modal);

    modal.style.display = 'block';
}

async function filterGenre(genre){
    console.log(genre);
    const filteredGames = await (await fetch(`/games/genre/${genre}`)).json();
    document.getElementById('gameCards').innerHTML = '';
    renderCards(filteredGames);
    if(document.getElementById(`pill-${genre}`)){
        console.log('Ya existe');
    } else {
        if(document.querySelector('.filterGenderPill')){
            document.querySelector('.filterGenderPill').firstElementChild.innerText += `, ${genre}`;
        } else {
            const   filterGenderPill = document.createElement('div');
                    filterGenderPill.classList.add('filterGenderPill');
                    filterGenderPill.id = `pill-${genre}`;
                    const   pillText = document.createElement('span');
                            pillText.innerText = `${genre}`;
                    const   closeIcon = document.createElement('span');
                            closeIcon.innerText = 'close';
                            closeIcon.classList.add('material-symbols-outlined');
                            closeIcon.addEventListener('click', async function(){
    
                                const allGames = await (await fetch(`/games/`)).json();
                                document.getElementById('gameCards').innerHTML = '';
                            
                                renderCards(allGames);
                                document.getElementById('secondHeader').removeChild(filterGenderPill);
    
                            });
                    filterGenderPill.appendChild(pillText);
                    filterGenderPill.appendChild(closeIcon);
            document.getElementById('secondHeader').appendChild(filterGenderPill);
        }

    }    


}

function renderCards(allGames){
    const gameCards = document.getElementById('gameCards');
        gameCards.innerHTML = '';
        gameCards.classList.add('cards');
        allGames.forEach(game => {
            const   gameCard = document.createElement('div');
                    gameCard.classList.add('gameCard');
                const   gameTitle = document.createElement('h3');
                        gameTitle.innerHTML = `${game.name}<span class="editionPill">${game.edition}</span>`;
                    gameCard.appendChild(gameTitle);
                
                const   gameGenre = document.createElement('div');
                        gameGenre.classList.add('genresContainer');
                    const   gameGenres = game.genre;
                            gameGenres.forEach(genre => {
                                let genreSpan = document.createElement('button');
                                    genreSpan.classList.add('genres');
                                    genreSpan.innerText = genre;
                                    genreSpan.addEventListener('click', function(e){
                                        e.preventDefault();
                                        filterGenre(`${genre}`);
                                    });
                                gameGenre.appendChild(genreSpan);
                            });
                    gameCard.appendChild(gameGenre);
            const   gameMember = document.createElement('div')
            const   gameMembers = game.members.join(', ');
            gameMember.innerText = gameMembers;
            gameCard.appendChild(gameMember);
            const   actionBtnContainer = document.createElement('div');
                    actionBtnContainer.classList.add('actionBtnContainer');      
                const   editOverlay = document.createElement('div');
                        editOverlay.classList.add('btnRound','roundEdit');
                        editOverlay.innerHTML = '<span class="material-symbols-outlined" id="btnEdit" title="Edit">edit</span>';
                actionBtnContainer.appendChild(editOverlay);
                const   deleteOverlay = document.createElement('div');
                        deleteOverlay.classList.add('btnRound','roundDelete');
                        deleteOverlay.innerHTML = '<span class="material-symbols-outlined" id="btnDelete" title="Delete">delete</span>';
                actionBtnContainer.appendChild(deleteOverlay);
                const   infoOverlay = document.createElement('div');
                        infoOverlay.classList.add('btnRound','roundInfo');
                        infoOverlay.innerHTML = '<span class="material-symbols-outlined" id="btnInfo" title="More information">info</span>';
                actionBtnContainer.appendChild(infoOverlay);
            gameCard.appendChild(actionBtnContainer);
            editOverlay.addEventListener('click', function(e){
                e.preventDefault();
                openEditModal(game,'editar');
            });
            deleteOverlay.addEventListener('click', function(e){
                e.preventDefault();
                openEditModal(game,'borrar');
            });
            infoOverlay.addEventListener('click', function(e){
                e.preventDefault();
                openEditModal(game,'info');
            });
            
            gameCards.appendChild(gameCard);
        });
}

document.getElementById('btnNewGame').addEventListener('click', function(){
    openEditModal('','registrar');
})


async function fetchAndDisplayJudgesVotes(gameId) {
    try {
        const response = await fetch(`/games/${gameId}/judges`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const judgesVotesData = await response.json();
        displayJudgesVotesTable(judgesVotesData);
    } catch (error) {
        console.error('Error invocando los datos del juez:', error);
    }
}

function displayJudgesVotesTable(judgesVotesData) {
    const container = document.getElementById('judgesVotesTableContainer');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('judges-votes-table'); 

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Juez', 'Gameplay', 'Arte', 'Sonido', 'Afinidad', 'Puntaje final'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    judgesVotesData.forEach(vote => {
        const tr = document.createElement('tr');
        tr.appendChild(createCell(vote.judgeName));
        tr.appendChild(createCell(vote.scores.gameplay));
        tr.appendChild(createCell(vote.scores.art));
        tr.appendChild(createCell(vote.scores.sound));
        tr.appendChild(createCell(vote.scores.afinity));
        tr.appendChild(createCell(vote.finalScore));
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.appendChild(table);
}

function createCell(text) {
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}

