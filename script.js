let cacheData = null;

// 1. AJAX - Načtení dat ze serveru
async function loadData() {
    try {
        const response = await fetch('data.json'); 
        if (!response.ok) throw new Error("Data se nepodařilo stáhnout");
        
        cacheData = await response.json();
        
        document.getElementById('resultDisplay').textContent = "Připraveno ke generování";
        document.getElementById('generateBtn').disabled = false;
        document.getElementById('generateBtn').textContent = "Generovat!";
        document.getElementById('generateHeroBtn').disabled = false;

    } catch (error) {
        document.getElementById('resultDisplay').textContent = "Chyba při načítání dat.";
        console.error(error);
    }
}

// Pomocná funkce pro náhodný výběr
function getRandomValue(type) {
    if (!cacheData || !cacheData[type]) return "Chyba";
    const category = cacheData[type];

    if (category.type === "combine") {
        const pre = category.prefix[Math.floor(Math.random() * category.prefix.length)];
        const suf = category.suffix[Math.floor(Math.random() * category.suffix.length)];
        return pre + suf;
    } else {
        return category.items[Math.floor(Math.random() * category.items.length)];
    }
}

// Režim: Jednotlivě
function generateSingle() {
    if (!cacheData) return;
    const type = document.getElementById('typeSelect').value;
    const result = getRandomValue(type);
    document.getElementById('resultDisplay').textContent = result;
    addToHistory(result);
}

// Režim: Kompletní hrdina
function generateHero() {
    if (!cacheData) return;
    const race = document.getElementById('heroRaceSelect').value;
    
    const name = getRandomValue(race);
    const origin = getRandomValue('puvod');
    const secret = getRandomValue('tajemstvi');

    document.getElementById('heroName').textContent = name;
    document.getElementById('heroOrigin').textContent = origin;
    document.getElementById('heroSecret').textContent = secret;
    
    addToHistory(`Hrdina: ${name} (${race})`);
}

// Funkce reroll (musí být v window, aby fungovala z HTML)
window.reroll = function(part) {
    if (!cacheData) return;
    if (part === 'name') {
        const race = document.getElementById('heroRaceSelect').value;
        document.getElementById('heroName').textContent = getRandomValue(race);
    } else if (part === 'origin') {
        document.getElementById('heroOrigin').textContent = getRandomValue('puvod');
    } else if (part === 'secret') {
        document.getElementById('heroSecret').textContent = getRandomValue('tajemstvi');
    }
};

// Přepínání sekcí
document.getElementById('btnShowSingle').onclick = () => {
    document.getElementById('sectionSingle').style.display = 'block';
    document.getElementById('sectionHero').style.display = 'none';
    document.getElementById('btnShowSingle').classList.add('active-mode');
    document.getElementById('btnShowHero').classList.remove('active-mode');
};

document.getElementById('btnShowHero').onclick = () => {
    document.getElementById('sectionSingle').style.display = 'none';
    document.getElementById('sectionHero').style.display = 'block';
    document.getElementById('btnShowHero').classList.add('active-mode');
    document.getElementById('btnShowSingle').classList.remove('active-mode');
};

// Local Storage
function addToHistory(item) {
    let history = JSON.parse(localStorage.getItem('fantasyHistory')) || [];
    history.unshift(item);
    if (history.length > 10) history.pop();
    localStorage.setItem('fantasyHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const listElement = document.getElementById('historyList');
    if (!listElement) return;
    const history = JSON.parse(localStorage.getItem('fantasyHistory')) || [];
    listElement.innerHTML = history.map(item => `<li>${item}</li>`).join('');
}

// Události
document.getElementById('generateBtn').addEventListener('click', generateSingle);
document.getElementById('generateHeroBtn').addEventListener('click', generateHero);
document.getElementById('clearBtn').addEventListener('click', () => {
    localStorage.removeItem('fantasyHistory');
    renderHistory();
});

loadData();
renderHistory();