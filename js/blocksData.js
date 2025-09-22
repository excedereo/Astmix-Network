// data.js
window.blocksData = [
    {
        id: "A1",
        x1: 81, y1: 10,
        x2: 97, y2: 28,
        price: 15,
        name: "A1",
        isRented: false,
        rentedBy: "", arendTill: "", arendatorName: ""
    },
        {
        id: "A2",
        x1: 99, y1: 10,
        x2: 115, y2: 28,
        price: 15,
        name: "TaoBao",
        isRented: true,
        rentedBy: "gameplau228", arendTill: "19.12", arendatorName: ""
    },
        {
        id: "A3",
        x1: 117, y1: 10,
        x2: 132, y2: 28,
        price: 15,
        name: "A3",
        isRented: false,
        rentedBy: "", arendTill: "", arendatorName: ""
    },
        {
        id: "A4",
        x1: 134, y1: 10,
        x2: 150, y2: 28,
        price: 15,
        name: "Espada",
        isRented: true,
        rentedBy: "zquwu", arendTill: "27.09", arendatorName: "Stralitz"
    }
];

window.roadData = [
    {
        id: 1,
        name: "Улица Геймплейная",
        x1: 63, y1: 30,
        x2: 167, y2: 34,
        hoverColor: "#f2c55c"
    },
        {
        id: 1,
        name: "Улица Осеняя",
        x1: 75, y1: 4,
        x2: 79, y2: 98,
        hoverColor: "#1ed760"
    }
];

window.mapCenter = { x: 66, y: 24 };
console.log('Data loaded:', window.blocksData, window.mapCenter);