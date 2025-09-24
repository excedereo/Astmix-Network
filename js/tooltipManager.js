// tooltipManager.js
function initTooltips() {
    setTimeout(() => {
        document.querySelectorAll('.territory').forEach(territory => {
            setupTooltip(territory);
        });
        document.querySelectorAll('.road-container').forEach(road => {
            setupTooltip(road);
        });
        console.log('Тултипы инициализированы');
    }, 300);
}

function setupTooltip(element) {
    const tooltip = document.createElement('div');
    tooltip.className = 'mapTooltip';


    // Получение данных
    const id = element.getAttribute('data-id');
    const name = element.getAttribute('data-name');
    const x1 = element.getAttribute('data-x1');
    const y1 = element.getAttribute('data-y1');
    const x2 = element.getAttribute('data-x2');
    const y2 = element.getAttribute('data-y2');
    const price = element.getAttribute('data-price');
    const rentedBy = element.getAttribute('data-rentedBy');
    const arendTill = element.getAttribute('data-arendtill');
    const arendatorName = element.getAttribute('data-arendatorName');
    const isRented = element.getAttribute('data-isRented');
    const roadColor = element.getAttribute('data-roadColor');

    const descriptionBlock = element.getAttribute('data-description')

    rentStatus = "Арендован";
    if (element.getAttribute('data-expired') == "true") {
        rentStatus = "Просрочен";

    }
    // Вариант 1) Публичный сектор
    if (element.getAttribute('data-public') == "true") {
        tooltip.innerHTML = `
        <div><strong>${name}</strong> <span style="color: #333333;">(Сектор: ${id})</span></div>
        <div style="color: #548af7;">Публичный</div>
        <br>
        <div class="mapTooltipDescription"> ${descriptionBlock || 'Без описания'}</div>
        <br>
        <div style="font-size: 10px; color: #888888;">Координаты: ${x1}, ${y1} - ${x2}, ${y2}</div>
    `;
    // Вариант 2) Арендованный сектор
    } else if (isRented == "true") {
        tooltip.innerHTML = `
        <div><strong>${name}</strong> <span style="color: #333333;">(Сектор: ${id})</span></div>
        <div style="color: #fd1c49;">${rentStatus}</div>
        <div>Владелец: ${arendatorName || 'Не указан'}</div>
        <div>До: ${arendTill || 'Не указано'}</div>
        <br>
        <div class="mapTooltipDescription"> ${descriptionBlock || 'Без описания'}</div>
        <br>
        <div style="font-size: 10px; color: #888888;">Координаты: ${x1}, ${y1} - ${x2}, ${y2}</div>
    `;
    // Вариант 3) Дорога
    } else if (isRented == null) {
            tooltip.innerHTML = `
            <div><strong><span style="color: ${roadColor};">${name}</span></strong></div>
            `;
    // Вариант 4) Свободный сектор
    } else {
            tooltip.innerHTML = `
            <div><strong>${name}</strong> <span style="color: #333333;">(Сектор: ${id})</span></div>
            <div style="color: #689d61;">Свободен </div>
            <div style="font-size: 16px;">Стоимость: ${price} <img src="img/diamondOre.png" style="height: 20px; vertical-align: middle;"> / неделя</div>
            <br>
            <div style="font-size: 10px; color: #888888;">Координаты: ${x1}, ${y1} - ${x2}, ${y2}</div>
            `;
    }




    document.body.appendChild(tooltip);

    element.addEventListener('mouseenter', (e) => {
        tooltip.style.display = 'block';
        updateTooltipPosition(tooltip, e);
    });

    element.addEventListener('mousemove', (e) => {
        updateTooltipPosition(tooltip, e);
    });

    element.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
}

function updateTooltipPosition(tooltip, event) {
    tooltip.style.left = (event.clientX + 15) + 'px';
    tooltip.style.top = (event.clientY + 15) + 'px';
}


window.addEventListener('load', function() {
    setTimeout(initTooltips, 500);
});