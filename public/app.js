const root = document.querySelector("#root");
const apis = {
    bus: {
        url: "datas/tpl_percorsi_bus.geojson",
        datas: null,
        name: "Autobus",
        show: false,
        are_showed: false,
        style: {
            color: "#013b17",
            weight: 0.8,
        },
        layer: null,
    },
    tram: {
        url: "datas/tpl_percorsi_tram.geojson",
        datas: null,
        name: "Tram",
        show: false,
        are_showed: false,
        style: {
            color: "#e37a02",
            weight: 1.5,
        },
        layer: null,
    },
    filobus: {
        url: "datas/tpl_percorsi_filobus.geojson",
        datas: null,
        name: "Filobus",
        show: false,
        are_showed: false,
        style: {
            color: "#023299",
            weight: 1.2,
        },
        layer: null,

    },
    metro: {
        url: "datas/tpl_percorsi_metro.geojson",
        datas: null,
        name: "Metropoliana",
        show: false,
        are_showed: false,
        layer: null,
        style: {
            weight: 1.7,
        },
        filter: (data) => {
            let features_M1 = [];
            let features_M2 = [];
            let features_M3 = [];
            let features_M4 = [];
            let features_M5 = [];

            data.features.forEach((feature) => {
                if (feature.properties.linea === "1") {
                    features_M1.push(feature);
                } else if (feature.properties.linea === "2") {
                    features_M2.push(feature);
                } else if (feature.properties.linea === "3") {
                    features_M3.push(feature);
                } else if (feature.properties.linea === "4") {
                    features_M4.push(feature);
                } else if (feature.properties.linea === "5") {
                    features_M5.push(feature);
                }
            });
            layer_M1 = L.geoJSON(features_M1, {
                ...apis.metro.style,
                color: "#ff0000"
            });
            layer_M2 = L.geoJSON(features_M2, {
                ...apis.metro.style,
                color: "#178109"
            });
            layer_M3 = L.geoJSON(features_M3, {
                ...apis.metro.style,
                color: "#c0b303"
            });
            /* layer_M4 = L.geoJSON(features_M4, {
                style: apis.metro.style.weight,
                color: "#ff0000"
            }); */
            layer_M5 = L.geoJSON(features_M5, {
                ...apis.metro.style,
                color: "#620380"
            });
            return L.layerGroup([layer_M1, layer_M2, layer_M3, layer_M5]);
        }
    },
    suburban_train: {
        url: "datas/tpl_percorsi_suburban_train.geojson",
        datas: null,
        name: "Treni suburbani",
        show: false,
        are_showed: false,
        layer: null,
        style: {
            color: null,
            weight: 1.3,
        },
    },
}

let map;

async function downloadLane(type = "all") {
    if (type === "all") {
        for (let key in apis) {
            if (apis[key] !== null) {
                let response = await fetch(apis[key].url) // fetch the data
                let data = await response.json(); // parse the data\
                apis[key].datas = data;
                if (apis[key].filter !== undefined) {
                    layer = apis[key].filter(data);
                } else layer = L.geoJSON(data["features"], { style: apis[key].style });
                apis[key].layer = layer

            }
        }
    } else {
        for (let index in type) {

            let key = type[index];
            console.log(key)
            if (apis[key] !== null) {
                let response = await fetch(apis[key].url) // fetch the data
                let data = await response.json(); // parse the data\
                apis[key].datas = data;
                if (apis[key].filter !== undefined) {
                    layer = apis[key].filter(data);
                } else layer = L.geoJSON(data["features"], { style: apis[key].style });
                apis[key].layer = layer
            }
        }

    }
    console.log('data loaded');
}

function initMap() {
    map = L.map("map").setView([45.4654219, 9.1859243], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
}

function updateLayer() {
    for (let key in apis) {

        if (apis[key] !== null) {
            console.log(key);
            console.log(apis[key].are_showed === false);
            console.log(apis[key].layer !== null);
            console.log(apis[key].show === true);
            if (apis[key].are_showed === false && apis[key].layer !== null && apis[key].show === true) {
                apis[key].are_showed = true;
                showLane(key);
            } else if (apis[key].are_showed === true && apis[key].layer !== null && apis[key].show === false) {
                apis[key].are_showed = false;
                removeLane(key);
            }

        }
    }
}


function showLane(key) {
    if (apis[key] !== null) {
        apis[key].layer.addTo(map);
    }
}

function removeLane(key) {
    if (apis[key] !== null) {
        map.removeLayer(apis[key].layer);
    }
}

function checkMenu() {
    document.querySelector("#check-bus").addEventListener('change', (e) => updateVisual(e));
    document.querySelector("#check-filobus").addEventListener('change', (e) => updateVisual(e))
    document.querySelector("#check-tram").addEventListener('change', (e) => updateVisual(e));
    document.querySelector("#check-metro").addEventListener('change', (e) => updateVisual(e));
    document.querySelector("#check-suburban-train").addEventListener("change", (e) => updateVisual(e));
}


function updateVisual(e) {
    let key = e.target.name;
    if (e.target.checked) {
        apis[key].show = true;
    } else {
        apis[key].show = false;
    }
    updateLayer();
}


async function main() {
    await downloadLane(type = ["tram", "metro", "filobus", "bus"]);
    initMap();
    checkMenu();
    updateLayer();

}

main();