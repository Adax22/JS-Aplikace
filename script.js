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
    
    const raceSelect = document.getElementById('heroRaceSelect');
    const raceValue = raceSelect.value;
    const raceText = raceSelect.options[raceSelect.selectedIndex].text;
    
    const name = getRandomValue(raceValue);
    const origin = getRandomValue('puvod');
    const secret = getRandomValue('tajemstvi');

    document.getElementById('heroRaceDisplay').textContent = raceText;
    document.getElementById('heroName').textContent = name;
    document.getElementById('heroOrigin').textContent = origin;
    document.getElementById('heroSecret').textContent = secret;
    
    addToHistory(`Hrdina: ${name} (${raceText})`);
}

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

// --- NOVÁ FUNKCE: Hod kostkou pro D&D sekci ---
window.rollStat = function(statId) {
    // Generuje náhodné číslo 1 až 20
    const roll = Math.floor(Math.random() * 20) + 1;
    document.getElementById('stat-' + statId).value = roll;
};

// --- AKTUALIZOVANÉ PŘEPÍNÁNÍ SEKCE ---

function hideAllSections() {
    document.getElementById('sectionSingle').style.display = 'none';
    document.getElementById('sectionHero').style.display = 'none';
    document.getElementById('sectionDD').style.display = 'none';
    
    document.getElementById('btnShowSingle').classList.remove('active-mode');
    document.getElementById('btnShowHero').classList.remove('active-mode');
    document.getElementById('btnShowDD').classList.remove('active-mode');
}

document.getElementById('btnShowSingle').onclick = () => {
    hideAllSections();
    document.getElementById('sectionSingle').style.display = 'block';
    document.getElementById('btnShowSingle').classList.add('active-mode');
};

document.getElementById('btnShowHero').onclick = () => {
    hideAllSections();
    document.getElementById('sectionHero').style.display = 'block';
    document.getElementById('btnShowHero').classList.add('active-mode');
};

document.getElementById('btnShowDD').onclick = () => {
    hideAllSections();
    document.getElementById('sectionDD').style.display = 'block';
    document.getElementById('btnShowDD').classList.add('active-mode');
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

// Funkce pro stažení hrdiny
function downloadHero() {
    const race = document.getElementById('heroRaceDisplay').textContent;
    const name = document.getElementById('heroName').textContent;
    const origin = document.getElementById('heroOrigin').textContent;
    const secret = document.getElementById('heroSecret').textContent;

    if (name === "-") {
        return alert("Nejdříve vygeneruj hrdinu!");
    }

    const content = `--- FANTASY HRDINA ---\n\n` +
                    `Rasa: ${race}\n` +
                    `Jméno: ${name}\n` +
                    `Původ: ${origin}\n` +
                    `Tajemství: ${secret}\n\n`;
                        
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `Hrdina.txt`;
    link.click();
    URL.revokeObjectURL(url);
}

// Funkce pro stažení D&D postavy
function downloadDDHero() {
    const name = document.getElementById('ddName').value || "Bezejmenný hrdina";
    const race = document.getElementById('ddRace').value || "-";
    const profession = document.getElementById('ddClass').value || "-";
    const alignment = document.getElementById('ddAlignment').value || "-";
    const backstory = document.getElementById('ddBackstory').value || "Žádný příběh nebyl napsán.";

    // Statistiky
    const str = document.getElementById('stat-str').value;
    const dex = document.getElementById('stat-dex').value;
    const con = document.getElementById('stat-con').value;
    const int = document.getElementById('stat-int').value;
    const wis = document.getElementById('stat-wis').value;
    const cha = document.getElementById('stat-cha').value;

    const content = `--- D&D CHARACTER SHEET (2014) ---\n\n` +
                    `Name: ${name}\n` +
                    `Race: ${race}\n` +
                    `Class: ${profession}\n` +
                    `Alignment: ${alignment}\n\n` +
                    `--- STATS ---\n` +
                    `STR: ${str} | DEX: ${dex} | CON: ${con}\n` +
                    `INT: ${int} | WIS: ${wis} | CHA: ${cha}\n\n` +
                    `--- BACKSTORY ---\n` +
                    `${backstory}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `DD_Hrdina.txt`;
    link.click();

    URL.revokeObjectURL(url);
}

// Události
document.getElementById('generateBtn').addEventListener('click', generateSingle);
document.getElementById('generateHeroBtn').addEventListener('click', generateHero);
document.getElementById('clearBtn').addEventListener('click', () => {
    localStorage.removeItem('fantasyHistory');
    renderHistory();
});
document.getElementById('downloadHeroBtn').addEventListener('click', downloadHero);
document.getElementById('downloadDDBtn').addEventListener('click', downloadDDHero);

loadData();
renderHistory();