const formSelect = document.querySelector('#formSelect');
const nameInput = document.querySelector('#nameInput');
const positionInput = document.querySelector('#positionInput');
const countryInput = document.querySelector('#countryInput');
const editInput = document.querySelector('#editInput');
const idInput = document.querySelector('#idInput');
const submitButton = document.querySelector('#submitButton');
const contentParticipants = document.querySelector('.div-participants');

formSelect.addEventListener('submit', function(e) {
    e.preventDefault();

    if (nameInput.value === '' || positionInput.value === '' || countryInput.value === '') {
        alert('Todos los campos son obligatorios.');
        return;
    }

    if (editInput.value === '0') {
        newParticipant();
    } else {
        updateParticipant();
    }

    displayParticipants();
    clearForm();
});


function newParticipant() {
    let localParticipants = JSON.parse(localStorage.getItem('listparticipants')) || [];

    const participant = {
        id: Date.now(),
        name: nameInput.value,
        position: positionInput.value,
        country: countryInput.value,
    };

    localParticipants.push(participant);
    localStorage.setItem('listparticipants', JSON.stringify(localParticipants));
}

function updateParticipant() {
    const participant = {
        name: nameInput.value,
        position: positionInput.value,
        country: countryInput.value,
    };

    let listParticipants = JSON.parse(localStorage.getItem('listparticipants')) || [];
    const index = listParticipants.findIndex((participante) => participante.id === parseInt(idInput.value));

    if (index !== -1) {
        listParticipants[index] = { ...listParticipants[index], ...participant };
        localStorage.setItem('listparticipants', JSON.stringify(listParticipants));
    }
}

function delParticipant(event, id) {
    event.preventDefault();

    const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar este registro?');
    if (!confirmacion) {
        return;
    }

    let listParticipants = JSON.parse(localStorage.getItem('listparticipants')) || [];
    const index = listParticipants.findIndex((participante) => participante.id === id);

    if (index !== -1) {
        listParticipants.splice(index, 1);
        localStorage.setItem('listparticipants', JSON.stringify(listParticipants));
    }

    displayParticipants();
    clearForm();
}

function editParticipants(event, id) {
    event.preventDefault();

    let listParticipants = JSON.parse(localStorage.getItem('listparticipants')) || [];
    const participant = listParticipants.find((participante) => participante.id === id);

    if (participant) {
        const { name, position, country } = participant;

        nameInput.value = name;
        positionInput.value = position;
        countryInput.value = country;
        editInput.value = '1';
        idInput.value = id;

        submitButton.innerText = 'Editar';
    }
}

function displayParticipants() {
    let listParticipants = JSON.parse(localStorage.getItem('listparticipants')) || [];

    const participantsHTML = listParticipants.map((participant) => {
        return `${participant.name} ${participant.position} ${participant.country} <a href="#" data-id="${participant.id}" class="edit-link">Editar</a> <a href="#" data-id="${participant.id}" class="delete-link">Eliminar</a><br>`;
    });

    contentParticipants.innerHTML = participantsHTML.join('');

    const editLinks = document.querySelectorAll('.edit-link');
    editLinks.forEach((link) => {
        link.addEventListener('click', (e) => editParticipants(e, parseInt(link.getAttribute('data-id'))));
    });

    const deleteLinks = document.querySelectorAll('.delete-link');
    deleteLinks.forEach((link) => {
        link.addEventListener('click', (e) => delParticipant(e, parseInt(link.getAttribute('data-id'))));
    });
}

function clearForm() {
    editInput.value = '0';
    idInput.value = '0';
    submitButton.innerText = 'Agregar';
    formSelect.reset();
}

document.addEventListener('DOMContentLoaded', () => {
    displayParticipants();
});
