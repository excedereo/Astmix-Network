document.addEventListener('DOMContentLoaded', function() {

    document.body.addEventListener('click', function(event) {

        if (event.target.id === 'spawnMap' || event.target.id === 'spawnMapImg') {
            window.location.href = 'spawnMap.html';
        }
    });
});