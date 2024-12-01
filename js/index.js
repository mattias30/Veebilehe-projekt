
var kaart = L.map('kaart').setView([58.37939333946564, 26.723323522250354],17);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(kaart);

// fetch('../data/baarid.json')
//     .then((response) => response.json())
//     .then((json) => {var data = json});


for (const nimi of Object.keys(data.baarid)){

    console.log(data.baarid[nimi]);
    const a = data.baarid[nimi]["pin"] = L.marker(data.baarid[nimi].asukoht).addTo(kaart)
    a.bindPopup(nimi)
};

