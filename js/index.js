// ------KAART------

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
    const a = data.baarid[nimi]["pin"] = L.marker(data.baarid[nimi].asukoht).addTo(kaart);
    a.bindPopup(nimi);
};

// ------OTSING------

const otsing = document.getElementById("otsing");
let joogid = new Set();
const tulemused = document.querySelector(".otsingu-vastused");
let eelminetulemus = new Array();
let controller = new AbortController();



Object.values(data.baarid).forEach(baar => Object.keys(baar.joogid).forEach(jook => joogid.add(jook))) 


let debounceTimer;
const debounce = (callback, time) => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(callback, time);
};

otsing.addEventListener(
    "input",
    (event) => {
        const query = event.target.value;
        debounce(() => handleSearchPosts(query), 100);
    },
    false
);

const handleSearchPosts = (query) => {
    const searchQuery = query.trim().toLowerCase();

    if (searchQuery.length <= 1) {
        return
    }

    let searchResults = [...joogid].filter(
        (jook) => jook.toLowerCase().includes(query)
    );

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

const otsiJooki = (event) => {
    jook = event.target.innerHTML;
    console.log(`otsin jooki ${jook}`);
    for ([baari_nimi, baar] of eelminetulemus) {
        baar.pin._icon.style.filter = "";
        baar.pin.setPopupContent(`${baari_nimi}`);
    }
    for ([baari_nimi, baar] of Object.entries(data.baarid)) {
        if (Object.keys(baar.joogid).includes(jook)) {
            eelminetulemus.push([baari_nimi,baar])
            baar.pin._icon.style.filter = "hue-rotate(120deg)";
            baar.pin.setPopupContent(`<b>${baari_nimi}</b><br>${jook}: ${baar.joogid[jook]}`)
            baar.pin.openPopup()
        }
    }
}


