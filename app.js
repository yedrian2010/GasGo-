/* =========================================================
   GASGO — APP.JS
   Main application engine
   ========================================================= */

"use strict";

window.GasGoApp = window.GasGoApp || {};

const App = window.GasGoApp;


/* =========================================================
   VERSION
   ========================================================= */

App.VERSION = "5.0.0";


/* =========================================================
   STORAGE KEYS
   ========================================================= */

App.STORAGE = {
  vehicle: "gasgoVehicleV5",
  rewards: "gasgoRewardsV5",
  fuelLogs: "gasgoFuelLogsV5",
  favorites: "gasgoFavoritesV5",
  settings: "gasgoSettingsV5"
};


/* =========================================================
   APPLICATION STATE
   ========================================================= */

App.state = {

  screen: "home",

  stations: [],

  filteredStations: [],

  stationSource: "",

  usingFallback: false,

  selectedStation: null,

  selectedBrand: "all",

  sortMode: "best",

  searchQuery: "",

  selectedFuel: "regular",

  userLocation: null,

  locationPermission: "unknown",

  vehicle: null,

  rewards: {},

  fuelLogs: [],

  favorites: [],

  map: null,

  markerLayer: null,

  markers: new Map(),

  userMarker: null,

  mapInitialized: false,

  stationsLoaded: false,

  stationsLoading: false,

  smartStop: null

};


/* =========================================================
   VEHICLE DATABASE
   ========================================================= */

App.VEHICLES = {

  "Toyota": [
    "Corolla",
    "Camry",
    "RAV4",
    "Corolla Cross",
    "Highlander",
    "Tacoma",
    "4Runner",
    "Prius",
    "Tundra",
    "Other"
  ],

  "Honda": [
    "Civic",
    "Accord",
    "CR-V",
    "HR-V",
    "Pilot",
    "Ridgeline",
    "Odyssey",
    "Other"
  ],

  "Chevrolet": [
    "Sonic",
    "Spark",
    "Malibu",
    "Trax",
    "Equinox",
    "Traverse",
    "Tahoe",
    "Silverado",
    "Blazer",
    "Suburban",
    "Other"
  ],

  "Hyundai": [
    "Accent",
    "Elantra",
    "Sonata",
    "Venue",
    "Kona",
    "Tucson",
    "Santa Fe",
    "Ioniq 5",
    "Other"
  ],

  "Kia": [
    "Rio",
    "Forte",
    "K4",
    "Soul",
    "Seltos",
    "Sportage",
    "Sorento",
    "Telluride",
    "EV6",
    "Other"
  ],

  "Nissan": [
    "Versa",
    "Sentra",
    "Altima",
    "Kicks",
    "Rogue",
    "Pathfinder",
    "Frontier",
    "Leaf",
    "Other"
  ],

  "Ford": [
    "Mustang",
    "Escape",
    "Explorer",
    "Bronco",
    "Bronco Sport",
    "Maverick",
    "Ranger",
    "F-150",
    "Mustang Mach-E",
    "Other"
  ],

  "Jeep": [
    "Wrangler",
    "Compass",
    "Renegade",
    "Cherokee",
    "Grand Cherokee",
    "Gladiator",
    "Other"
  ],

  "Mitsubishi": [
    "Mirage",
    "Outlander",
    "Outlander Sport",
    "Eclipse Cross",
    "Outlander PHEV",
    "Other"
  ],

  "Mazda": [
    "Mazda3",
    "CX-30",
    "CX-5",
    "CX-50",
    "CX-90",
    "MX-5 Miata",
    "Other"
  ],

  "Subaru": [
    "Impreza",
    "Legacy",
    "Crosstrek",
    "Forester",
    "Outback",
    "WRX",
    "Other"
  ],

  "Volkswagen": [
    "Jetta",
    "Golf",
    "Taos",
    "Tiguan",
    "Atlas",
    "ID.4",
    "Other"
  ],

  "BMW": [
    "3 Series",
    "4 Series",
    "5 Series",
    "X1",
    "X3",
    "X5",
    "i4",
    "iX",
    "Other"
  ],

  "Mercedes-Benz": [
    "A-Class",
    "C-Class",
    "E-Class",
    "CLA",
    "GLA",
    "GLC",
    "GLE",
    "EQS",
    "Other"
  ],

  "Audi": [
    "A3",
    "A4",
    "A5",
    "Q3",
    "Q5",
    "Q7",
    "e-tron",
    "Other"
  ],

  "Lexus": [
    "IS",
    "ES",
    "UX",
    "NX",
    "RX",
    "GX",
    "Other"
  ],

  "Tesla": [
    "Model 3",
    "Model Y",
    "Model S",
    "Model X",
    "Cybertruck",
    "Other"
  ],

  "Acura": [
    "Integra",
    "TLX",
    "RDX",
    "MDX",
    "Other"
  ],

  "GMC": [
    "Terrain",
    "Acadia",
    "Canyon",
    "Sierra",
    "Yukon",
    "Hummer EV",
    "Other"
  ],

  "Dodge": [
    "Charger",
    "Challenger",
    "Durango",
    "Hornet",
    "Other"
  ],

  "Ram": [
    "1500",
    "2500",
    "3500",
    "ProMaster",
    "Other"
  ],

  "Other": [
    "Other"
  ]

};


/* =========================================================
   DEFAULT REWARDS
   ========================================================= */

App.DEFAULT_REWARDS = {

  Puma: {
    points: 750,
    tiers: [
      {
        points: 250,
        title: "$2 off next purchase"
      },
      {
        points: 500,
        title: "$5 fuel credit"
      },
      {
        points: 1000,
        title: "$10 reward"
      }
    ]
  },

  Shell: {
    points: 420,
    tiers: [
      {
        points: 200,
        title: "$2 reward"
      },
      {
        points: 500,
        title: "$5 reward"
      },
      {
        points: 1000,
        title: "$10 reward"
      }
    ]
  },

  Total: {
    points: 0,
    tiers: [
      {
        points: 250,
        title: "Car wash discount"
      },
      {
        points: 500,
        title: "$5 reward"
      },
      {
        points: 1000,
        title: "$10 reward"
      }
    ]
  }

};


/* =========================================================
   DEFAULT VEHICLE
   ========================================================= */

App.DEFAULT_VEHICLE = {

  year: 2015,

  make: "Chevrolet",

  model: "Sonic",

  powertrain: "Gasoline",

  level: 68,

  fullRange: 350

};


/* =========================================================
   HELPERS
   ========================================================= */

App.$ = function (id) {
  return document.getElementById(id);
};


App.$all = function (selector) {
  return Array.from(
    document.querySelectorAll(selector)
  );
};


App.safeJSON = function (
  value,
  fallback
) {

  try {

    const parsed =
      JSON.parse(value);

    return (
      parsed ??
      fallback
    );

  }

  catch {

    return fallback;

  }

};


App.loadStorage = function (
  key,
  fallback
) {

  try {

    const raw =
      localStorage.getItem(key);

    if (
      raw === null
    ) {

      return fallback;

    }

    return App.safeJSON(
      raw,
      fallback
    );

  }

  catch {

    return fallback;

  }

};


App.saveStorage = function (
  key,
  value
) {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;

  }

  catch {

    return false;

  }

};


App.escape = function (value) {

  if (
    window.GasGoData &&
    typeof GasGoData.escapeHTML === "function"
  ) {

    return GasGoData.escapeHTML(value);

  }

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

};


