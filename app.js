// ============================================================
// CARTE CARBURANT
// Source des données : KoboToolbox via Cloudflare Worker
// ============================================================

const API_URL =
  "https://broken-fire-1935.lamine0502.workers.dev/";


// ============================================================
// 1. CRÉATION DE LA CARTE
// ============================================================

const map = L.map("map").setView([12.63, -8.0], 7);


// ============================================================
// 2. FOND DE CARTE OPENSTREETMAP
// ============================================================

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);


// ============================================================
// 3. ZONE DE STATUT
// ============================================================

const statusBox = document.getElementById("status");


// ============================================================
// 4. INTERPRÉTATION DES STATUTS
// ============================================================

function labelStatus(value) {

  const v = String(value || "").toLowerCase();

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
// 5. CHOISIR LA COULEUR DU MARQUEUR
// ============================================================

function markerColor(station) {

  const essence = String(station.Essence || "").toLowerCase();
  const gasoil = String(station.Gasoil || "").toLowerCase();
  const petrole = String(station.Petrole || "").toLowerCase();

  // Si au moins un carburant est disponible
  if (
    essence === "disponible" ||
    gasoil === "disponible" ||
    petrole === "disponible"
  ) {
    return "green";
  }

  // Sinon, si au moins un carburant est en stock limité
  if (
    essence === "stack_limit" ||
    gasoil === "stack_limit" ||
    petrole === "stack_limit"
  ) {
    return "orange";
  }

  // Sinon, si tous sont indisponibles
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
// 6. CRÉATION D'UNE ICÔNE DE STATION
// ============================================================

function createStationIcon(color) {

  return L.divIcon({
    className: "station-marker",

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

    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17]
  });
}


// ============================================================
// 7. FENÊTRE D'INFORMATION DE LA STATION
// ============================================================

function popupFor(station) {

  const essence = labelStatus(station.Essence);
  const gasoil = labelStatus(station.Gasoil);
  const petrole = labelStatus(station.Petrole);

  const date = station._submission_time
    ? new Date(
        station._submission_time
      ).toLocaleString("fr-FR")
    : "Non renseignée";


  return `
    <div class="station-popup">

      <h3>
        ⛽ ${station.Nom_de_la_station || "Station sans nom"}
      </h3>

      <table>

        <tr>
          <td><strong>Essence</strong></td>
          <td>
            ${essence.icon} ${essence.text}
          </td>
        </tr>

        <tr>
          <td><strong>Gasoil</strong></td>
          <td>
            ${gasoil.icon} ${gasoil.text}
          </td>
        </tr>

        <tr>
          <td><strong>Pétrole</strong></td>
          <td>
            ${petrole.icon} ${petrole.text}
          </td>
        </tr>

      </table>

      <p>
        <small>
          Dernière mise à jour : ${date}
        </small>
      </p>

    </div>
  `;
}


// ============================================================
// 8. LÉGENDE
// ============================================================

const legend = L.control({
  position: "bottomright"
});


legend.onAdd = function () {

  const div = L.DomUtil.create(
    "div",
    "map-legend"
  );

  div.innerHTML = `
    <strong>Légende</strong>

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
// 9. CHARGEMENT DES STATIONS
// ============================================================

async function loadStations() {

  try {

    const response = await fetch(API_URL);


    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }


    const data = await response.json();


    const stations = data.results || [];


    if (!stations.length) {

      statusBox.textContent =
        "Aucune station trouvée.";

      return;
    }


    const bounds = [];


    // --------------------------------------------------------
    // Supprimer les anciens marqueurs avant actualisation
    // --------------------------------------------------------

    map.eachLayer(function (layer) {

      if (
        layer instanceof L.Marker
      ) {
        map.removeLayer(layer);
      }

    });


    // --------------------------------------------------------
    // Ajouter les stations
    // --------------------------------------------------------

    stations.forEach(station => {


     // Récupération des coordonnées fixes de la station
const lat = Number(station.latitude_station);
const lon = Number(station.longitude_station);


      // Vérification des coordonnées
      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon)
      ) {
        return;
      }


      // ------------------------------------------------------
      // Déterminer la couleur du marqueur
      // ------------------------------------------------------

      const color =
        markerColor(station);


      // ------------------------------------------------------
      // Créer le marqueur
      // ------------------------------------------------------

      const marker = L.marker(
        [lat, lon],
        {
          icon:
            createStationIcon(color)
        }
      )
        .addTo(map);


      // ------------------------------------------------------
      // Ajouter la fenêtre popup
      // ------------------------------------------------------

      marker.bindPopup(
        popupFor(station)
      );


      // Ajouter aux limites de la carte
      bounds.push([
        lat,
        lon
      ]);

    });


    // ========================================================
    // 10. AJUSTER LA CARTE AUX STATIONS
    // ========================================================

    if (bounds.length === 1) {

      map.setView(
        bounds[0],
        14
      );

    }

    else if (bounds.length > 1) {

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
    // 11. MESSAGE D'ÉTAT
    // ========================================================

    statusBox.textContent =
      `${stations.length} station(s) chargée(s) — actualisation automatique toutes les 2 minutes.`;


  }

  catch (error) {

    console.error(error);


    statusBox.textContent =
      "Impossible de récupérer les données Kobo. Vérifie la connexion et l'accès à l'API.";

  }

}


// ============================================================
// 12. PREMIER CHARGEMENT
// ============================================================

loadStations();


// ============================================================
// 13. ACTUALISATION AUTOMATIQUE
// ============================================================

// 120 000 millisecondes = 2 minutes

setInterval(
  loadStations,
  120000
);
