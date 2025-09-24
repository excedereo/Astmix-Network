// mapNavigation.js
class MapNavigation {
    constructor() {
        this.mapContainer = document.querySelector('.spawnMap');
        this.scale = 1;

        this.mapWidth = 6000;
        this.mapHeight = 6000;
        this.updateMinScale();
        this.maxScale = 5;

        this.posX = 0;
        this.posY = 0;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;

        this.redDotX = 3000;
        this.redDotY = 3000;

        this.init();
    }

    updateMinScale() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const scaleByWidth = viewportWidth / this.mapWidth;
        const scaleByHeight = viewportHeight / this.mapHeight;

        this.minScale = Math.max(scaleByWidth, scaleByHeight);
    }

    init() {
        if (!this.mapContainer) {
            console.error('Контейнер карты не найден!');
            return;
        }

        this.updateMinScale();

        this.mapContainer.style.transformOrigin = '0 0';
        this.mapContainer.style.position = 'absolute';
        this.mapContainer.style.overflow = 'visible';
        this.mapContainer.style.cursor = 'default';

        this.addEventListeners();
        this.centerOnRedDot();
    }

    addEventListeners() {
        this.mapContainer.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
        document.addEventListener('wheel', this.zoom.bind(this), { passive: false });
        this.mapContainer.addEventListener('touchstart', this.touchStart.bind(this));
        this.mapContainer.addEventListener('touchmove', this.touchMove.bind(this));
        this.mapContainer.addEventListener('touchend', this.touchEnd.bind(this));
        this.mapContainer.addEventListener('dblclick', this.resetView.bind(this));
        this.mapContainer.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    startDrag(e) {
        if (e.button !== 0) return;

        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        this.mapContainer.style.cursor = 'move';
        e.preventDefault();
    }

    drag(e) {
        if (!this.isDragging) return;

        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;

        let newPosX = this.posX + deltaX;
        let newPosY = this.posY + deltaY;

        const correctedPos = this.checkBoundaries(newPosX, newPosY);

        this.posX = correctedPos.x;
        this.posY = correctedPos.y;

        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;

        this.updateTransform();
    }

    checkBoundaries(posX, posY) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const mapVisibleWidth = this.mapWidth * this.scale;
        const mapVisibleHeight = this.mapHeight * this.scale;

        let correctedX = posX;
        let correctedY = posY;

        if (mapVisibleWidth > viewportWidth) {
            correctedX = Math.min(0, Math.max(viewportWidth - mapVisibleWidth, posX));
        } else {
            correctedX = (viewportWidth - mapVisibleWidth) / 2;
        }

        if (mapVisibleHeight > viewportHeight) {
            correctedY = Math.min(0, Math.max(viewportHeight - mapVisibleHeight, posY));
        } else {
            correctedY = (viewportHeight - mapVisibleHeight) / 2;
        }

        return { x: correctedX, y: correctedY };
    }

    stopDrag() {
        this.isDragging = false;
        this.mapContainer.style.cursor = 'default';
    }

    zoom(e) {
        if (!this.isMouseOverMap(e)) return;

        e.preventDefault();
        e.stopPropagation();

        const zoomSpeed = 0.001;
        const delta = -e.deltaY * zoomSpeed;
        const limitedDelta = Math.sign(delta) * Math.min(Math.abs(delta), 0.1);

        const newScale = this.scale * (1 + limitedDelta);

        let finalScale = newScale;
        if (newScale < this.minScale) {
            finalScale = this.minScale;
        } else if (newScale > this.maxScale) {
            finalScale = this.maxScale;
        }

        if (finalScale === this.scale) return;

        const oldScale = this.scale;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const mouseXBefore = (mouseX - this.posX) / oldScale;
        const mouseYBefore = (mouseY - this.posY) / oldScale;

        this.scale = finalScale;

        const mouseXAfter = mouseXBefore * this.scale;
        const mouseYAfter = mouseYBefore * this.scale;

        let newPosX = mouseX - mouseXAfter;
        let newPosY = mouseY - mouseYAfter;

        const correctedPos = this.checkBoundaries(newPosX, newPosY);
        this.posX = correctedPos.x;
        this.posY = correctedPos.y;

        this.updateTransform();
    }

    isMouseOverMap(e) {
        const rect = this.mapContainer.getBoundingClientRect();
        return e.clientX >= rect.left && e.clientX <= rect.right &&
               e.clientY >= rect.top && e.clientY <= rect.bottom;
    }

    touchStart(e) {
        if (e.touches.length === 1) {
            this.startDrag({
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
            });
        } else if (e.touches.length === 2) {
            this.handlePinchStart(e);
        }
    }

    touchMove(e) {
        if (e.touches.length === 1) {
            this.drag({
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
            });
        } else if (e.touches.length === 2) {
            this.handlePinchMove(e);
        }
    }

    touchEnd() {
        this.stopDrag();
        this.isPinching = false;
    }

    handlePinchStart(e) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        this.pinchStartDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );
        this.isPinching = true;

        this.pinchCenterX = (touch1.clientX + touch2.clientX) / 2;
        this.pinchCenterY = (touch1.clientY + touch2.clientY) / 2;
    }

    handlePinchMove(e) {
        if (!this.isPinching) return;

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const currentDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );

        const zoom = currentDistance / this.pinchStartDistance;
        const newScale = this.scale * zoom;

        let finalScale = newScale;
        if (newScale < this.minScale) {
            finalScale = this.minScale;
        } else if (newScale > this.maxScale) {
            finalScale = this.maxScale;
        }

        if (finalScale !== this.scale) {
            const oldScale = this.scale;

            const mouseX = this.pinchCenterX;
            const mouseY = this.pinchCenterY;

            const mouseXBefore = (mouseX - this.posX) / oldScale;
            const mouseYBefore = (mouseY - this.posY) / oldScale;

            this.scale = finalScale;

            const mouseXAfter = mouseXBefore * this.scale;
            const mouseYAfter = mouseYBefore * this.scale;

            let newPosX = mouseX - mouseXAfter;
            let newPosY = mouseY - mouseYAfter;

            const correctedPos = this.checkBoundaries(newPosX, newPosY);
            this.posX = correctedPos.x;
            this.posY = correctedPos.y;

            this.updateTransform();
        }

        this.pinchStartDistance = currentDistance;

        this.pinchCenterX = (touch1.clientX + touch2.clientX) / 2;
        this.pinchCenterY = (touch1.clientY + touch2.clientY) / 2;
    }

    updateTransform() {
        this.mapContainer.style.transform = `translate(${this.posX}px, ${this.posY}px) scale(${this.scale})`;
        this.updateZoomInfo();
    }

    centerOnRedDot() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        this.posX = viewportWidth / 2 - this.redDotX * this.scale;
        this.posY = viewportHeight / 2 - this.redDotY * this.scale;

        const correctedPos = this.checkBoundaries(this.posX, this.posY);
        this.posX = correctedPos.x;
        this.posY = correctedPos.y;

        this.updateTransform();
    }

    resetView() {
        this.scale = 1;
        this.centerOnRedDot();
    }

    zoomIn() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        this.zoomToPoint(viewportWidth / 2, viewportHeight / 2, 1.2);
    }

    zoomOut() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        this.zoomToPoint(viewportWidth / 2, viewportHeight / 2, 0.8);
    }

    zoomToPoint(mouseX, mouseY, zoomFactor) {
        const newScale = this.scale * zoomFactor;

        let finalScale = newScale;
        if (newScale < this.minScale) {
            finalScale = this.minScale;
        } else if (newScale > this.maxScale) {
            finalScale = this.maxScale;
        }

        if (finalScale === this.scale) return;

        const oldScale = this.scale;

        const mouseXBefore = (mouseX - this.posX) / oldScale;
        const mouseYBefore = (mouseY - this.posY) / oldScale;

        this.scale = finalScale;

        const mouseXAfter = mouseXBefore * this.scale;
        const mouseYAfter = mouseYBefore * this.scale;

        let newPosX = mouseX - mouseXAfter;
        let newPosY = mouseY - mouseYAfter;

        const correctedPos = this.checkBoundaries(newPosX, newPosY);
        this.posX = correctedPos.x;
        this.posY = correctedPos.y;

        this.updateTransform();
    }

    updateZoomInfo() {
        const zoomLevel = document.getElementById('zoomLevel');
        if (zoomLevel) {
            zoomLevel.textContent = Math.round(this.scale * 100) + '%';
        }
    }

    handleResize() {
        this.updateMinScale();

        if (this.scale < this.minScale) {
            this.scale = this.minScale;
        }

        const correctedPos = this.checkBoundaries(this.posX, this.posY);
        this.posX = correctedPos.x;
        this.posY = correctedPos.y;

        this.updateTransform();
    }
}

