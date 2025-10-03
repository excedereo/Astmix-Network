window.addEventListener('load', function() {
    const headerElement = document.getElementById("header");
    var path = window.location.pathname;
    var page = path.split("/").pop();
    headerElement.innerHTML = `
        <img src="img/astmixLogos/astmixAvatar.png" class="astmix-logo" alt="">
        <button class="${page === 'main.html' ? 'mainButton mainButton-Picked' :'mainButton'}" id="openMain" >На главную</button>
        <button class="${page === 'spawnMap.html' ? 'mainButton mainButton-Picked' :'mainButton'}" id="spawnMap">Карта Спавна</button>

        <div class="buttonsSeparator"> </div>

        <button class="mainButton mainButton-Espada" id="espadaButton">
            Espada
            <span class="particleEspada-top"></span>
            <span class="particleEspada-bottom"></span>
            <div class="button-shineContainer">
                <span class="buttonShine buttonShine-Espada"></span>
            </div>
        </button>

        <button class="mainButton mainButton-Bank" id="aBankButton">
            A-Банк
            <span class="diamond-top"></span>
            <span class="diamond-bottom"></span>
            <div class="button-shineContainer">
                <span class="buttonShine buttonShine-Bank"></span>
            </div>
        </button>

        <div class="buttonsEnder"> </div>
    `
    console.log("Футер загружен")

    const footerElement = document.getElementById("c");
    footerElement.innerHTML = `<div class="copyright">Powered By: Excedere The Decadenza</div>`
});
