// Простой вариант
const map = document.querySelector('.map-content');
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0, scale = 1;

document.querySelector('.map').addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    map.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
});

document.addEventListener('mouseup', () => isDragging = false);

// Зум колесиком
document.querySelector('.map').addEventListener('wheel', (e) => {
    e.preventDefault();
    scale += e.deltaY > 0 ? -0.1 : 0.1;
    scale = Math.max(0.5, Math.min(3, scale));
    map.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
});