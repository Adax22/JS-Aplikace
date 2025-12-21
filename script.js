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