App.money = function (value) {

  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {

    return "$0.00";

  }

  return (
    "$" +
    number.toFixed(2)
  );

};


App.number = function (
  value,
  decimals = 1
) {

  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {

    return "0";

  }

  return number.toFixed(
    decimals
  );

};


App.clamp = function (
  value,
  min,
  max
) {

  return Math.max(
    min,
    Math.min(
      max,
      Number(value)
    )
  );

};


/* =========================================================
   TOAST
   ========================================================= */

App.toast = function (
  message,
  type = ""
) {

  let container =
    App.$("toastContainer");


  if (!container) {

    container =
      document.createElement("div");

    container.id =
      "toastContainer";

    container.className =
      "toast-container";

    document.body.appendChild(
      container
    );

  }


  const toast =
    document.createElement("div");

  toast.className =
    "toast " + type;

  toast.textContent =
    message;


  container.appendChild(
    toast
  );


  setTimeout(
    () => {

      toast.style.opacity =
        "0";

      toast.style.transform =
        "translateY(8px)";

    },
    2800
  );


  setTimeout(
    () => {

      toast.remove();

    },
    3200
  );

};


/* =========================================================
   LOAD LOCAL DATA
   ========================================================= */

App.loadLocalData = function () {

  App.state.vehicle =
    App.loadStorage(
      App.STORAGE.vehicle,
      App.DEFAULT_VEHICLE
    );


  const savedRewards =
    App.loadStorage(
      App.STORAGE.rewards,
      null
    );


  App.state.rewards =
    savedRewards &&
    typeof savedRewards === "object"
      ?
      savedRewards
      :
      JSON.parse(
        JSON.stringify(
          App.DEFAULT_REWARDS
        )
      );


  App.state.fuelLogs =
    App.loadStorage(
      App.STORAGE.fuelLogs,
      []
    );


  if (
    !Array.isArray(
      App.state.fuelLogs
    )
  ) {

    App.state.fuelLogs = [];

  }


  App.state.favorites =
    App.loadStorage(
      App.STORAGE.favorites,
      []
    );


  if (
    !Array.isArray(
      App.state.favorites
    )
  ) {

    App.state.favorites = [];

  }

};


/* =========================================================
   SCREEN NAVIGATION
   ========================================================= */

App.showScreen = function (
  screenName
) {

  App.state.screen =
    screenName;


  App.$all(".screen")
    .forEach(
      screen => {

        screen.classList.toggle(
          "active",
          screen.id ===
            "screen-" +
            screenName
        );

      }
    );


  App.$all(".nav")
    .forEach(
      nav => {

        nav.classList.toggle(
          "active",
          nav.dataset.screen ===
            screenName
        );

      }
    );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  if (
    screenName === "stations"
  ) {

    App.initializeMap();

    setTimeout(
      () => {

        if (
          App.state.map
        ) {

          App.state.map.invalidateSize(
            true
          );

        }

      },
      150
    );

  }


  if (
    screenName === "dashboard"
  ) {

    App.renderDashboard();

  }


  if (
    screenName === "rewards"
  ) {

    App.renderRewards();

  }


  if (
    screenName === "car"
  ) {

    App.renderVehicle();

  }

};


/* =========================================================
   RANGE / VEHICLE HOME
   ========================================================= */

App.getVehicleRange = function () {

  if (
    !window.GasGoData
  ) {

    return 0;

  }

  return (
    GasGoData.getEstimatedVehicleRange(
      App.state.vehicle
    ) || 0
  );

};


App.renderHomeVehicle = function () {

  const vehicle =
    App.state.vehicle;


  if (!vehicle) {
    return;
  }


  const range =
    App.getVehicleRange();


  const rangeEl =
    App.$("homeRange");


  if (rangeEl) {

    rangeEl.innerHTML =
      Math.round(range) +
      ' <small>mi</small>';

  }


  const levelEl =
    App.$("homeLevel");


  if (levelEl) {

    levelEl.textContent =
      Math.round(
        vehicle.level
      ) + "%";

  }


  const progress =
    App.$("homeLevelBar");


  if (progress) {

    progress.style.width =
      App.clamp(
        vehicle.level,
        0,
        100
      ) + "%";

  }


  const vehicleName =
    App.$("homeVehicleName");


  if (vehicleName) {

    vehicleName.textContent =
      vehicle.year +
      " " +
      vehicle.make +
      " " +
      vehicle.model;

  }


  const fuelLabel =
    App.$("homeFuelLabel");


  if (fuelLabel) {

    fuelLabel.textContent =
      vehicle.powertrain ===
        "Electric"
        ?
        "Battery"
        :
        "Fuel";

  }

};


/* =========================================================
   LOAD STATIONS
   ========================================================= */

App.loadStations = async function () {

  if (
    App.state.stationsLoading
  ) {

    return;
  }


  App.state.stationsLoading =
    true;


  App.setStationStatus(
    "Loading mapped fuel stations…"
  );


  try {

    if (
      !window.GasGoData
    ) {

      throw new Error(
        "stations.js did not load."
      );

    }


    const result =
      await GasGoData.fetchStations();


    App.state.stations =
      result.stations || [];


    App.state.stationSource =
      result.source || "";


    App.state.usingFallback =
      Boolean(
        result.fallback
      );


    App.state.stationsLoaded =
      true;


    App.applyStationFilters();


    if (
      result.fallback
    ) {

      App.setStationStatus(
        "Map service is temporarily unavailable. Showing clearly labeled GasGo demo locations."
      );

    }

    else {

      App.setStationStatus(
        result.count +
        " mapped fuel locations loaded from OpenStreetMap. Individual prices shown by GasGo are demo estimates."
      );

    }


    App.renderPriceReference();

    App.updateSmartStop();

  }

  catch (error) {

    console.error(error);


    App.state.stations =
      GasGoData.getFallbackStations();


    App.state.usingFallback =
      true;


    App.state.stationsLoaded =
      true;


    App.applyStationFilters();


    App.setStationStatus(
      "Unable to reach the map station service. Showing GasGo demo locations."
    );

  }

  finally {

    App.state.stationsLoading =
      false;


    App.hideMapLoader();

  }

};


/* =========================================================
   MAP INITIALIZATION
   ========================================================= */

App.initializeMap = function () {

  if (
    App.state.mapInitialized
  ) {

    if (
      App.state.map
    ) {

      App.state.map.invalidateSize(
        true
      );

    }

    return;
  }


  const mapElement =
    App.$("map");


  if (!mapElement) {

    return;
  }


  if (
    typeof window.L ===
    "undefined"
  ) {

    App.setStationStatus(
      "Map library could not load."
    );

    return;
  }


  const center =
    GasGoData.PR_CENTER;


  const map =
    L.map(
      "map",
      {
        zoomControl: true,
        preferCanvas: true
      }
    )
      .setView(
        [
          center.lat,
          center.lon
        ],
        center.zoom
      );


  App.state.map =
    map;


  App.state.markerLayer =
    L.layerGroup()
      .addTo(map);


  const tiles =
    L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,

        attribution:
          "&copy; OpenStreetMap contributors"
      }
    );


  tiles.on(
    "load",
    App.hideMapLoader
  );


  tiles.on(
    "tileerror",
    () => {

      setTimeout(
        App.hideMapLoader,
        500
      );

    }
  );


  tiles.addTo(map);


  App.state.mapInitialized =
    true;


  setTimeout(
    () => {

      map.invalidateSize(
        true
      );

    },
    100
  );


  if (
    App.state.stationsLoaded
  ) {

    App.renderMapStations();

  }

  else {

    App.loadStations();

  }

};


