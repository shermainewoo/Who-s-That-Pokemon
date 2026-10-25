//DOM ELEMENTS
const resultElement = document.getElementById("result");
const pokemonImageElement = document.getElementById("pokemonImage");
const optionsContainer = document.getElementById("options");
const pointsElement = document.getElementById("pointsValue");
const totalCount = document.getElementById("totalCount");
const mainContainer = document.getElementsByClassName("container");
const loadingContainer = document.getElementById("loadingContainer");

// VARIABLES

let usedPokemonIds=[];
let count = 0;
let points = 0;
let showLoading = false;
let idPool = buildIdPool(loadSelectedGenerations());
let nextQuestionTimeout;

// MAIN 

async function fetchPokemonById(id) {
    showLoading = true;
    const response = await fetch (`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data;
}

async function loadPokemonWithOptions(){
if (showLoading){
    showLoadingWindow();
    hidePuzzleWindow();
}

if (usedPokemonIds.length >= idPool.length - 4){
    usedPokemonIds = [];
}
    let pokemonId = getRandomPokemonId();
    while (usedPokemonIds.includes(pokemonId)){
        pokemonId = getRandomPokemonId();
    }

    usedPokemonIds.push(pokemonId);
    const pokemon = await fetchPokemonById(pokemonId);

    const options = [pokemon.name];
    const optionsIds = [pokemon.id];

    while (options.length < 4) {
        let randomPokemonId = getRandomPokemonId();
        while (optionsIds.includes(randomPokemonId)) {
            randomPokemonId = getRandomPokemonId();
        }
        optionsIds.push(randomPokemonId);

        const randomPokemon = await fetchPokemonById(randomPokemonId);
        const randomOption = randomPokemon.name;
        options.push(randomOption);

        if (options.length === 4){
            showLoading = false;
        }
    }

    shuffleArray(options);

    console.log(options);
    console.log(optionsIds);

    resultElement.textContent = "Who's that Pokemon?"
    pokemonImageElement.src = 
        pokemon.sprites.other.dream_world.front_default ||
        pokemon.sprites.other["official-artwork"].front_default ||
        pokemon.sprites.front_default;

    optionsContainer.innerHTML = "";
    options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = (event) => checkAnswer(option===pokemon.name, event);
        optionsContainer.appendChild(button);
    });

    if (!showLoading) {
        hideLoadingWindow();
        showPuzzleWindow();
    }
}

function checkAnswer(isCorrect, event) {
    const selectedButton = document.querySelector(".selected");

    if (selectedButton){
        return;
    }
    
    event.target.classList.add("selected");
    count += 1
    totalCount.textContent=count;

    if (isCorrect){
        displayResult("Correct Answer!");

        points++;
        pointsElement.textContent = points;
        event.target.classList.add("correct");
    } else {
        displayResult("Wrong Answer...");
        event.target.classList.add("wrong");
    }

    nextQuestionTimeout = setTimeout (() => {
        showLoading = true;
        loadPokemonWithOptions();
    }, 1000);
}

loadPokemonWithOptions();

//SETTINGS

const settingsButton = document.getElementById("settingsButton");
const settingsOverlay = document.getElementById("settingsOverlay");
const generationList = document.getElementById("generationList");
const settingsMessage = document.getElementById("settingsMessage");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");

function renderGenerationOptions() {
    const selected = loadSelectedGenerations();
    generationList.innerHTML = "";

    GENERATIONS.forEach((gen, index) => {
        const label = document.createElement("label");
        label.className = "gen-option";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = index;
        checkbox.checked = selected.includes(index);

        const text = document.createElement("span");
        text.textContent = `${gen.name} (#${gen.start} -${gen.end})`;

        label.append(checkbox, text);
        generationList.appendChild(label);
    });
}

function openSettings(){
    renderGenerationOptions();
    settingsMessage.textContent = "";
    settingsOverlay.classList.add("open");
}

function closeSettings(){
    settingsOverlay.classList.remove("open");
}

settingsButton.onclick = openSettings;
cancelButton.onclick = closeSettings;

settingsOverlay.onclick = (event) => {
    if (event.target === settingsOverlay) closeSettings();
};

saveButton.onclick = () => {
    const chosen = [...generationList.querySelectorAll("input:checked")]
        .map((c) => Number(c.value));
    
    if (chosen.length === 0){
        settingsMessage.textContent = "Pick at least one generation.";
        return;
    }

    saveSelectedGenerations(chosen);
    idPool = buildIdPool (chosen);

    clearTimeout(nextQuestionTimeout);
    usedPokemonIds=[];
    count = 0;
    points = 0;
    pointsElement.textContent = 0;
    totalCount.textContent = 0;

    closeSettings();
    showLoading = true;
    loadPokemonWithOptions();
};

// UTILITY FUNCTIONS

function getRandomPokemonId(){
    return idPool[Math.floor(Math.random() * idPool.length)];
}

function shuffleArray(array){
    return array.sort(() => Math.random() - 0.5);
}

function displayResult(result){
    resultElement.textContent = result;
}

function hideLoadingWindow() {
    loadingContainer.classList.add("hide");
}

function showLoadingWindow(){
    mainContainer[0].classList.remove("show");
    loadingContainer.classList.remove("hide");
    loadingContainer.classList.add("show");
}

function showPuzzleWindow(){
    loadingContainer.classList.remove("show");
    mainContainer[0].classList.remove("hide");
    mainContainer[0].classList.add("show");
}

function hidePuzzleWindow(){
    mainContainer[0].classList.add("hide");
}
// TEST
// async function testFetch(){
//     const pokemon = await fetchPokemonById(getRandomPokemonId());
//     console.log(pokemon);
// }

// testFetch()