// createBlocks.js
const zoomMultiplier = 5;

function createBlocks() {
    if (!window.blocksData || !window.mapCenter) {
        console.error('Данные не загружены!');
        setTimeout(createBlocks, 100);
        return;
    }

    const spawnMap = document.querySelector('.spawnMap');
    if (!spawnMap) {
        console.error('Контейнер не найден!');
        return;
    }

    // Устанавливаем размер большой карты 6000x6000
    spawnMap.style.width = '6000px';
    spawnMap.style.height = '6000px';

    const pageWidth = 6000; // Теперь 6000px
    const pageHeight = 6000;
    const centerX = pageWidth / 2; // Центр большой карты (3000, 3000)
    const centerY = pageHeight / 2;

    // 1. ВСЕ дороги с общими контейнерами
    if (window.roadData) {
        window.roadData.forEach(road => {
            const offsetX = road.x1 - window.mapCenter.x;
            const offsetY = road.y1 - window.mapCenter.y;
            const width = Math.abs(road.x2 - road.x1) * zoomMultiplier;
            const height = Math.abs(road.y2 - road.y1) * zoomMultiplier;
            const left = centerX + (offsetX * zoomMultiplier);
            const top = centerY + (offsetY * zoomMultiplier);

            // 1.1 Общий контейнер для дороги
            const roadContainer = document.createElement('div');
            roadContainer.className = 'road-container';
            roadContainer.style.left = (left - 2) + 'px';
            roadContainer.style.top = (top - 2) + 'px';
            roadContainer.style.width = (width + 4) + 'px';
            roadContainer.style.height = (height + 4) + 'px';
            roadContainer.style.position = 'absolute';
            roadContainer.setAttribute('data-id', road.id);
            roadContainer.setAttribute('data-name', road.name);
            roadContainer.setAttribute('data-roadColor', road.hoverColor);

            // 1.2 Фон дороги
            const roadBackground = document.createElement('div');
            roadBackground.className = 'roadBackground';
            roadBackground.style.width = '100%';
            roadBackground.style.height = '100%';
            roadBackground.style.position = 'absolute';
            roadBackground.style.setProperty('--hover-color', road.hoverColor || '#f2c55c');

            // 1.3 Основная дорога
            const roadElement = document.createElement('div');
            roadElement.className = 'road';
            roadElement.style.left = '2px';
            roadElement.style.top = '2px';
            roadElement.style.width = (width) + 'px';
            roadElement.style.height = (height) + 'px';
            roadElement.style.position = 'absolute';


            // Добавляем элементы в контейнер
            roadContainer.appendChild(roadBackground);
            roadContainer.appendChild(roadElement);

            // Добавляем контейнер на карту
            spawnMap.appendChild(roadContainer);
        });
    }

    // 2. Территории
    window.blocksData.forEach(block => {
        const offsetX = block.x1 - window.mapCenter.x;
        const offsetY = block.y1 - window.mapCenter.y;
        const width = Math.abs(block.x2 - block.x1) * zoomMultiplier;
        const height = Math.abs(block.y2 - block.y1) * zoomMultiplier;
        const left = centerX + (offsetX * zoomMultiplier);
        const top = centerY + (offsetY * zoomMultiplier);

        const blockElement = document.createElement('div');
        blockElement.className = 'territory';
        blockElement.style.left = left + 'px';
        blockElement.style.top = top + 'px';
        blockElement.style.width = width + 'px';
        blockElement.style.height = height + 'px';
        blockElement.style.position = 'absolute';
        blockElement.innerHTML = block.id;


        const dateString = block.arendTill
        const [day, month, year] = dateString.split('.').map(Number);
        const targetDate = new Date(year, month - 1, day);
        const today = new Date();
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        isRented = false;
        if (block.rentedBy != "") {
            isRented = true;
        }

        if (block.rentedBy == "public") {
            blockElement.className = "territory territory-public"
            blockElement.setAttribute('data-public', true );
        } else if (isRented){
            if (diffDays < 0) {
                blockElement.className = "territory territory-Expired"
                blockElement.setAttribute('data-expired', true)
            } else if (diffDays < 7) {
                blockElement.className = "territory territory-Deadline"
            }
        } else {
            blockElement.className = "territory territory-Empty"
        }

        blockElement.setAttribute('data-id', block.id);
        blockElement.setAttribute('data-name', block.name);
        blockElement.setAttribute('data-x1', block.x1);
        blockElement.setAttribute('data-y1', block.y1);
        blockElement.setAttribute('data-x2', block.x2);
        blockElement.setAttribute('data-y2', block.y2);
        blockElement.setAttribute('data-price', block.price);
        blockElement.setAttribute('data-rentedBy', block.rentedBy || '');
        blockElement.setAttribute('data-arendTill', block.arendTill || '');
        blockElement.setAttribute('data-arendatorName', block.arendatorName || '');
        blockElement.setAttribute('data-isRented', isRented );
        if (block.description != "") {
            blockElement.setAttribute('data-description', block.description)
        }




        spawnMap.appendChild(blockElement);
    });

    // Центральная точка
    const centerDot = document.createElement('div');
    centerDot.id = 'mapCenterDot';
    centerDot.style.position = 'absolute';
    centerDot.style.left = centerX + 'px'; // Центр большой карты
    centerDot.style.top = centerY + 'px';
    centerDot.style.width = '10px';
    centerDot.style.height = '10px';
    centerDot.style.background = 'red';
    centerDot.style.borderRadius = '50%';
    centerDot.style.zIndex = '1000';
    spawnMap.appendChild(centerDot);

    console.log('Красная точка создана в центре большой карты:', centerX, centerY);
}

window.addEventListener('load', function() {
    setTimeout(createBlocks, 100);
});