/* =========================================================
   MAP LOADER
   ========================================================= */

App.hideMapLoader = function () {

  const loader =
    App.$("mapLoader");


  if (loader) {

    loader.style.display =
      "none";

  }

};


/* =========================================================
   STATUS
   ========================================================= */

App.setStationStatus = function (
  text
) {

  const element =
    App.$("stationStatus");


  if (element) {

    element.textContent =
      text;

  }

};


/* =========================================================
   CREATE MARKER ICON
   ========================================================= */

App.createStationIcon = function (
  station,
  selected = false
) {

  const prices =
    station.prices ||
    GasGoData.getStationPrices(
      station
    );


  const level =
    GasGoData.getPriceLevel(
      prices.regular
    );


  const selectedClass =
    selected
      ?
      " selected"
      :
      "";


  return L.divIcon({

    className: "",

    html:
      '<div class="station-marker ' +
      level +
      selectedClass +
      '">⛽</div>',

    iconSize:
      [38, 38],

    iconAnchor:
      [19, 19],

    popupAnchor:
      [0, -20]

  });

};


/* =========================================================
   POPUP
   ========================================================= */

App.stationPopupHTML = function (
  station
) {

  const prices =
    station.prices ||
    GasGoData.getStationPrices(
      station
    );


  return `

    <div>

      <div class="popup-title">
        ${App.escape(station.name)}
      </div>

      <div class="popup-brand">
        ${App.escape(station.brand)}
        ${
          station.municipality
            ?
            " • " +
            App.escape(
              station.municipality
            )
            :
            ""
        }
      </div>

      <div class="popup-prices">

        <div class="popup-price">
          <span>Regular</span>
          <strong>
            ${App.money(prices.regular)}
          </strong>
        </div>

        <div class="popup-price">
          <span>Premium</span>
          <strong>
            ${App.money(prices.premium)}
          </strong>
        </div>

        <div class="popup-price">
          <span>Diesel</span>
          <strong>
            ${App.money(prices.diesel)}
          </strong>
        </div>

      </div>

      <div class="popup-demo">
        Demo fuel prices ·
        location source:
        ${App.escape(station.source)}
      </div>

    </div>
  `;

};


/* =========================================================
   RENDER MAP STATIONS
   ========================================================= */

App.renderMapStations = function () {

  if (
    !App.state.map ||
    !App.state.markerLayer
  ) {

    return;
  }


  App.state.markerLayer
    .clearLayers();


  App.state.markers.clear();


  const stations =
    App.state.filteredStations;


  stations.forEach(
    station => {

      const selected =
        App.state.selectedStation &&
        String(
          App.state.selectedStation.id
        ) ===
        String(
          station.id
        );


      const marker =
        L.marker(
          [
            station.lat,
            station.lon
          ],
          {
            icon:
              App.createStationIcon(
                station,
                selected
              )
          }
        );


      marker.bindPopup(
        App.stationPopupHTML(
          station
        )
      );


      marker.on(
        "click",
        () => {

          App.selectStation(
            station,
            false
          );

        }
      );


      marker.addTo(
        App.state.markerLayer
      );


      App.state.markers.set(
        String(station.id),
        marker
      );

    }
  );


  App.renderStationList();

};


/* =========================================================
   SEARCH + FILTER + SORT
   ========================================================= */

App.applyStationFilters = function () {

  let stations =
    [...App.state.stations];


  stations =
    GasGoData.searchStations(
      stations,
      App.state.searchQuery
    );


  stations =
    GasGoData.filterByBrand(
      stations,
      App.state.selectedBrand
    );


  if (
    App.state.sortMode ===
    "cheap"
  ) {

    stations =
      GasGoData.sortCheapest(
        stations,
        App.state.selectedFuel
      );

  }

  else if (
    App.state.sortMode ===
    "closest"
  ) {

    if (
      App.state.userLocation
    ) {

      stations =
        GasGoData.sortClosest(
          stations,
          App.state.userLocation
        );

    }

    else {

      stations =
        GasGoData.sortCheapest(
          stations,
          App.state.selectedFuel
        );

    }

  }

  else {

    stations =
      GasGoData.sortBestValue(
        stations,
        App.state.userLocation,
        App.state.selectedFuel
      );

  }


  App.state.filteredStations =
    stations;


  App.renderMapStations();

  App.updateSmartStop();

};


/* =========================================================
   SEARCH
   ========================================================= */

App.searchStations = function (
  value
) {

  App.state.searchQuery =
    String(value || "");


  App.applyStationFilters();

};


/* =========================================================
   CLEAR SEARCH
   ========================================================= */

App.clearStationSearch = function () {

  const input =
    App.$("stationSearch");


  if (input) {

    input.value = "";

  }


  App.state.searchQuery =
    "";


  App.applyStationFilters();

};


/* =========================================================
   BRAND FILTER
   ========================================================= */

App.setBrandFilter = function (
  brand,
  button
) {

  App.state.selectedBrand =
    brand;


  App.$all(
    "[data-brand-filter]"
  )
    .forEach(
      item => {

        item.classList.toggle(
          "active",
          item === button
        );

      }
    );


  App.applyStationFilters();

};


/* =========================================================
   SORT
   ========================================================= */

App.setSortMode = function (
  mode,
  button
) {

  if (
    mode === "closest" &&
    !App.state.userLocation
  ) {

    App.toast(
      "Share your location to sort by closest.",
      "error"
    );


    App.requestLocation();

    return;

  }


  App.state.sortMode =
    mode;


  App.$all(
    "[data-sort]"
  )
    .forEach(
      item => {

        item.classList.toggle(
          "active",
          item === button
        );

      }
    );


  App.applyStationFilters();

};


/* =========================================================
   FUEL TYPE
   ========================================================= */

App.setFuelType = function (
  fuel,
  button
) {

  App.state.selectedFuel =
    fuel;


  App.$all(
    "[data-fuel]"
  )
    .forEach(
      item => {

        item.classList.toggle(
          "active",
          item === button
        );

      }
    );


  App.applyStationFilters();

};


/* =========================================================
   STATION LIST
   ========================================================= */

