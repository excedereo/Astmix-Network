// mainButtons.js
document.addEventListener('DOMContentLoaded', function() {

    document.body.addEventListener('click', function(event) {

        if (event.target.id === 'spawnMap') {
            console.log('Переход на spawnMap.html');
            window.location.href = 'spawnMap.html';
        }

        if (event.target.id === 'openMain') {
            console.log('Переход на main.html');
            window.location.href = 'main.html';
        }
    });
});