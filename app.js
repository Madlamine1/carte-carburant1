const API_URL =
    "https://broken-fire-1935.lamine0502.workers.dev/";


// =====================================================
// CARTE
// =====================================================

const map = L.map("map").setView(
    [12.63, -8.0],
    7
);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(map);


let markersLayer =
    L.layerGroup().addTo(map);

let allStations = [];


// =====================================================
// FILTRES
// =====================================================

const regionSelect =
    document.getElementById("regionSelect");

const cercleSelect =
    document.getElementById("cercleSelect");

const communeSelect =
    document.getElementById("communeSelect");


// =====================================================
// STATUT CARBURANT
// =====================================================

function labelStatus(value) {

    if (value === "disponible") {
        return "🟢 Disponible";
    }

    if (
        value === "stack_limit" ||
        value === "stock_limite" ||
        value === "limite"
    ) {
        return "🟠 Stock limité";
    }

    if (value === "indisponible") {
        return "🔴 Indisponible";
    }

    return "⚪ Non renseigné";
}


// =====================================================
// COULEUR DU MARQUEUR
// =====================================================

function markerColor(station) {

    const values = [
        station.Essence,
        station.Gasoil,
        station.Petrole
    ];

    if (values.includes("disponible")) {
        return "green";
    }

    if (
        values.includes("stack_limit") ||
        values.includes("stock_limite") ||
        values.includes("limite")
    ) {
        return "orange";
    }

    if (
        values.every(
            value =>
                value === "indisponible" ||
                !value
        )
    ) {
        return "red";
    }

    return "gray";
}


// =====================================================
// NOMS DES STATIONS
// =====================================================

const stationNames = {

    tinza_express:
        "Tinza express - 001",

    sikasso_wayerma_ii:
        "Sikasso wayerma II - 002",

    taoud_nit___shell_4:
        "Taoudénit - Shell 4 - 003",

    taoud_nit___total1:
        "Taoudénit - Total1 - 004",

    gao_bero_service2:
        "Gao Bero Service2 - 005",

    kayes_sotraka_1___006:
        "Kayes Sotraka 1 - 006",

    s_gou_total2:
        "Ségou Total2 - 007",

    traore_fana2:
        "Traore Fana2 - 008",

    shell_place_can:
        "Shell Place Can - 009",

    total_s_gou1:
        "Total ségou1 - 010"
};


function stationLabel(station) {

    return (
        stationNames[station.station] ||
        station.station
    );
}


// =====================================================
// POPUP
// =====================================================

function popupFor(station) {

    return `
        <b>${stationLabel(station)}</b>

        <br><br>

        Essence :
        ${labelStatus(station.Essence)}

        <br>

        Gasoil :
        ${labelStatus(station.Gasoil)}

        <br>

        Pétrole :
        ${labelStatus(station.Petrole)}

        <br><br>

        Mise à jour :
        ${
            station._submission_time
                ? new Date(
                    station._submission_time
                  ).toLocaleString("fr-FR")
                : "Non renseignée"
        }
    `;
}


// =====================================================
// MARQUEUR
// =====================================================

function addMarker(station) {

    const color =
        markerColor(station);

    const icon =
        L.divIcon({

            className: "",

            html: `
                <div style="
                    background:${color};
                    width:32px;
                    height:32px;
                    border-radius:50%;
                    border:3px solid white;
                    box-shadow:0 0 5px #555;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:17px;
                ">
                    ⛽
                </div>
            `,

            iconSize: [38, 38],

            iconAnchor: [19, 19]
        });

    L.marker(
        [
            Number(
                station.latitude_station
            ),

            Number(
                station.longitude_station
            )
        ],
        {
            icon: icon
        }
    )
    .bindPopup(
        popupFor(station)
    )
    .addTo(markersLayer);
}


// =====================================================
// REGIONS
// =====================================================

function fillRegions() {

    regionSelect.innerHTML =
        `
        <option value="">
            Toutes les régions
        </option>
        `;

    ADMIN_DATA.forEach(
        region => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                region.code;

            option.textContent =
                region.name;

            regionSelect.appendChild(
                option
            );
        }
    );
}


// =====================================================
// CERCLES / ARRONDISSEMENTS
// =====================================================