App.renderStationList = function () {

  const container =
    App.$("stationList");


  if (!container) {
    return;
  }


  const stations =
    App.state.filteredStations
      .slice(
        0,
        30
      );


  if (
    stations.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          🔎
        </div>

        <strong>
          No stations found
        </strong>

        Try another brand or search.

      </div>
    `;

    return;

  }


  container.innerHTML =
    stations.map(
      station => {

        const prices =
          station.prices ||
          GasGoData.getStationPrices(
            station
          );


        let distanceText = "";


        if (
          App.state.userLocation
        ) {

          const distance =
            GasGoData.distanceMiles(
              App.state.userLocation.lat,
              App.state.userLocation.lon,
              station.lat,
              station.lon
            );


          distanceText =
            " • " +
            GasGoData.formatDistance(
              distance
            );

        }


        return `

          <div
            class="station-list-item"
            onclick="GasGoApp.selectStationById('${App.escape(station.id)}')"
          >

            <div class="station-list-icon">
              ⛽
            </div>

            <div class="station-list-info">

              <div class="station-list-name">
                ${App.escape(station.name)}
              </div>

              <div class="station-list-meta">

                ${App.escape(station.brand)}

                ${
                  station.municipality
                    ?
                    " • " +
                    App.escape(
                      station.municipality
                    )
                    :
                    ""
                }

                ${distanceText}

              </div>

            </div>

            <div class="station-list-price">
              ${App.money(
                prices[
                  App.state.selectedFuel
                ]
              )}
            </div>

          </div>
        `;

      }
    )
    .join("");

};


/* =========================================================
   SELECT STATION BY ID
   ========================================================= */

App.selectStationById = function (
  id
) {

  const station =
    App.state.stations.find(
      item =>
        String(item.id) ===
        String(id)
    );


  if (station) {

    App.selectStation(
      station,
      true
    );

  }

};


/* =========================================================
   SELECT STATION
   ========================================================= */

App.selectStation = function (
  station,
  moveMap = true
) {

  App.state.selectedStation =
    station;


  if (
    moveMap &&
    App.state.map
  ) {

    App.state.map.flyTo(
      [
        station.lat,
        station.lon
      ],
      Math.max(
        App.state.map.getZoom(),
        14
      ),
      {
        duration: 0.6
      }
    );

  }


  App.renderStationSheet();

  App.renderMapStations();


  const marker =
    App.state.markers.get(
      String(station.id)
    );


  if (
    marker &&
    moveMap
  ) {

    setTimeout(
      () => {

        marker.openPopup();

      },
      650
    );

  }

};


/* =========================================================
   STATION SHEET
   ========================================================= */

App.renderStationSheet = function () {

  const station =
    App.state.selectedStation;


  const sheet =
    App.$("stationSheet");


  if (
    !sheet ||
    !station
  ) {

    return;

  }


  sheet.classList.add(
    "visible"
  );


  const prices =
    station.prices ||
    GasGoData.getStationPrices(
      station
    );


  const name =
    App.$("selectedStationName");


  if (name) {

    name.textContent =
      station.name;

  }


  const brand =
    App.$("selectedStationBrand");


  if (brand) {

    brand.textContent =
      [
        station.brand,
        station.municipality
      ]
        .filter(Boolean)
        .join(" • ");

  }


  const regular =
    App.$("selectedRegular");


  if (regular) {

    regular.textContent =
      App.money(
        prices.regular
      );

  }


  const premium =
    App.$("selectedPremium");


  if (premium) {

    premium.textContent =
      App.money(
        prices.premium
      );

  }


  const diesel =
    App.$("selectedDiesel");


  if (diesel) {

    diesel.textContent =
      App.money(
        prices.diesel
      );

  }


  const distanceElement =
    App.$("selectedStationDistance");


  if (distanceElement) {

    if (
      App.state.userLocation
    ) {

      const distance =
        GasGoData.distanceMiles(
          App.state.userLocation.lat,
          App.state.userLocation.lon,
          station.lat,
          station.lon
        );


      distanceElement.textContent =
        GasGoData.formatDistance(
          distance
        ) +
        " approx.";

    }

    else {

      distanceElement.textContent =
        "Location not shared";

    }

  }


  App.renderCanIMakeIt();

};


/* =========================================================
   CAN I MAKE IT
   ========================================================= */

App.renderCanIMakeIt = function () {

  const resultElement =
    App.$("rangeResult");


  if (!resultElement) {
    return;
  }


  const result =
    GasGoData.canIMakeIt(
      App.state.selectedStation,
      App.state.userLocation,
      App.state.vehicle
    );


  resultElement.className =
    "range-result " +
    (
      result.status || ""
    );


  let title =
    "Range estimate";


  if (
    result.status === "safe"
  ) {

    title =
      "🟢 Likely within range";

  }

  else if (
    result.status === "warning"
  ) {

    title =
      "🟡 Low safety margin";

  }

  else if (
    result.status === "danger"
  ) {

    title =
      "🔴 Choose a closer station";

  }


  let details = "";


  if (
    Number.isFinite(
      result.distance
    )
  ) {

    details +=
      "<br>Approx. straight-line distance: <strong>" +
      GasGoData.formatDistance(
        result.distance
      ) +
      "</strong>";

  }


  if (
    Number.isFinite(
      result.range
    )
  ) {

    details +=
      "<br>Estimated vehicle range: <strong>" +
      Math.round(
        result.range
      ) +
      " mi</strong>";

  }


  if (
    Number.isFinite(
      result.remaining
    ) &&
    result.remaining >= 0
  ) {

    details +=
      "<br>Estimated remaining range: <strong>" +
      Math.round(
        result.remaining
      ) +
      " mi</strong>";

  }


  resultElement.innerHTML = `

    <div class="range-result-title">
      ${title}
    </div>

    ${App.escape(result.message)}

    ${details}

    <div class="muted mt-8">
      Prototype estimate only. Actual driving distance,
      traffic, driving style and vehicle conditions may vary.
    </div>
  `;

};


/* =========================================================
   SAFER OPTION
   ========================================================= */

App.findSaferOption = function () {

  if (
    !App.state.userLocation
  ) {

    App.toast(
      "Share your location first.",
      "error"
    );

    App.requestLocation();

    return;

  }


  const safer =
    GasGoData.findSaferStation(
      App.state.stations,
      App.state.userLocation,
      App.state.vehicle,
      App.state.selectedFuel
    );


  if (!safer) {

    App.toast(
      "No safer mapped option was found.",
      "error"
    );

    return;

  }


  App.selectStation(
    safer,
    true
  );


  App.toast(
    "Safer nearby option selected.",
    "success"
  );

};


/* =========================================================
   DIRECTIONS
   ========================================================= */

App.openDirections = function () {

  const station =
    App.state.selectedStation;


  if (!station) {

    App.toast(
      "Choose a station first.",
      "error"
    );

    return;

  }


  const isAppleDevice =
    /iPad|iPhone|iPod|Macintosh/i
      .test(
        navigator.userAgent
      );


  const url =
    isAppleDevice
      ?
      GasGoData.getAppleMapsURL(
        station
      )
      :
      GasGoData.getGoogleMapsURL(
        station
      );


  window.open(
    url,
    "_blank",
    "noopener"
  );

};


/* =========================================================
   USER LOCATION
   ========================================================= */

App.requestLocation = function () {

  if (
    !navigator.geolocation
  ) {

    App.toast(
      "Location is not supported by this browser.",
      "error"
    );

    return;

  }


  App.setStationStatus(
    "Waiting for location permission…"
  );


  navigator.geolocation
    .getCurrentPosition(

      position => {

        App.state.userLocation = {

          lat:
            position.coords.latitude,

          lon:
            position.coords.longitude,

          accuracy:
            position.coords.accuracy

        };


        App.state.locationPermission =
          "granted";


        App.renderUserMarker();


        App.applyStationFilters();


        App.renderStationSheet();


        App.updateSmartStop();


        App.setStationStatus(
          "Location enabled. Distances are approximate; map prices remain demo estimates."
        );


        App.toast(
          "Location enabled.",
          "success"
        );

      },

      error => {

        App.state.locationPermission =
          "denied";


        console.warn(
          "Location error:",
          error
        );


        App.setStationStatus(
          "Location wasn't shared. You can still explore stations manually."
        );


        App.toast(
          "Location wasn't shared.",
          "error"
        );

      },

      {
        enableHighAccuracy:
          false,

        timeout:
          10000,

        maximumAge:
          60000
      }

    );

};


/* =========================================================
   USER MAP MARKER
   ========================================================= */

App.renderUserMarker = function () {

  if (
    !App.state.map ||
    !App.state.userLocation
  ) {

    return;

  }


  if (
    App.state.userMarker
  ) {

    App.state.map.removeLayer(
      App.state.userMarker
    );

  }


  const icon =
    L.divIcon({

      className: "",

      html:
        '<div class="user-location-marker"></div>',

      iconSize:
        [18, 18],

      iconAnchor:
        [9, 9]

    });


  App.state.userMarker =
    L.marker(
      [
        App.state.userLocation.lat,
        App.state.userLocation.lon
      ],
      {
        icon,
        zIndexOffset: 1000
      }
    )
      .addTo(
        App.state.map
      )
      .bindPopup(
        "Your approximate location"
      );


  App.state.map.flyTo(
    [
      App.state.userLocation.lat,
      App.state.userLocation.lon
    ],
    13,
    {
      duration: 0.7
    }
  );

};


/* =========================================================
   RESET MAP
   ========================================================= */

App.resetMap = function () {

  if (
    !App.state.map
  ) {

    return;

  }


  App.state.map.flyTo(
    [
      GasGoData.PR_CENTER.lat,
      GasGoData.PR_CENTER.lon
    ],
    GasGoData.PR_CENTER.zoom,
    {
      duration: 0.6
    }
  );

};


/* =========================================================
   SMART STOP
   ========================================================= */

App.updateSmartStop = function () {

  const card =
    App.$("smartStopCard");


  if (!card) {
    return;
  }


  if (
    App.state.stations.length === 0
  ) {

    card.innerHTML = `

      <div class="smart-stop-title">
        Finding your Smart Stop…
      </div>

      <div class="smart-stop-subtitle">
        Loading mapped fuel locations.
      </div>
    `;

    return;

  }


  const smart =
    GasGoData.getSmartStop(
      App.state.stations,
      App.state.userLocation,
      App.state.vehicle,
      App.state.selectedFuel
    );


  App.state.smartStop =
    smart;


  if (
    !smart ||
    !smart.station
  ) {

    card.innerHTML = `

      <div class="smart-stop-title">
        Smart Stop unavailable
      </div>

      <div class="smart-stop-subtitle">
        Try again after stations finish loading.
      </div>
    `;

    return;

  }


  const station =
    smart.station;


  const prices =
    station.prices ||
    GasGoData.getStationPrices(
      station
    );


  let safetyText =
    "Location needed";


  let safetyClass =
    "";


  if (
    smart.safety === "safe"
  ) {

    safetyText =
      "Safe range";

    safetyClass =
      "smart-safe";

  }

  else if (
    smart.safety === "warning"
  ) {

    safetyText =
      "Low range";

    safetyClass =
      "smart-warning";

  }

  else if (
    smart.safety === "danger"
  ) {

    safetyText =
      "Range risk";

    safetyClass =
      "smart-danger";

  }


  let distanceText =
    "—";


  if (
    Number.isFinite(
      smart.distance
    )
  ) {

    distanceText =
      GasGoData.formatDistance(
        smart.distance
      );

  }


  const average =
    GasGoData.averagePrice(
      App.state.stations,
      App.state.selectedFuel
    );


  const liters =
    40;


  const savings =
    Number.isFinite(average)
      ?
      GasGoData.estimateSavings(
        prices[
          App.state.selectedFuel
        ],
        average,
        liters
      )
      :
      0;


  card.innerHTML = `

    <div class="smart-stop-header">

      <div>

        <div class="eyebrow">
          GasGo Smart Stop
        </div>

        <div class="smart-stop-title">
          ${App.escape(station.name)}
        </div>

        <div class="smart-stop-subtitle">
          ${App.escape(station.brand)}
          ${
            station.municipality
              ?
              " • " +
              App.escape(
                station.municipality
              )
              :
              ""
          }
        </div>

      </div>

      <div class="smart-stop-price">

        ${App.money(
          prices[
            App.state.selectedFuel
          ]
        )}

        <small>
          /L
        </small>

      </div>

    </div>


    <div class="smart-stop-grid">

      <div class="smart-stat">

        <span>
          Distance
        </span>

        <strong>
          ${distanceText}
        </strong>

      </div>


      <div class="smart-stat">

        <span>
          Range
        </span>

        <strong class="${safetyClass}">
          ${safetyText}
        </strong>

      </div>


      <div class="smart-stat">

        <span>
          Est. savings
        </span>

        <strong>
          ${App.money(savings)}
        </strong>

      </div>

    </div>


    <div class="muted">

      ${
        App.state.userLocation
          ?
          "Recommendation combines demo fuel price and approximate straight-line distance."
          :
          "Share location to include distance and estimated range in the recommendation."
      }

    </div>


    <div class="button-row mt-12">

      <button
        class="secondary"
        onclick="GasGoApp.openSmartStop()"
      >
        VIEW
      </button>

      <button
        class="primary"
        onclick="GasGoApp.goToSmartStop()"
      >
        GO
      </button>

    </div>
  `;

};


/* =========================================================
   OPEN SMART STOP
   ========================================================= */

App.openSmartStop = function () {

  if (
    !App.state.smartStop ||
    !App.state.smartStop.station
  ) {

    return;

  }


  App.showScreen(
    "stations"
  );


  setTimeout(
    () => {

      App.selectStation(
        App.state.smartStop.station,
        true
      );

    },
    180
  );

};


/* =========================================================
   GO SMART STOP
   ========================================================= */

App.goToSmartStop = function () {

  if (
    !App.state.smartStop ||
    !App.state.smartStop.station
  ) {

    return;

  }


  App.state.selectedStation =
    App.state.smartStop.station;


  App.openDirections();

};


/* =========================================================
   VEHICLE RENDER
   ========================================================= */

App.renderVehicle = function () {

  const vehicle =
    App.state.vehicle;


  if (!vehicle) {
    return;
  }


  const title =
    App.$("vehicleTitle");


  if (title) {

    title.textContent =
      vehicle.year +
      " " +
      vehicle.make +
      " " +
      vehicle.model;

  }


  const type =
    App.$("vehicleType");


  if (type) {

    type.textContent =
      vehicle.powertrain;

  }


  const level =
    App.$("vehicleLevelDisplay");


  if (level) {

    level.textContent =
      Math.round(
        vehicle.level
      ) + "%";

  }


  const range =
    App.$("vehicleRangeDisplay");


  if (range) {

    range.textContent =
      Math.round(
        App.getVehicleRange()
      ) +
      " mi";

  }


  const full =
    App.$("vehicleFullRangeDisplay");


  if (full) {

    full.textContent =
      Math.round(
        vehicle.fullRange
      ) +
      " mi";

  }

};


/* =========================================================
   OPEN VEHICLE MODAL
   ========================================================= */

App.openVehicleModal = function () {

  const modal =
    App.$("vehicleModal");


  if (!modal) {
    return;
  }


  App.populateVehicleYears();

  App.populateVehicleMakes();


  const vehicle =
    App.state.vehicle ||
    App.DEFAULT_VEHICLE;


  const year =
    App.$("vehicleYear");


  if (year) {

    year.value =
      String(
        vehicle.year
      );

  }


  const make =
    App.$("vehicleMake");


  if (make) {

    make.value =
      vehicle.make;

  }


  App.updateVehicleModels(
    vehicle.model
  );


  const powertrain =
    App.$("vehiclePowertrain");


  if (powertrain) {

    powertrain.value =
      vehicle.powertrain;

  }


  const level =
    App.$("vehicleLevel");


  if (level) {

    level.value =
      vehicle.level;

  }


  const fullRange =
    App.$("vehicleFullRange");


  if (fullRange) {

    fullRange.value =
      vehicle.fullRange;

  }


  App.updateVehicleSliderLabels();


  modal.classList.add(
    "open"
  );

};


/* =========================================================
   CLOSE VEHICLE MODAL
   ========================================================= */

App.closeVehicleModal = function () {

  const modal =
    App.$("vehicleModal");


  if (modal) {

    modal.classList.remove(
      "open"
    );

  }

};


/* =========================================================
   VEHICLE YEARS
   ========================================================= */

App.populateVehicleYears = function () {

  const select =
    App.$("vehicleYear");


  if (
    !select ||
    select.options.length > 0
  ) {

    return;

  }


  for (
    let year = 2027;
    year >= 1996;
    year--
  ) {

    const option =
      document.createElement(
        "option"
      );


    option.value =
      year;


    option.textContent =
      year;


    select.appendChild(
      option
    );

  }

};


/* =========================================================
   VEHICLE MAKES
   ========================================================= */

App.populateVehicleMakes = function () {

  const select =
    App.$("vehicleMake");


  if (!select) {
    return;
  }


  select.innerHTML = "";


  Object.keys(
    App.VEHICLES
  )
    .forEach(
      make => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          make;


        option.textContent =
          make;


        select.appendChild(
          option
        );

      }
    );

};


/* =========================================================
   VEHICLE MODELS
   ========================================================= */

App.updateVehicleModels = function (
  selectedModel = null
) {

  const makeSelect =
    App.$("vehicleMake");


  const modelSelect =
    App.$("vehicleModel");


  if (
    !makeSelect ||
    !modelSelect
  ) {

    return;

  }


  const make =
    makeSelect.value;


  const models =
    App.VEHICLES[make] ||
    ["Other"];


  modelSelect.innerHTML = "";


  models.forEach(
    model => {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        model;


      option.textContent =
        model;


      modelSelect.appendChild(
        option
      );

    }
  );


  if (
    selectedModel &&
    models.includes(
      selectedModel
    )
  ) {

    modelSelect.value =
      selectedModel;

  }

};


/* =========================================================
   VEHICLE SLIDER LABELS
   ========================================================= */

App.updateVehicleSliderLabels = function () {

  const level =
    App.$("vehicleLevel");


  const levelValue =
    App.$("vehicleLevelValue");


  if (
    level &&
    levelValue
  ) {

    levelValue.textContent =
      level.value +
      "%";

  }


  const range =
    App.$("vehicleFullRange");


  const rangeValue =
    App.$("vehicleFullRangeValue");


  if (
    range &&
    rangeValue
  ) {

    rangeValue.textContent =
      range.value +
      " mi";

  }

};


/* =========================================================
   SAVE VEHICLE
   ========================================================= */

App.saveVehicle = function () {

  const year =
    Number(
      App.$("vehicleYear")?.value
    );


  const make =
    App.$("vehicleMake")?.value;


  const model =
    App.$("vehicleModel")?.value;


  const powertrain =
    App.$("vehiclePowertrain")?.value;


  const level =
    Number(
      App.$("vehicleLevel")?.value
    );


  const fullRange =
    Number(
      App.$("vehicleFullRange")?.value
    );


  if (
    !year ||
    !make ||
    !model ||
    !powertrain
  ) {

    App.toast(
      "Complete your vehicle information.",
      "error"
    );

    return;

  }


  App.state.vehicle = {

    year,

    make,

    model,

    powertrain,

    level:
      App.clamp(
        level,
        0,
        100
      ),

    fullRange:
      App.clamp(
        fullRange,
        50,
        650
      )

  };


  App.saveStorage(
    App.STORAGE.vehicle,
    App.state.vehicle
  );


  App.closeVehicleModal();

  App.renderVehicle();

  App.renderHomeVehicle();

  App.renderStationSheet();

  App.updateSmartStop();


  App.toast(
    "Vehicle saved.",
    "success"
  );

};


/* =========================================================
   REWARDS
   ========================================================= */

App.renderRewards = function () {

  const container =
    App.$("rewardsList");


  if (!container) {
    return;
  }


  const rewards =
    App.state.rewards;


  let totalPoints = 0;


  Object.values(
    rewards
  )
    .forEach(
      reward => {

        totalPoints +=
          Number(
            reward.points || 0
          );

      }
    );


  const total =
    App.$("totalRewardPoints");


  if (total) {

    total.textContent =
      totalPoints.toLocaleString();

  }


  container.innerHTML =
    Object.entries(
      rewards
    )
      .map(
        ([brand, reward]) => {

          const points =
            Number(
              reward.points || 0
            );


          const tiers =
            Array.isArray(
              reward.tiers
            )
              ?
              reward.tiers
              :
              [];


          const maximum =
            tiers.length
              ?
              Math.max(
                ...tiers.map(
                  tier =>
                    Number(
                      tier.points
                    )
                )
              )
              :
              1000;


          const progress =
            Math.min(
              100,
              (
                points /
                maximum
              ) *
              100
            );


          const next =
            tiers.find(
              tier =>
                points <
                Number(
                  tier.points
                )
            );


          return `

            <div
              class="card reward-card"
              onclick="GasGoApp.toggleRewardCard(this)"
            >

              <div class="reward-head">

                <div class="reward-logo">
                  ${App.escape(
                    brand.charAt(0)
                  )}
                </div>

                <div class="reward-info">

                  <strong>
                    ${App.escape(brand)}
                  </strong>

                  <div class="muted">
                    GasGo Rewards
                  </div>

                </div>

                <div class="reward-points">
                  ${points.toLocaleString()} pts
                </div>

              </div>


              <div class="reward-bar">

                <div
                  style="width:${progress}%"
                ></div>

              </div>


              <div class="muted">

                ${
                  next
                    ?
                    (
                      Number(
                        next.points
                      ) -
                      points
                    ) +
                    " points to " +
                    App.escape(
                      next.title
                    )
                    :
                    "Top reward unlocked 🎉"
                }

              </div>


              <div class="reward-details">

                ${
                  tiers.map(
                    tier => {

                      const unlocked =
                        points >=
                        Number(
                          tier.points
                        );


                      return `

                        <div
                          class="reward-tier ${
                            unlocked
                              ?
                              "unlocked"
                              :
                              ""
                          }"
                        >

                          <div class="reward-lock">
                            ${
                              unlocked
                                ?
                                "✓"
                                :
                                "🔒"
                            }
                          </div>

                          <div class="flex-1">

                            <strong>
                              ${App.escape(
                                tier.title
                              )}
                            </strong>

                            <div class="muted">
                              ${tier.points} points
                            </div>

                          </div>

                        </div>
                      `;

                    }
                  ).join("")
                }


                <button
                  class="secondary full-button mt-12"
                  onclick="event.stopPropagation(); GasGoApp.addDemoPoints('${App.escape(brand)}')"
                >
                  + DEMO PURCHASE · 50 PTS
                </button>

              </div>

            </div>
          `;

        }
      )
      .join("");

};


/* =========================================================
   TOGGLE REWARD
   ========================================================= */

App.toggleRewardCard = function (
  card
) {

  App.$all(
    ".reward-card"
  )
    .forEach(
      item => {

        if (
          item !== card
        ) {

          item.classList.remove(
            "open"
          );

        }

      }
    );


  card.classList.toggle(
    "open"
  );

};


/* =========================================================
   DEMO REWARD POINTS
   ========================================================= */

App.addDemoPoints = function (
  brand
) {

  if (
    !App.state.rewards[brand]
  ) {

    return;

  }


  App.state.rewards[brand].points =
    Number(
      App.state.rewards[brand].points || 0
    ) + 50;


  App.saveStorage(
    App.STORAGE.rewards,
    App.state.rewards
  );


  App.renderRewards();


  App.toast(
    "+50 " +
    brand +
    " points",
    "success"
  );

};


/* =========================================================
   OPEN FUEL LOG MODAL
   ========================================================= */

App.openFuelLogModal = function () {

  const modal =
    App.$("fuelLogModal");


  if (!modal) {
    return;
  }


  const date =
    App.$("logDate");


  if (date) {

    date.value =
      new Date()
        .toISOString()
        .slice(
          0,
          10
        );

  }


  const station =
    App.$("logStation");


  if (
    station &&
    App.state.selectedStation
  ) {

    station.value =
      App.state.selectedStation.name;

  }


  App.updateFuelLogPreview();


  modal.classList.add(
    "open"
  );

};


/* =========================================================
   CLOSE FUEL LOG MODAL
   ========================================================= */

App.closeFuelLogModal = function () {

  const modal =
    App.$("fuelLogModal");


  if (modal) {

    modal.classList.remove(
      "open"
    );

  }

};


/* =========================================================
   FUEL LOG PREVIEW
   ========================================================= */

App.updateFuelLogPreview = function () {

  const liters =
    Number(
      App.$("logLiters")?.value
    );


  const price =
    Number(
      App.$("logPrice")?.value
    );


  const total =
    (
      Number.isFinite(liters) &&
      Number.isFinite(price)
    )
      ?
      liters * price
      :
      0;


  const element =
    App.$("logCalculatedTotal");


  if (element) {

    element.textContent =
      App.money(total);

  }

};


/* =========================================================
   SAVE FUEL LOG
   ========================================================= */

App.saveFuelLog = function () {

  const date =
    App.$("logDate")?.value;


  const station =
    String(
      App.$("logStation")?.value ||
      ""
    ).trim();


  const fuel =
    App.$("logFuel")?.value ||
    "regular";


  const liters =
    Number(
      App.$("logLiters")?.value
    );


  const price =
    Number(
      App.$("logPrice")?.value
    );


  const odometer =
    Number(
      App.$("logOdometer")?.value
    );


  if (
    !date ||
    !station ||
    !Number.isFinite(liters) ||
    liters <= 0 ||
    !Number.isFinite(price) ||
    price <= 0
  ) {

    App.toast(
      "Complete the fuel log.",
      "error"
    );

    return;

  }


  const total =
    liters *
    price;


  const averagePrice =
    App.state.stations.length
      ?
      GasGoData.averagePrice(
        App.state.stations,
        fuel
      )
      :
      null;


  const estimatedSavings =
    Number.isFinite(
      averagePrice
    )
      ?
      GasGoData.estimateSavings(
        price,
        averagePrice,
        liters
      )
      :
      0;


  const entry = {

    id:
      "log-" +
      Date.now(),

    date,

    station,

    fuel,

    liters,

    price,

    total,

    odometer:
      Number.isFinite(odometer)
        ?
        odometer
        :
        null,

    estimatedSavings

  };


  App.state.fuelLogs.unshift(
    entry
  );


  App.saveStorage(
    App.STORAGE.fuelLogs,
    App.state.fuelLogs
  );


  App.closeFuelLogModal();

  App.clearFuelLogForm();

  App.renderDashboard();


  App.toast(
    "Fuel purchase saved.",
    "success"
  );

};


/* =========================================================
   CLEAR FUEL LOG FORM
   ========================================================= */

App.clearFuelLogForm = function () {

  [
    "logStation",
    "logLiters",
    "logPrice",
    "logOdometer"
  ]
    .forEach(
      id => {

        const input =
          App.$(id);

        if (input) {

          input.value = "";

        }

      }
    );


  App.updateFuelLogPreview();

};


/* =========================================================
   DELETE FUEL LOG
   ========================================================= */

App.deleteFuelLog = function (
  id
) {

  App.state.fuelLogs =
    App.state.fuelLogs.filter(
      log =>
        String(log.id) !==
        String(id)
    );


  App.saveStorage(
    App.STORAGE.fuelLogs,
    App.state.fuelLogs
  );


  App.renderDashboard();


  App.toast(
    "Fuel log removed."
  );

};


/* =========================================================
   DASHBOARD STATS
   ========================================================= */

App.calculateDashboardStats = function () {

  const logs =
    App.state.fuelLogs;


  const totalSpent =
    logs.reduce(
      (sum, log) =>
        sum +
        Number(
          log.total || 0
        ),
      0
    );


  const totalLiters =
    logs.reduce(
      (sum, log) =>
        sum +
        Number(
          log.liters || 0
        ),
      0
    );


  const savings =
    logs.reduce(
      (sum, log) =>
        sum +
        Number(
          log.estimatedSavings || 0
        ),
      0
    );


  const averagePrice =
    totalLiters > 0
      ?
      totalSpent /
      totalLiters
      :
      0;


  return {

    totalSpent,

    totalLiters,

    savings,

    averagePrice,

    fillUps:
      logs.length

  };

};


/* =========================================================
   DASHBOARD
   ========================================================= */

App.renderDashboard = function () {

  const stats =
    App.calculateDashboardStats();


  const spent =
    App.$("dashSpent");


  if (spent) {

    spent.textContent =
      App.money(
        stats.totalSpent
      );

  }


  const liters =
    App.$("dashLiters");


  if (liters) {

    liters.textContent =
      App.number(
        stats.totalLiters,
        1
      ) +
      " L";

  }


  const savings =
    App.$("dashSavings");


  if (savings) {

    savings.textContent =
      App.money(
        stats.savings
      );

  }


  const fills =
    App.$("dashFillUps");


  if (fills) {

    fills.textContent =
      stats.fillUps;

  }


  const average =
    App.$("dashAveragePrice");


  if (average) {

    average.textContent =
      stats.averagePrice > 0
        ?
        App.money(
          stats.averagePrice
        ) +
        "/L"
        :
        "—";

  }


  App.renderFuelLogs();

  App.renderSpendingChart();

};


/* =========================================================
   FUEL LOG LIST
   ========================================================= */

App.renderFuelLogs = function () {

  const container =
    App.$("fuelLogList");


  if (!container) {
    return;
  }


  const logs =
    App.state.fuelLogs;


  if (
    logs.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          ⛽
        </div>

        <strong>
          No fill-ups yet
        </strong>

        Add your first fuel purchase to start tracking spending.

      </div>
    `;

    return;

  }


  container.innerHTML =
    logs.slice(
      0,
      30
    )
      .map(
        log => `

          <div class="log-item">

            <div class="log-icon">
              ⛽
            </div>

            <div class="log-info">

              <div class="log-title">
                ${App.escape(
                  log.station
                )}
              </div>

              <div class="log-meta">

                ${App.escape(
                  log.date
                )}

                • ${App.number(
                  log.liters,
                  1
                )} L

                • ${App.money(
                  log.price
                )}/L

              </div>

            </div>

            <div>

              <div class="log-total">
                ${App.money(
                  log.total
                )}
              </div>

              <button
                class="section-link"
                onclick="GasGoApp.deleteFuelLog('${App.escape(log.id)}')"
              >
                Remove
              </button>

            </div>

          </div>
        `
      )
      .join("");

};


