const API_URL =
  "https://broken-fire-1935.lamine0502.workers.dev/";

// Création de la carte
const map = L.map("map").setView([12.63, -8.0], 7);

// Fond de carte OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const statusBox = document.getElementById("status");


// Traduction des valeurs Kobo en texte lisible
function labelStatus(value) {
  const v = String(value || "").toLowerCase();

  if (v === "disponible") {
    return {
      text: "Disponible",
      icon: "🟢"
    };
  }

  if (v === "stack_limit" ||
      v === "stock_limite" ||
      v === "limite") {
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
    text: value || "Non renseigné",
    icon: "⚪"
  };
}


// Création de la fenêtre d'information d'une station
function popupFor(station) {

  const essence = labelStatus(station.Essence);
  const gasoil = labelStatus(station.Gasoil);
  const petrole = labelStatus(station.Petrole);

  const date = station._submission_time
    ? new Date(station._submission_time).toLocaleString("fr-FR")
    : "Non renseignée";

  return `
    <div class="station-popup">

      <h3>⛽ ${station.Nom_de_la_station || "Station sans nom"}</h3>

      <table>
        <tr>
          <td>Essence</td>
          <td>${essence.icon} ${essence.text}</td>
        </tr>

        <tr>
          <td>Gasoil</td>
          <td>${gasoil.icon} ${gasoil.text}</td>
        </tr>

        <tr>
          <td>Pétrole</td>
          <td>${petrole.icon} ${petrole.text}</td>
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


// Récupération des stations depuis KoboToolbox
async function loadStations() {

  try {

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    const stations = data.results || [];

    if (!stations.length) {
      statusBox.textContent = "Aucune station trouvée.";
      return;
    }

    const bounds = [];


    // Création des marqueurs
    stations.forEach(station => {

      const coords = station._geolocation ||
        String(station.Position_GPS || "")
          .trim()
          .split(/\s+/)
          .map(Number);

      const lat = Number(coords[0]);
      const lon = Number(coords[1]);


      if (!Number.isFinite(lat) ||
          !Number.isFinite(lon)) {
        return;
      }


      const marker = L.marker([lat, lon])
        .addTo(map);

      marker.bindPopup(
        popupFor(station)
      );

      bounds.push([lat, lon]);

    });


    // Ajustement automatique de la carte
    if (bounds.length === 1) {

      map.setView(bounds[0], 14);

    } else if (bounds.length > 1) {

      map.fitBounds(
        bounds,
        { padding: [30, 30] }
      );

    }


    statusBox.textContent =
      `${stations.length} station(s) chargée(s) — actualisation automatique toutes les 2 minutes.`;


  } catch (error) {

    console.error(error);

    statusBox.textContent =
      "Impossible de récupérer les données Kobo. Vérifie la connexion et l'accès à l'API.";

  }

}


// Première récupération
loadStations();


// Actualisation automatique toutes les 2 minutes
setInterval(loadStations, 120000);
