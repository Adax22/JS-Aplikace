let cacheData = null; // Zde uložíme data stažená ze serveru

// 1. AJAX - Načtení dat ze serveru
async function loadData() {
    try {
        const response = await fetch('data.json'); 
        if (!response.ok) throw new Error("Data se nepodařilo stáhnout");
        
        cacheData = await response.json();
        document.getElementById('resultDisplay').textContent = "Připraveno ke generování";
        
        // Aktivujeme tlačítko po načtení dat
        document.getElementById('generateBtn').disabled = false;
        document.getElementById('generateBtn').textContent = "Generovat!";
    } catch (error) {
        document.getElementById('resultDisplay').textContent = "Chyba při načítání dat.";
        console.error(error);
    }
}

// Přepínání režimů
document.getElementById('modeSingle').onclick = () => {
    document.getElementById('sectionSingle').style.display = 'block';
    document.getElementById('sectionHero').style.display = 'none';
    document.getElementById('modeSingle').classList.add('active-mode');
    document.getElementById('modeHero').classList.remove('active-mode');
};

document.getElementById('modeHero').onclick = () => {
    document.getElementById('sectionSingle').style.display = 'none';
    document.getElementById('sectionHero').style.display = 'block';
    document.getElementById('modeHero').classList.add('active-mode');
    document.getElementById('modeSingle').classList.remove('active-mode');
};

// Pomocná funkce pro získání náhodného řetězce z kategorií
function getRandomValue(type) {
    const category = cacheData[type];
    if (category.type === "combine") {
        const pre = category.prefix[Math.floor(Math.random() * category.prefix.length)];
        const suf = category.suffix[Math.floor(Math.random() * category.suffix.length)];
        return pre + suf;
    } else {
        return category.items[Math.floor(Math.random() * category.items.length)];
    }
}

// Generování celého hrdiny
document.getElementById('generateHeroBtn').onclick = () => {
    const race = document.getElementById('heroRaceSelect').value;
    const name = getRandomValue(race);
    const origin = getRandomValue('puvod');
    const secret = getRandomValue('tajemstvi');

    document.getElementById('heroName').textContent = name;
    document.getElementById('heroOrigin').textContent = origin;
    document.getElementById('heroSecret').textContent = secret;
    
    addToHistory(`Hrdina: ${name} (${race}), původem z ${origin}`);
};

// Funkce pro změnu pouze jedné části (reroll)
function reroll(part) {
    if (!cacheData) return;
    let newValue = "";
    if (part === 'name') {
        const race = document.getElementById('heroRaceSelect').value;
        newValue = getRandomValue(race);
        document.getElementById('heroName').textContent = newValue;
    } else if (part === 'origin') {
        newValue = getRandomValue('puvod');
        document.getElementById('heroOrigin').textContent = newValue;
    } else if (part === 'secret') {
        newValue = getRandomValue('tajemstvi');
        document.getElementById('heroSecret').textContent = newValue;
    }
}

// 2. Logika generování (Upraveno pro nový JSON a více kategorií)
function generate() {
    if (!cacheData) return;

    const type = document.getElementById('typeSelect').value;
    const category = cacheData[type];
    let finalString = "";

    // Pokud je to kategorie typu 'combine' (elf, trpaslík, vlkodlak)
    if (category.type === "combine") {
        const pre = category.prefix[Math.floor(Math.random() * category.prefix.length)];
        const suf = category.suffix[Math.floor(Math.random() * category.suffix.length)];
        finalString = pre + suf;
    } 
    // Pokud je to kategorie typu 'list' (upír, kouzelník, původ, tajemství)
    else if (category.type === "list") {
        finalString = category.items[Math.floor(Math.random() * category.items.length)];
    }

    document.getElementById('resultDisplay').textContent = finalString;
    addToHistory(finalString);
}

// 3. Local Storage - Práce s historií
function addToHistory(item) {
    let history = JSON.parse(localStorage.getItem('fantasyHistory')) || [];
    
    history.unshift(item);
    if (history.length > 10) history.pop();
    
    localStorage.setItem('fantasyHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const listElement = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('fantasyHistory')) || [];
    
    listElement.innerHTML = history
        .map(item => `<li>${item}</li>`)
        .join('');
}

// 4. Event Listenery
document.getElementById('generateBtn').addEventListener('click', generate);
document.getElementById('clearBtn').addEventListener('click', () => {
    localStorage.removeItem('fantasyHistory');
    renderHistory();
});

// Inicializace
loadData();
renderHistory();