/* =========================================================
   MONTHLY CHART DATA
   ========================================================= */

App.getMonthlySpending = function () {

  const months = [];


  const now =
    new Date();


  for (
    let offset = 5;
    offset >= 0;
    offset--
  ) {

    const date =
      new Date(
        now.getFullYear(),
        now.getMonth() - offset,
        1
      );


    months.push({

      year:
        date.getFullYear(),

      month:
        date.getMonth(),

      label:
        date.toLocaleDateString(
          "en-US",
          {
            month: "short"
          }
        ),

      total: 0

    });

  }


  App.state.fuelLogs
    .forEach(
      log => {

        const date =
          new Date(
            log.date +
            "T12:00:00"
          );


        if (
          Number.isNaN(
            date.getTime()
          )
        ) {

          return;

        }


        const month =
          months.find(
            item =>
              item.year ===
                date.getFullYear()
              &&
              item.month ===
                date.getMonth()
          );


        if (month) {

          month.total +=
            Number(
              log.total || 0
            );

        }

      }
    );


  return months;

};


/* =========================================================
   SPENDING CHART
   ========================================================= */

App.renderSpendingChart = function () {

  const container =
    App.$("spendingChart");


  if (!container) {
    return;
  }


  const months =
    App.getMonthlySpending();


  const maximum =
    Math.max(
      1,
      ...months.map(
        month =>
          month.total
      )
    );


  container.innerHTML =
    months.map(
      month => {

        const height =
          month.total > 0
            ?
            Math.max(
              5,
              (
                month.total /
                maximum
              ) *
              100
            )
            :
            2;


        return `

          <div class="chart-column">

            <div class="chart-value">

              ${
                month.total > 0
                  ?
                  App.money(
                    month.total
                  )
                  :
                  ""
              }

            </div>

            <div class="chart-bar-wrap">

              <div
                class="chart-bar"
                style="height:${height}%"
              ></div>

            </div>

            <div class="chart-label">
              ${month.label}
            </div>

          </div>
        `;

      }
    )
    .join("");

};