let mapNavigation;

function initMapNavigation() {
    setTimeout(() => {
        mapNavigation = new MapNavigation();
        addZoomControls();
        preventPageScroll();
    }, 1500);
}

function addZoomControls() {
    const oldControls = document.querySelector('.zoom-controls');
    if (oldControls) oldControls.remove();

    const controlsHTML = `
        <div class="zoom-controls">
            <button class="zoom-btn" id="zoomIn">+</button>
            <button class="zoom-btn" id="zoomOut">-</button>
            <button class="zoom-btn" id="resetView">⟲</button>
            <div class="zoom-info">Масштаб: <span id="zoomLevel">100%</span></div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', controlsHTML);

    const style = document.createElement('style');
    style.textContent = `
        .zoom-controls {
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 1999;
            display: flex;
            flex-direction: column;
            gap: 5px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #333;
        }
        .zoom-btn {
            width: 40px;
            height: 40px;
            background: rgba(51, 51, 51, 0.9);
            color: white;
            border: 1px solid #555;
            border-radius: 5px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .zoom-btn:hover {
            background: rgba(234, 158, 62, 0.8);
            transform: scale(1.1);
        }
        .zoom-info {
            color: #888;
            font-size: 12px;
            text-align: center;
            margin-top: 5px;
        }
        #zoomLevel {
            color: #fdd865;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    document.getElementById('zoomIn').addEventListener('click', () => mapNavigation.zoomIn());
    document.getElementById('zoomOut').addEventListener('click', () => mapNavigation.zoomOut());
    document.getElementById('resetView').addEventListener('click', () => mapNavigation.resetView());
}

function preventPageScroll() {
    document.addEventListener('wheel', (e) => {
        if (mapNavigation && mapNavigation.isMouseOverMap(e)) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (mapNavigation && mapNavigation.isMouseOverMap(e)) {
            e.preventDefault();
        }
    }, { passive: false });
}

window.addEventListener('load', initMapNavigation);
window.addEventListener('resize', () => {
    if (mapNavigation) {
        mapNavigation.handleResize();
    }
});