function fillCercles(
    regionCode
) {

    cercleSelect.innerHTML =
        `
        <option value="">
            Tous
        </option>
        `;

    communeSelect.innerHTML =
        `
        <option value="">
            Tous
        </option>
        `;

    cercleSelect.disabled =
        !regionCode;

    communeSelect.disabled =
        true;

    if (!regionCode) {

        document.getElementById(
            "cercleLabel"
        ).textContent =
            "Cercle / Arrondissement";

        document.getElementById(
            "communeLabel"
        ).textContent =
            "Commune / Quartier";

        return;
    }

    const region =
        ADMIN_DATA.find(
            r => r.code === regionCode
        );

    if (!region) {
        return;
    }

    if (
        region.type ===
        "district"
    ) {

        document.getElementById(
            "cercleLabel"
        ).textContent =
            "Arrondissement";

        document.getElementById(
            "communeLabel"
        ).textContent =
            "Quartier";

    } else {

        document.getElementById(
            "cercleLabel"
        ).textContent =
            "Cercle";

        document.getElementById(
            "communeLabel"
        ).textContent =
            "Commune";
    }


    region.cercles.forEach(
        cercle => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                cercle.code;

            option.textContent =
                cercle.name;

            cercleSelect.appendChild(
                option
            );
        }
    );
}


// =====================================================
// COMMUNES / QUARTIERS
// =====================================================

function fillCommunes(
    regionCode,
    cercleCode
) {

    communeSelect.innerHTML =
        `
        <option value="">
            Tous
        </option>
        `;

    communeSelect.disabled =
        !cercleCode;

    if (
        !regionCode ||
        !cercleCode
    ) {
        return;
    }

    const region =
        ADMIN_DATA.find(
            r => r.code === regionCode
        );

    if (!region) {
        return;
    }

    const cercle =
        region.cercles.find(
            c => c.code === cercleCode
        );

    if (!cercle) {
        return;
    }

    cercle.communes.forEach(
        commune => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                commune.code;

            option.textContent =
                commune.name;

            communeSelect.appendChild(
                option
            );
        }
    );
}


// =====================================================
// FILTRAGE DES STATIONS
// =====================================================

function getFilteredStations() {

    const regionCode =
        regionSelect.value;

    const cercleCode =
        cercleSelect.value;

    const communeCode =
        communeSelect.value;


    return allStations.filter(
        station => {

            const admin =
                STATION_ADMIN[
                    station.station
                ];

            if (!admin) {
                return false;
            }


            if (
                regionCode &&
                admin.region !==
                regionCode
            ) {
                return false;
            }


            if (
                cercleCode &&
                admin.cercle !==
                cercleCode
            ) {
                return false;
            }


            if (
                communeCode &&
                admin.commune !==
                communeCode
            ) {
                return false;
            }


            return true;
        }
    );
}


// =====================================================
// AFFICHAGE
// =====================================================

function displayStations() {

    markersLayer.clearLayers();

    const stations =
        getFilteredStations();


    stations.forEach(
        addMarker
    );


    document.getElementById(
        "status"
    ).textContent =
        `${stations.length} station(s) affichée(s)`;


    if (
        stations.length > 0
    ) {

        const bounds =
            L.latLngBounds(
                stations.map(
                    station => [

                        Number(
                            station.latitude_station
                        ),

                        Number(
                            station.longitude_station
                        )
                    ]
                )
            );


        map.fitBounds(
            bounds,
            {
                padding: [
                    40,
                    40
                ]
            }
        );
    }
}


// =====================================================
// EVENEMENTS DES FILTRES
// =====================================================

regionSelect.addEventListener(
    "change",
    function () {

        fillCercles(
            regionSelect.value
        );

        displayStations();
    }
);


cercleSelect.addEventListener(
    "change",
    function () {

        fillCommunes(
            regionSelect.value,
            cercleSelect.value
        );

        displayStations();
    }
);


communeSelect.addEventListener(
    "change",
    function () {

        displayStations();
    }
);


// =====================================================
// CHARGEMENT KOBO
// =====================================================

async function loadStations() {

    try {

        const response =
            await fetch(
                API_URL
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const data =
            await response.json();


        const records =
            data.results || [];


        const latest = {};


        records.forEach(
            record => {

                if (
                    !record.station ||
                    !record.latitude_station ||
                    !record.longitude_station
                ) {
                    return;
                }


                const previous =
                    latest[
                        record.station
                    ];


                if (
                    !previous ||
                    new Date(
                        record._submission_time
                    ) >
                    new Date(
                        previous._submission_time
                    )
                ) {

                    latest[
                        record.station
                    ] = record;
                }
            }
        );


        allStations =
            Object.values(
                latest
            );


        displayStations();


    } catch (error) {

        console.error(
            error
        );


        document.getElementById(
            "status"
        ).textContent =
            "Impossible de charger les stations.";
    }
}


// =====================================================
// DEMARRAGE
// =====================================================

fillRegions();

fillCercles("");

loadStations();

setInterval(
    loadStations,
    120000
);
