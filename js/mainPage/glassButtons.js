document.addEventListener('DOMContentLoaded', function() {

    document.body.addEventListener('click', function(event) {

        if (event.target.id === 'spawnMap' || event.target.id === 'spawnMapImg') {
            window.location.href = 'spawnMap.html';
        }
        if (event.target.id === 'newsButton' || event.target.id === 'newsButtonImg') {
            window.location.href = 'news.html';
        }
    });
});