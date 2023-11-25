//VARIABLES DE CONTROL
let currentPage = 1; /* hay 42 */


//VARIABLES DE SELECCIÓN
let renderMoreButton = document.getElementById('render-more');
let gridContainer = document.getElementsByClassName('grid-container');
let pageNumber = document.getElementById('number-page');


//VARIABLES PARA EL MODAL

let triggerButton = document.getElementById('trigger');
let closeButton = document.getElementsByClassName('close-button');
let modal = document.getElementsByClassName('modal');
let modalContent = document.getElementsByClassName('modal-content');
let h1Modal = document.getElementsByTagName('h1')[1];



let card;
let section = document.getElementsByTagName('section');

let principalTitle = document.getElementsByTagName('h1')[0];


//conseguimos la pagina que queramos, en total 20 personajes
const getCharactersByPage = async () => {
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character?page=${currentPage}`);

        if (response.ok) {
            const jsonResponse = await response.json();
            /* console.log(jsonResponse); */
            return jsonResponse.results;
        }

    } catch (error) {
        console.log(error);
    }
}


//logica que nos crea una carta para un personaje

const createNewCard = (character) => {

    let imageUrl = character.image;

    //creamos el div con class card

    let divCard = document.createElement('div');
    divCard.className = 'card';

    //creamos el div thumbnail

    let divThumbnail = document.createElement('div');
    divThumbnail.className = 'thumbnail';

    //creamos el div item-0 que va dentro del thumbnail

    let divItem0 = document.createElement('div');
    divItem0.className = "item-0";

    divItem0.style.backgroundImage = `url(${imageUrl})`;
    //creamos el div class footer

    let divFooter = document.createElement('div');
    divFooter.className = 'card-footer';

    //creamos el div que tiene los items que va dentro del footer

    let divItems = document.createElement('div');

    //creamos los h3,h2 que van dentro del divItems

    let h3Item1 = document.createElement('h3');

    h3Item1.className = 'item-1';
    h3Item1.textContent = character.gender;

    let h3Item2 = document.createElement('h3');

    h3Item2.className = 'item-2';
    h3Item2.textContent = character.species;

    let h2Item3 = document.createElement('h2');

    h2Item3.className = 'item-3';
    h2Item3.textContent = character.name;

    let h3Item4 = document.createElement('h3');

    h3Item4.className = 'item-4';
    h3Item4.textContent = character.status;

    //creamos el div botonera que va dentro del footer

    divBotonera = document.createElement('div');

    divBotonera.className = 'botonera';

    //creamo el divTrigger que va dentro de botonera

    divTrigger = document.createElement('div');

    divTrigger.id = 'trigger';
    divTrigger.textContent = 'AMPLIAR';

    //MONTAMOS ESTRUCTURA

    divThumbnail.appendChild(divItem0);

    //añadimos los items al divItems

    divItems.appendChild(h3Item1);
    divItems.appendChild(h3Item2);
    divItems.appendChild(h2Item3);
    divItems.appendChild(h3Item4);

    //añadimos el trigger a la botonera

    divBotonera.appendChild(divTrigger);

    //añadimos el divItems y el divBotonera al divFooter

    divFooter.insertAdjacentElement('afterbegin', divItems);
    divFooter.insertAdjacentElement('beforeend', divBotonera);

    //añadimos el divThumbnail al div card

    divCard.insertAdjacentElement('afterbegin', divThumbnail);

    //añadimos el divFooter al divCard

    divCard.insertAdjacentElement('beforeend', divFooter);

    //POR ÚLTIMO AÑADIMOS EL DIVCARD AL GRIDCONTAINER;

    gridContainer[0].appendChild(divCard);

    return divCard;

}

const createInitials = async () => {
    // Definimos la página
    pageNumber.textContent = currentPage;

    try {
        let charactersPerPage = await getCharactersByPage(currentPage);

        charactersPerPage.forEach((character, index) => {
            card = createNewCard(character);

            if (index >= 3) {
                card.style.display = 'none';
            }
        });

        // A partir de aquí seleccionamos todos los triggers añadiéndoles un evento de escucha y llamando a modal pasándole el personaje que toca
        const divTriggers = document.querySelectorAll('.botonera #trigger');

        divTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => {
                showModal(charactersPerPage[index]);
            });
        });

        manipulateAllNames();

        //PRUEBA LOCAL STORAGE

        const nameTitles = document.querySelectorAll('.item-3');

        nameTitles.forEach((title, index) => {

            title.addEventListener('click', () => {
                console.log(`Clic en el título ${index}`);
                saveStorage(charactersPerPage[index]);
            });
        });


    } catch (error) {
        console.log(error);
    }
};


const changeDisplay = () => {
    const hiddenCards = document.querySelectorAll('.card[style*="display: none"]');

    hiddenCards.forEach(card => {
        card.style.display = 'block';
    });


    manipulateAllNames();


    // Obtener el div con el id 'handler'
    let divHandler = document.getElementById('handler');

    // Cambiar la visibilidad del div 'handler'
    if (divHandler.style.display === 'none') {
        divHandler.style.display = 'block';
    } else {
        divHandler.style.display = 'none';
    }

    // Obtener el div con el id 'render-more'
    let divRenderMore = document.getElementById('render-more');

    // Ocultar el div 'render-more'
    divRenderMore.style.display = 'none';

}

const createDiv = () => {
    // Ocultamos el renderMore MOSTRAR MAS Y creamos el otro
    /* renderMoreButton.style.display = 'none'; */

    // Creamos el nuevo div container
    let divContainer = document.createElement('div');
    divContainer.id = 'handler';

    let renderMoreDiv = document.createElement('div');
    renderMoreDiv.id = 'render-more';

    // Crear el botón next
    let nextButton = document.createElement('button');
    nextButton.id = 'next';
    nextButton.textContent = 'Siguientes';

    //crear el boton previous

    let previousButton = document.createElement('button');
    previousButton.id = 'previous';
    previousButton.textContent = 'Anterior';


    // Agregar el botón al elemento div renderMoreDiv
    renderMoreDiv.appendChild(previousButton);
    renderMoreDiv.appendChild(nextButton);

    // Agregar el renderMoreDiv al divContainer
    divContainer.appendChild(renderMoreDiv);

    // Agregar el elemento divContainer al documento
    section[1].insertAdjacentElement('beforeend', divContainer);

}


const nextPage = () => {


    deleteAllCards();

    currentPage++;

    pageNumber.textContent = currentPage;

    createInitials();

    divHandler = document.getElementById('handler');
    divHandler.style.display = 'none';

    divRenderMore = document.getElementById('render-more');
    divRenderMore.style.display = 'block';

    if (currentPage >= 2) {
        let previousButton = document.getElementById('previous');
        previousButton.removeAttribute('style');
    }

    if (currentPage === 42) {
        let nextButton = document.getElementById('next');
        nextButton.style.display = 'none';
    }


}

const previousPage = () => {


    deleteAllCards();

    currentPage--;

    pageNumber.textContent = currentPage;

    createInitials();

    divHandler = document.getElementById('handler');
    divHandler.style.display = 'none';

    divRenderMore = document.getElementById('render-more');
    divRenderMore.style.display = 'block';

    if (currentPage === 1) {
        let previousButton = document.getElementById('previous');
        previousButton.style.display = 'none';
    }

}


//Funciones para la lógica Modal

const showModal = async (character) => {
    console.log('modal activado');
    modal[0].classList.add('show-modal');

    // Obtenemos la URL de la imagen del personaje
    let imageUrl = character.image;

    //Obtenemos el nombre del personaje

    let name = character.name;

    // Establecemos la imagen de fondo
    modalContent[0].style.backgroundImage = `url(${imageUrl})`;
    modalContent[0].style.backgroundSize = 'cover';
    modalContent[0].style.backgroundRepeat = 'no-repeat';
    modalContent[0].style.backgroundPosition = 'center';

    //Establecemos el nombre del personaje

    h1Modal.textContent = name;
}


const closeModal = () => {
    console.log('modal desactivado');
    modal[0].classList.remove('show-modal');
}

const deleteAllCards = () => {
    let allCards = document.querySelectorAll('.card');

    allCards.forEach(card => {
        card.remove();
    })
}

const manipulateAllNames = () => {

    let nameElements = document.getElementsByClassName('item-3');


    Array.from(nameElements).forEach((nameElement) => {
        manipulateName(nameElement);
    });
};

const manipulateName = (nameElement) => {
    let realName = nameElement.textContent;

    let indexLetterName = 0;
    let counter = 0;

    nameElement.textContent = '';

    const intervalName = setInterval(() => {

        counter++;

        
        if (counter === 10) {
            nameElement.textContent = realName.slice(0, indexLetterName + 1);

            indexLetterName++;
            counter = 0;
        }

        if (indexLetterName === realName.length) {
            clearInterval(intervalName);
        }
    }, 20);

}

//STORAGE: GUARDAMOS LOS DATOS EN EL LOCAL STORAGE

const saveStorage = async (character) => {

    console.log('Guardando en localStorage:', character.name);

    // Obtenemos la URL de la imagen del personaje
    let imageUrl = character.image;

    //Obtenemos el nombre del personaje

    let name = character.name;

    //obtenemos el genero

    let gender = character.gender;

    //obtenemos el status

    let status = character.status;

    //obtenemos la specie

    let specie = character.species;

    const characterData = {
        image :imageUrl,
        name : name,
        gender: gender,
        status: status,
        species: specie,
    };

    //convertimos el objeto a json y lo almacenamos en local storage
    localStorage.setItem(name, JSON.stringify(characterData));

}

const favourites = () => {
    // Obtenemos todas las claves almacenadas en localStorage
    const storedKeys = Object.keys(localStorage);

    // Creamos un array para almacenar los personajes recuperados del localStorage
    const characters = [];

    // Recorremos las claves y obtenemos los datos de cada personaje
    storedKeys.forEach(name => {
        const characterDataString = localStorage.getItem(name);

        const characterData = JSON.parse(characterDataString);
        
        if (characterData) {
            characters.push(characterData);
        }
    });

    // Eliminamos las cartas existentes en la página
    deleteAllCards();

    //Cambiamos el titulo por 'Página favoritos'

    pageNumber.textContent = 'Favoritos';

    console.log(characters);

    // Creamos las nuevas cartas para los personajes recuperados del localStorage
    characters.forEach(character => {
        createNewCard(character);
    });

    //añadimos el event listener a los botones para ampliar

    const divTriggers = document.querySelectorAll('.botonera #trigger');

    divTriggers.forEach((trigger, index) => {
        trigger.addEventListener('click', () => {
            showModal(characters[index]);
        });
    });

    renderMoreButton.innerHTML = '<button>VOLVER</button>';

    let idHandler = document.getElementById('handler');

    if (idHandler) {
        idHandler.style.display = 'none';

        renderMoreButton.style.display = 'block';
    }

    renderMoreButton.addEventListener('click', () => {
        location.reload();
    });

};


//CUANDO EL DOCUMENTO ESTE CARGADO ME DETECTARÁ LOS BOTONES
document.addEventListener('DOMContentLoaded', () => {



    divHandler = document.getElementById('handler');
    divHandler.style.display = 'none';

    //llamamos a los restantes
    renderMoreButton.addEventListener('click', changeDisplay);

    let nextButton = document.getElementById('next');
    let previousButton = document.getElementById('previous');

    if (currentPage === 1) {
        previousButton.style.display = 'none';
    } else {
        previousButton.style.display = 'block';
    }

    if (nextButton) {
        nextButton.addEventListener('click', nextPage);
    }

    if (previousButton) {
        previousButton.addEventListener('click', previousPage);
    }

    deleteAllCards();

    createInitials();

    closeButton[0].addEventListener('click', closeModal);

});


createDiv();

// Agregamos un evento de clic al título para mostrar las cartas de los favoritos

principalTitle.addEventListener('click', favourites);