/* =========================================================
   PRICE REFERENCE
   ========================================================= */

App.renderPriceReference = function () {

  const container =
    App.$("brandPriceList");


  if (!container) {
    return;
  }


  const prices =
    GasGoData.BRAND_PRICES;


  const brands =
    Object.keys(prices)
      .filter(
        brand =>
          brand !==
          "Independent"
      )
      .sort(
        (a, b) =>
          a.localeCompare(b)
      );


  container.innerHTML =
    brands.map(
      brand => {

        const price =
          prices[brand];


        return `

          <div class="card price-card">

            <div class="row">

              <div>

                <strong>
                  ${App.escape(brand)}
                </strong>

                <div class="muted">
                  Puerto Rico brand reference
                </div>

              </div>

              <span class="badge">
                DEMO BASE
              </span>

            </div>


            <div class="price-grid mt-12">

              <div class="price-box">

                <span>
                  Regular
                </span>

                <b>
                  ${App.money(
                    price.regular
                  )}
                </b>

                <span>
                  per L
                </span>

              </div>


              <div class="price-box">

                <span>
                  Premium
                </span>

                <b>
                  ${App.money(
                    price.premium
                  )}
                </b>

                <span>
                  per L
                </span>

              </div>


              <div class="price-box">

                <span>
                  Diesel
                </span>

                <b>
                  ${App.money(
                    price.diesel
                  )}
                </b>

                <span>
                  per L
                </span>

              </div>

            </div>

          </div>
        `;

      }
    )
    .join("");

};


