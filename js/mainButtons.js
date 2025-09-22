
const onlineMapButton = document.getElementById('onlineMap');

onlineMapButton.addEventListener('click', function() {
    window.open('http://astmix.net:25863/', '_blank');
});

const spawnMapButton = document.getElementById('spawnMap');

spawnMapButton.addEventListener('click', function() {
    window.location.href = 'spawnMap.html';
    console.log("переход на spawnMap.html")
});