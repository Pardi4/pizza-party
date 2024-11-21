const fetch = require('node-fetch');
const { fork } = require('child_process');
const fs = require('fs');

async function getData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json(); 
    } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
        return [];
    }
}
function saveLastRunTime() {
    const lastRunTime = new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' }); 

    let lastRuns = [];
    try {
        const data = fs.readFileSync('lastRun.json', 'utf8');
        lastRuns = JSON.parse(data).lastRunTimes || [];
    } catch (error) {
        console.log("Plik nie istnieje, utworzymy nowy.");
    }

    lastRuns.push({ lastRunTime });

    const updatedData = { lastRunTimes: lastRuns };
    fs.writeFileSync('lastRun.json', JSON.stringify(updatedData, null, 2));
}

async function displayTable(url) {
    const data = await getData(url);
    if (data.length === 0) {
        console.log('Brak danych do wyświetlenia.');
        return;
    }
    
    for (let i = 0; i < data.length; i++) {
        OpenExpcase(data[i].token);
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
    saveLastRunTime()
}

function OpenExpcase(token) {
    const worker = fork('./expcases.js');
    worker.send({ token });
}
function startInterval() {
    const url = 'https://pardi.fun/g4bot/json/data.json';

    displayTable(url);
    setInterval(async () => {
        console.log('Uruchamianie procesu...');
        await displayTable(url);
    }, 6 * 60 * 60 * 1000 + 5 * 60 * 1000);  // 6 godzin i 5 minut
}
startInterval();