/* =========================================================
   CLOSE MODALS BY BACKDROP
   ========================================================= */

App.setupModalBackdrop = function () {

  App.$all(".modal")
    .forEach(
      modal => {

        modal.addEventListener(
          "click",
          event => {

            if (
              event.target ===
              modal
            ) {

              modal.classList.remove(
                "open"
              );

            }

          }
        );

      }
    );

};


/* =========================================================
   ESC KEY
   ========================================================= */

App.setupKeyboard = function () {

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Escape"
      ) {

        App.$all(
          ".modal.open"
        )
          .forEach(
            modal =>
              modal.classList.remove(
                "open"
              )
          );

      }

    }
  );

};


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

App.setupListeners = function () {

  const search =
    App.$("stationSearch");


  if (search) {

    search.addEventListener(
      "input",
      event => {

        App.searchStations(
          event.target.value
        );

      }
    );

  }


  const make =
    App.$("vehicleMake");


  if (make) {

    make.addEventListener(
      "change",
      () => {

        App.updateVehicleModels();

      }
    );

  }


  const level =
    App.$("vehicleLevel");


  if (level) {

    level.addEventListener(
      "input",
      App.updateVehicleSliderLabels
    );

  }


  const fullRange =
    App.$("vehicleFullRange");


  if (fullRange) {

    fullRange.addEventListener(
      "input",
      App.updateVehicleSliderLabels
    );

  }


  [
    "logLiters",
    "logPrice"
  ]
    .forEach(
      id => {

        const input =
          App.$(id);


        if (input) {

          input.addEventListener(
            "input",
            App.updateFuelLogPreview
          );

        }

      }
    );


  App.setupModalBackdrop();

  App.setupKeyboard();

};


