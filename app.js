// ============================================================
// CARTE CARBURANT
// Source des données : KoboToolbox via Cloudflare Worker
// ============================================================


// ============================================================
// 1. ADRESSE DU WORKER
// ============================================================

const API_URL =
  "https://broken-fire-1935.lamine0502.workers.dev/";


// ============================================================
// 2. CRÉATION DE LA CARTE
// ============================================================

const map =
  L.map("map").setView(
    [12.63, -8.0],
    7
  );


// ============================================================
// 3. FOND DE CARTE OPENSTREETMAP
// ============================================================

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      "&copy; OpenStreetMap contributors"
  }
).addTo(map);


// ============================================================
// 4. ZONE DE STATUT
// ============================================================

const statusBox =
  document.getElementById("status");


// ============================================================
// 5. INTERPRÉTATION DES STATUTS
// ============================================================

function labelStatus(value) {

  const v =
    String(value || "")
      .toLowerCase();


  if (v === "disponible") {

    return {
      text: "Disponible",
      icon: "🟢"
    };

  }


  if (
    v === "stack_limit" ||
    v === "stock_limite" ||
    v === "limite"
  ) {

    return {
      text: "Stock limité",
      icon: "🟠"
    };

  }


  if (v === "indisponible") {

    return {
      text: "Indisponible",
      icon: "🔴"
    };

  }


  return {
    text: "Non renseigné",
    icon: "⚪"
  };

}


// ============================================================
// 6. COULEUR DU MARQUEUR
// ============================================================

function markerColor(station) {

  const essence =
    String(station.Essence || "")
      .toLowerCase();

  const gasoil =
    String(station.Gasoil || "")
      .toLowerCase();

  const petrole =
    String(station.Petrole || "")
      .toLowerCase();


  // ----------------------------------------------------------
  // Au moins un carburant disponible
  // ----------------------------------------------------------

  if (
    essence === "disponible" ||
    gasoil === "disponible" ||
    petrole === "disponible"
  ) {

    return "green";

  }


  // ----------------------------------------------------------
  // Aucun disponible, mais au moins un stock limité
  // ----------------------------------------------------------

  if (
    essence === "stack_limit" ||
    gasoil === "stack_limit" ||
    petrole === "stack_limit"
  ) {

    return "orange";

  }


  // ----------------------------------------------------------
  // Tous indisponibles ou non renseignés
  // ----------------------------------------------------------

  if (
    (essence === "indisponible" || essence === "") &&
    (gasoil === "indisponible" || gasoil === "") &&
    (petrole === "indisponible" || petrole === "")
  ) {

    return "red";

  }


  return "gray";

}


// ============================================================
// 7. ICÔNE DE LA STATION
// ============================================================

function createStationIcon(color) {

  return L.divIcon({

    className:
      "station-marker",

    html: `
      <div style="
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      ">
        ⛽
      </div>
    `,

    iconSize: [
      34,
      34
    ],

    iconAnchor: [
      17,
      17
    ],

    popupAnchor: [
      0,
      -17
    ]

  });

}


// ============================================================
// 8. NOM COMPLET DE LA STATION
// ============================================================

function stationLabel(value) {

  const labels = {

    "tinza_express":
      "Tinza express - 001",

    "sikasso_wayerma_ii":
      "Sikasso wayerma II - 002",

    "taoud_nit___shell_4":
      "Taoudénit - Shell 4 - 003",

    "taoud_nit___total1":
      "Taoudénit - Total1 - 004",

    "gao_bero_service2":
      "Gao Bero Service2 - 005",

    "kayes_sotraka_1___006":
      "Kayes Sotraka 1 - 006",

    "s_gou_total2":
      "Ségou Total2 - 007",

    "traore_fana2":
      "Traore Fana2 - 008",

    "shell_place_can":
      "Shell Place Can - 009",

    "total_s_gou1":
      "Total ségou1 - 010"

  };


  return (
    labels[value] ||
    value ||
    "Station sans nom"
  );

}


// ============================================================
// 9. FENÊTRE D'INFORMATION
// ============================================================

function popupFor(station) {

  const essence =
    labelStatus(
      station.Essence
    );

  const gasoil =
    labelStatus(
      station.Gasoil
    );

  const petrole =
    labelStatus(
      station.Petrole
    );


  const date =
    station._submission_time

      ? new Date(
          station._submission_time
        ).toLocaleString(
          "fr-FR"
        )

      : "Non renseignée";


  return `

    <div class="station-popup">

      <h3>
        ⛽ ${stationLabel(
          station.station
        )}
      </h3>


      <table>

        <tr>

          <td>
            <strong>
              Essence
            </strong>
          </td>

          <td>
            ${essence.icon}
            ${essence.text}
          </td>

        </tr>


        <tr>

          <td>
            <strong>
              Gasoil
            </strong>
          </td>

          <td>
            ${gasoil.icon}
            ${gasoil.text}
          </td>

        </tr>


        <tr>

          <td>
            <strong>
              Pétrole
            </strong>
          </td>

          <td>
            ${petrole.icon}
            ${petrole.text}
          </td>

        </tr>

      </table>


      <p>

        <small>

          Dernière mise à jour :
          ${date}

        </small>

      </p>

    </div>

  `;

}


// ============================================================
// 10. LÉGENDE
// ============================================================

const legend =
  L.control({
    position:
      "bottomright"
  });


