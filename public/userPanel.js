
window.addEventListener('DOMContentLoaded', async (event) => {
    try {
        await fetchJudgeDetails();
        await fetchNotVotedGames();
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

async function fetchJudgeDetails() {
    const judgeId = getJudgeIdFromLocalStorage();
    if (!judgeId) return;

    try {
        const response = await fetch(`/judges/${judgeId}`);
        if (!response.ok) {
            throw new Error('Error de conexión');
        }
        const judge = await response.json();
        localStorage.setItem('judgeName', judge.name);
        localStorage.setItem('judgeId', judge._id.toString());
        displayJudgeName(judge.name);
    } catch (error) {
        console.error('Error invocando a los jueces:', error);
    }
}

function displayJudgeName(name) {
    document.getElementById('judgeName').textContent = name;
}

function displayAdminName(name) {
    document.getElementById('adminName').textContent = name;
}

async function fetchNotVotedGames() {
    const judgeId = getJudgeIdFromLocalStorage();
    if (!judgeId) return;

    try {
        const games = await (await fetch(`/games/notVotedBy/${judgeId}`)).json();
    } catch (error) {
        console.error('Error invocando a los juegos:', error);
    }
}

async function registerVote() {
    const gameId = document.getElementById('game').value;
    const judgeId = document.getElementById('judge').value;

    try {
        const response = await fetch('/votes/register', {
            method: 'POST',
            body: JSON.stringify({
                judge: judgeId,
                game: gameId,
                scores: {
                    gameplay: document.getElementById('gameplay').value,
                    art: document.getElementById('art').value,
                    sound: document.getElementById('sound').value,
                    afinity: document.getElementById('afinity').value
                }
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
    const judgeId = getJudgeIdFromLocalStorage();

    try {
        const votedGamesByJudge = (await (await fetch(`/votes/judge/${judgeId}`)).json()).map(game => game.game);
        const allGames = await (await fetch('/games')).json();
        renderCards(allGames,votedGamesByJudge);
    } catch (error) {
        console.error("Error cargando los juegos:", error);
    }
}

function getJudgeIdFromLocalStorage() {
    const judgeId = localStorage.getItem('loggedInJudgeId');
    if (!judgeId) {
        console.error('No se encuentra id de juez en el local storage');
        return null;
    }
    return judgeId;
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

function openVoteModal(gameId) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalForm = document.createElement('form');
    modalForm.classList.add('modal-content');

    modalForm.innerHTML = `
        <input name="judge" class="inputHidden" id="judge" value="${getJudgeIdFromLocalStorage()}" disabled type="hidden">
        <br>

        <input name="game" class="inputHidden" id="game" value="${gameId}" type="hidden" disabled>
        <br>

        <label>Jugabilidad:</label>
        <input type="number" name="scores[gameplay]" id="gameplay" min="1" max="10" required>
        <br>

        <label>Arte:</label>
        <input type="number" name="scores[art]" min="1" id="art" max="10" required>
        <br>

        <label>Sonido:</label>
        <input type="number" name="scores[sound]" min="1" id="sound" max="10" required>
        <br>

        <label>Afinidad a la Temática:</label>
        <input type="number" name="scores[afinity]" min="1" id="afinity" max="10" required>
        <br>
    `;

    const   voteBtn = document.createElement('input');
            voteBtn.classList.add('btn','btn-green');
            voteBtn.type = 'submit';
            voteBtn.value = 'Enviar voto';
    const   btnClose = document.createElement('button');
            btnClose.innerHTML = '<span class="material-symbols-outlined">close</span>';
            btnClose.classList.add('btn', 'btn-green','btn-round','onlyClose');
            btnClose.addEventListener('click', function(e){
                e.preventDefault();
                modal.remove();
            });
    modalForm.addEventListener('submit', async function(e){
        e.preventDefault();
        try {
            await registerVote();
            populateGamesTable();
            modal.remove();
        } catch (error) {
            console.error('Error registrando el voto:', error);
        }
    });
    modalForm.appendChild(btnClose);
    modalForm.appendChild(voteBtn);
    modal.appendChild(modalForm);
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
    const judgeId = getJudgeIdFromLocalStorage();
    const votedGamesByJudge = (await (await fetch(`/votes/judge/${judgeId}`)).json()).map(game => game.game);
    const filteredGames = await (await fetch(`/games/genre/${genre}`)).json();
    document.getElementById('gameCards').innerHTML = '';
    renderCards(filteredGames,votedGamesByJudge);
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
                            
                                renderCards(allGames,votedGamesByJudge);
                                document.getElementById('secondHeader').removeChild(filterGenderPill);
    
                            });
                    filterGenderPill.appendChild(pillText);
                    filterGenderPill.appendChild(closeIcon);
            document.getElementById('secondHeader').appendChild(filterGenderPill);
        }

    }    

}

function renderCards(allGames,votedGamesByJudge){
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

            if (votedGamesByJudge.includes(game._id)) {
                gameCard.classList.add('votedGame');
                const   votedPill = document.createElement('span');
                        votedPill.innerText = '¡Votado!';
                        votedPill.classList.add('votedPill');
                gameCard.appendChild(votedPill);
            } else {
                const   voteOverlay = document.createElement('div');
                        voteOverlay.classList.add('voteOverlay');
                        voteOverlay.innerHTML = '<span>¡Votar!</span>';
                gameCard.appendChild(voteOverlay);
                voteOverlay.addEventListener('click', function(e){
                    e.preventDefault();
                    openVoteModal(game._id);
                })
            }

            gameCards.appendChild(gameCard);
        });
}