/* =========================================================
   CLOSE ALL MODALS
   ========================================================= */

App.closeAllModals = function () {

  App.$all(
    ".modal.open"
  )
    .forEach(
      modal => {

        modal.classList.remove(
          "open"
        );

      }
    );

};


/* =========================================================
   HOME QUICK ACTIONS
   ========================================================= */

App.openStations = function () {

  App.showScreen(
    "stations"
  );

};


App.openDashboard = function () {

  App.showScreen(
    "dashboard"
  );

};


App.openRewards = function () {

  App.showScreen(
    "rewards"
  );

};


App.openCar = function () {

  App.showScreen(
    "car"
  );

};


App.openPrices = function () {

  App.showScreen(
    "prices"
  );

};


/* =========================================================
   INITIALIZE
   ========================================================= */

App.init = async function () {

  console.log(
    "GasGo app starting:",
    App.VERSION
  );


  if (
    !window.GasGoData
  ) {

    console.error(
      "GasGoData missing. Make sure stations.js loads before app.js."
    );


    App.toast(
      "GasGo station engine failed to load.",
      "error"
    );

    return;

  }


  App.loadLocalData();

  App.setupListeners();

  App.renderHomeVehicle();

  App.renderVehicle();

  App.renderRewards();

  App.renderDashboard();

  App.renderPriceReference();


  /*
    Start loading stations immediately.

    Map itself waits until the Stations screen is opened.
  */

  App.loadStations();


  App.showScreen(
    "home"
  );


  console.log(
    "GasGo ready."
  );

};


/* =========================================================
   START WHEN DOM IS READY
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    App.init
  );

}

else {

  App.init();

}
