// Jesper Korsen, inspireeritud allikast: https://webdesign.tutsplus.com/how-to-build-a-search-bar-with-javascript--cms-107227t

// ------KAART------

// loob kaardi ja sätib default asukoha
var kaart = L.map('kaart').setView([58.37939333946564, 26.723323522250354],17);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(kaart);

// Lisab baarid kaardile, salvestades markeri data objekti
for (const nimi of Object.keys(data.baarid)){
    console.log(data.baarid[nimi]);
    const a = data.baarid[nimi]["pin"] = L.marker(data.baarid[nimi].asukoht).addTo(kaart);
    a.bindPopup(nimi);
};

// ------OTSING------

// konstantid ja muutujad otsingu jaoks jaoks
const otsing = document.getElementById("otsing");
let joogid = new Set();
const tulemused = document.querySelector(".otsingu-vastused");
let eelminetulemus = new Array();
let controller = new AbortController(); // joogi vastuste listeneri mugavaks kustutamiseks

//Lisa hulka joogid kõikide baaride joogid
Object.values(data.baarid).forEach(baar => Object.keys(baar.joogid).forEach(jook => joogid.add(jook))) 

// Funktsioon päringute limiteerimiseks
let debounceTimer;
const debounce = (callback, time) => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(callback, time);
};

// lisa EventListener otsinguribale, koos debounceiga
otsing.addEventListener(
    "input",
    (event) => {
        const query = event.target.value;
        debounce(() => handleSearchPosts(query), 100);
    },
    false
);

// Seda funktsiooni jooksutatakse iga kord kui otsingusse sisestatakse teksti
const handleSearchPosts = (query) => {
    // Tee tekst sobivamaks
    const searchQuery = query.trim().toLowerCase();

    // Ignoreeri otsinguid mis on ainult üks täht
    if (searchQuery.length <= 1) {
        return
    }

    // Filtreeri välja joogid mis sobivad otsinguga
    let searchResults = [...joogid].filter(
        (jook) => jook.toLowerCase().includes(searchQuery)
    );

    // Eemalda vanad EventListenerid, tühjenda tulemused ja lisa iga uue
    // tulemuse jaoks nupp
    controller.abort()
    controller = new AbortController();
    tulemused.innerHTML = "";
    for (jook of searchResults) {
        const tulemus = document.createElement("button");
        tulemus.addEventListener("click", otsiJooki, {signal: controller.signal});
        tulemus.innerHTML = jook;
        tulemused.append(tulemus);
    };
}

// Seda funktsiooni jooksutatakse siis kui vajutatakse otsingutulemusele
const otsiJooki = (event) => {
    jook = event.target.innerHTML;
    console.log(`otsin jooki ${jook}`);

    // reseti eelmise tulemuse baaride markerid vaikimisi väärtustele
    for ([baari_nimi, baar] of eelminetulemus) {
        baar.pin._icon.style.filter = "";
        baar.pin.setPopupContent(`${baari_nimi}`);
    }

    // Tee punaseks ja too välja joogi hind igal baari markeril,
    // kus on otsitud jook
    for ([baari_nimi, baar] of Object.entries(data.baarid)) {
        if (Object.keys(baar.joogid).includes(jook)) {
            eelminetulemus.push([baari_nimi,baar])
            baar.pin._icon.style.filter = "hue-rotate(120deg)";
            baar.pin.setPopupContent(`<b>${baari_nimi}</b><br>${jook}: ${baar.joogid[jook]}`)
            baar.pin.openPopup()
        }
    }
}


