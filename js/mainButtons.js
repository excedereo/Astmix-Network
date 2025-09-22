// mainButtons.js
// Карта Спавна
const spawnMapButton = document.getElementById('spawnMap');
spawnMapButton.addEventListener('click', function() {
    window.location.href = 'spawnMap.html';
    console.log("переход на spawnMap.html")
});

// Онлайн Карта
const onlineMapButton = document.getElementById('onlineMap');
onlineMapButton.addEventListener('click', function() {
    window.open('http://astmix.net:25863/', '_blank');
});

// Википедия
const wikiButton = document.getElementById('wikiButton');
wikiButton.addEventListener('click', function() {
    window.open('https://astmix-network.gitbook.io/astmix-network', '_blank');
});