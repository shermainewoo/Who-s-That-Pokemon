const GENERATIONS = [
    { name: "Kanto", start: 1, end: 151 },
    { name: "Johto", start: 152, end: 251 },
    { name: "Hoenn", start: 252, end: 386 },
    { name: "Sinnoh", start: 387, end: 493 },
    { name: "Unova", start: 494, end: 649 },
    { name: "Kalos", start: 650, end: 721 },
    { name: "Alola", start: 722, end: 809 },
    { name: "Galar", start: 810, end: 905 },
    { name: "Paldea", start: 906, end: 1025 },
]

const STORAGE_KEY = "pokemonGenerations";

function loadSelectedGenerations(){
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(saved)) {
            const valid = saved.filter((i) => Number.isInteger(i) && i>= 0 && i < GENERATIONS.length);
            if (valid.length) return valid;
        }
    } catch (e) {}
    return [0];
}

function saveSelectedGenerations(indexes) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(indexes));
    } catch (e) {}
}

function buildIdPool(selectedIndexes) {
    const ids = []
    selectedIndexes.forEach ((i) => {
        for (let id = GENERATIONS[i].start; id <= GENERATIONS[i].end; id++) ids.push(id);
    });
    return ids;
}