legend.onAdd =
  function () {

    const div =
      L.DomUtil.create(
        "div",
        "map-legend"
      );


    div.innerHTML = `

      <strong>
        Légende
      </strong>


      <div>

        <span style="
          display:inline-block;
          width:14px;
          height:14px;
          background:green;
          border-radius:50%;
          margin-right:6px;
        "></span>

        Disponible

      </div>


      <div>

        <span style="
          display:inline-block;
          width:14px;
          height:14px;
          background:orange;
          border-radius:50%;
          margin-right:6px;
        "></span>

        Stock limité

      </div>


      <div>

        <span style="
          display:inline-block;
          width:14px;
          height:14px;
          background:red;
          border-radius:50%;
          margin-right:6px;
        "></span>

        Indisponible

      </div>

    `;


    return div;

  };


legend.addTo(map);


// ============================================================
// 11. CHARGEMENT DES STATIONS
// ============================================================

async function loadStations() {

  try {


    // --------------------------------------------------------
    // Récupérer les données du Worker
    // --------------------------------------------------------

    const response =
      await fetch(API_URL);


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    // --------------------------------------------------------
    // Transformer la réponse en JSON
    // --------------------------------------------------------

    const data =
      await response.json();


    // --------------------------------------------------------
    // Récupérer tous les enregistrements Kobo
    // --------------------------------------------------------

    const allStations =
      data.results || [];


    if (!allStations.length) {

      statusBox.textContent =
        "Aucune station trouvée.";

      return;

    }


    // ========================================================
    // 12. FILTRER LES NOUVEAUX ENREGISTREMENTS
    // ========================================================

    const validStations =
      allStations.filter(
        station => {

          const lat =
            Number(
              station.latitude_station
            );

          const lon =
            Number(
              station.longitude_station
            );


          return (

            station.station &&

            Number.isFinite(lat) &&

            Number.isFinite(lon)

          );

        }
      );


    // ========================================================
    // 13. GARDER LA DERNIÈRE MISE À JOUR
    // ========================================================

    const latestStations =
      new Map();


    validStations.forEach(
      station => {

        const stationCode =
          station.station;


        const existing =
          latestStations.get(
            stationCode
          );


        // ----------------------------------------------------
        // Si la station n'existe pas encore
        // ----------------------------------------------------

        if (!existing) {

          latestStations.set(
            stationCode,
            station
          );

          return;

        }


        // ----------------------------------------------------
        // Comparer les dates
        // ----------------------------------------------------

        const newDate =
          new Date(
            station._submission_time
          );

        const oldDate =
          new Date(
            existing._submission_time
          );


        // ----------------------------------------------------
        // Conserver uniquement la plus récente
        // ----------------------------------------------------

        if (newDate > oldDate) {

          latestStations.set(
            stationCode,
            station
          );

        }

      }
    );


    // Transformer la Map en tableau

    const stations =
      Array.from(
        latestStations.values()
      );


    // ========================================================
    // 14. SUPPRIMER LES ANCIENS MARQUEURS
    // ========================================================

    map.eachLayer(
      function (layer) {

        if (
          layer instanceof L.Marker
        ) {

          map.removeLayer(
            layer
          );

        }

      }
    );


    // ========================================================
    // 15. AJOUTER LES STATIONS
    // ========================================================

    const bounds = [];


    stations.forEach(
      station => {


        const lat =
          Number(
            station.latitude_station
          );


        const lon =
          Number(
            station.longitude_station
          );


        // ----------------------------------------------------
        // Vérification des coordonnées
        // ----------------------------------------------------

        if (

          !Number.isFinite(lat) ||

          !Number.isFinite(lon)

        ) {

          return;

        }


        // ----------------------------------------------------
        // Déterminer la couleur
        // ----------------------------------------------------

        const color =
          markerColor(
            station
          );


        // ----------------------------------------------------
        // Créer le marqueur
        // ----------------------------------------------------

        const marker =
          L.marker(

            [
              lat,
              lon
            ],

            {
              icon:
                createStationIcon(
                  color
                )
            }

          ).addTo(map);


        // ----------------------------------------------------
        // Ajouter la popup
        // ----------------------------------------------------

        marker.bindPopup(
          popupFor(
            station
          )
        );


        // ----------------------------------------------------
        // Ajouter aux limites
        // ----------------------------------------------------

        bounds.push(
          [
            lat,
            lon
          ]
        );

      }
    );


    // ========================================================
    // 16. AJUSTER LA CARTE
    // ========================================================

    if (
      bounds.length === 1
    ) {

      map.setView(
        bounds[0],
        14
      );

    }

    else if (
      bounds.length > 1
    ) {

      map.fitBounds(
        bounds,
        {
          padding: [
            30,
            30
          ]
        }
      );

    }


    // ========================================================
    // 17. MESSAGE D'ÉTAT
    // ========================================================

    statusBox.textContent =

      `${stations.length} station(s) chargée(s) — actualisation automatique toutes les 2 minutes.`;


  }

  catch (error) {


    // --------------------------------------------------------
    // Afficher l'erreur dans la console
    // --------------------------------------------------------

    console.error(
      error
    );


    // --------------------------------------------------------
    // Message visible sur la carte
    // --------------------------------------------------------

    statusBox.textContent =

      "Impossible de récupérer les données Kobo. Vérifie la connexion et l'accès à l'API.";

  }

}


// ============================================================
// 18. PREMIER CHARGEMENT
// ============================================================

loadStations();


// ============================================================
// 19. ACTUALISATION AUTOMATIQUE
// ============================================================

// 120 000 millisecondes = 2 minutes

setInterval(
  loadStations,
  120000
);
