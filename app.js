/* =========================================================
   GASGO — APP.JS
   Version 5.3
   Fuel + EV + Fast Map + Smart Stop + Plan My Stop
   ========================================================= */

"use strict";

window.GasGoApp = window.GasGoApp || {};
const App = window.GasGoApp;

App.VERSION = "5.3.0";


/* =========================================================
   STORAGE
   ========================================================= */

App.STORAGE = {
  vehicle: "gasgoVehicleV5",
  rewards: "gasgoRewardsV5",
  fuelLogs: "gasgoFuelLogsV5",
  favorites: "gasgoFavoritesV5",
  settings: "gasgoSettingsV5"
};


/* =========================================================
   STATE
   ========================================================= */

App.state = {
  screen: "home",

  stations: [],
  filteredStations: [],

  stationSource: "",
  usingFallback: false,

  selectedStation: null,

  selectedBrand: "all",
  selectedKind: "all",
  selectedFuel: "regular",
  sortMode: "best",
  searchQuery: "",

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

  smartStop: null,

  planAmount: 20,
  planStation: null
};


/* =========================================================
   VEHICLE DATABASE
   ========================================================= */

App.VEHICLES = {
  Toyota: [
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

  Honda: [
    "Civic",
    "Accord",
    "CR-V",
    "HR-V",
    "Pilot",
    "Ridgeline",
    "Odyssey",
    "Other"
  ],

  Chevrolet: [
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

  Hyundai: [
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

  Kia: [
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

  Nissan: [
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

  Ford: [
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

  Jeep: [
    "Wrangler",
    "Compass",
    "Renegade",
    "Cherokee",
    "Grand Cherokee",
    "Gladiator",
    "Other"
  ],

  Mitsubishi: [
    "Mirage",
    "Outlander",
    "Outlander Sport",
    "Eclipse Cross",
    "Outlander PHEV",
    "Other"
  ],

  Mazda: [
    "Mazda3",
    "CX-30",
    "CX-5",
    "CX-50",
    "CX-90",
    "MX-5 Miata",
    "Other"
  ],

  Subaru: [
    "Impreza",
    "Legacy",
    "Crosstrek",
    "Forester",
    "Outback",
    "WRX",
    "Other"
  ],

  Volkswagen: [
    "Jetta",
    "Golf",
    "Taos",
    "Tiguan",
    "Atlas",
    "ID.4",
    "Other"
  ],

  BMW: [
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

  Audi: [
    "A3",
    "A4",
    "A5",
    "Q3",
    "Q5",
    "Q7",
    "e-tron",
    "Other"
  ],

  Lexus: [
    "IS",
    "ES",
    "UX",
    "NX",
    "RX",
    "GX",
    "Other"
  ],

  Tesla: [
    "Model 3",
    "Model Y",
    "Model S",
    "Model X",
    "Cybertruck",
    "Other"
  ],

  Acura: [
    "Integra",
    "TLX",
    "RDX",
    "MDX",
    "Other"
  ],

  GMC: [
    "Terrain",
    "Acadia",
    "Canyon",
    "Sierra",
    "Yukon",
    "Hummer EV",
    "Other"
  ],

  Dodge: [
    "Charger",
    "Challenger",
    "Durango",
    "Hornet",
    "Other"
  ],

  Ram: [
    "1500",
    "2500",
    "3500",
    "ProMaster",
    "Other"
  ],

  Other: ["Other"]
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
  fullRange: 350,
  tankCapacity: 46
};


/* =========================================================
   REWARDS
   ========================================================= */

App.DEFAULT_REWARDS = {
  Puma: {
    points: 750,
    tiers: [
      { points: 250, title: "$2 off next purchase" },
      { points: 500, title: "$5 fuel credit" },
      { points: 1000, title: "$10 reward" }
    ]
  },

  Shell: {
    points: 420,
    tiers: [
      { points: 200, title: "$2 reward" },
      { points: 500, title: "$5 reward" },
      { points: 1000, title: "$10 reward" }
    ]
  },

  Total: {
    points: 0,
    tiers: [
      { points: 250, title: "Car wash discount" },
      { points: 500, title: "$5 reward" },
      { points: 1000, title: "$10 reward" }
    ]
  }
};


/* =========================================================
   HELPERS
   ========================================================= */

App.$ = function (id) {
  return document.getElementById(id);
};

App.$all = function (selector) {
  return Array.from(document.querySelectorAll(selector));
};

App.clamp = function (value, min, max) {
  return Math.max(min, Math.min(max, Number(value)));
};

App.money = function (value) {
  const n = Number(value);
  return Number.isFinite(n) ? "$" + n.toFixed(2) : "—";
};

App.number = function (value, decimals = 1) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(decimals) : "0";
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

App.safeJSON = function (value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

App.loadStorage = function (key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null
      ? fallback
      : App.safeJSON(raw, fallback);
  } catch {
    return fallback;
  }
};

App.saveStorage = function (key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};


/* =========================================================
   TOAST
   ========================================================= */

App.toast = function (message, type = "") {
  let container = App.$("toastContainer");

  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");

  toast.className = "toast " + type;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
  }, 2800);

  setTimeout(() => {
    toast.remove();
  }, 3300);
};


/* =========================================================
   LOCAL DATA
   ========================================================= */

App.loadLocalData = function () {
  let vehicle = App.loadStorage(
    App.STORAGE.vehicle,
    null
  );

  if (!vehicle || typeof vehicle !== "object") {
    vehicle = { ...App.DEFAULT_VEHICLE };
  }

  vehicle.level = Number.isFinite(Number(vehicle.level))
    ? Number(vehicle.level)
    : App.DEFAULT_VEHICLE.level;

  vehicle.fullRange =
    Number.isFinite(Number(vehicle.fullRange))
      ? Number(vehicle.fullRange)
      : App.DEFAULT_VEHICLE.fullRange;

  if (
    !Number.isFinite(Number(vehicle.tankCapacity)) ||
    Number(vehicle.tankCapacity) <= 0
  ) {
    vehicle.tankCapacity =
      App.DEFAULT_VEHICLE.tankCapacity;
  }

  App.state.vehicle = vehicle;

  App.saveStorage(
    App.STORAGE.vehicle,
    App.state.vehicle
  );

  const savedRewards = App.loadStorage(
    App.STORAGE.rewards,
    null
  );

  App.state.rewards =
    savedRewards &&
    typeof savedRewards === "object"
      ? savedRewards
      : JSON.parse(
          JSON.stringify(App.DEFAULT_REWARDS)
        );

  App.state.fuelLogs = App.loadStorage(
    App.STORAGE.fuelLogs,
    []
  );

  if (!Array.isArray(App.state.fuelLogs)) {
    App.state.fuelLogs = [];
  }

  App.state.favorites = App.loadStorage(
    App.STORAGE.favorites,
    []
  );

  if (!Array.isArray(App.state.favorites)) {
    App.state.favorites = [];
  }
};


/* =========================================================
   VEHICLE MODE
   ========================================================= */

App.getVehicleEnergyMode = function () {
  if (
    window.GasGoData &&
    typeof GasGoData.getVehicleEnergyMode === "function"
  ) {
    return GasGoData.getVehicleEnergyMode(
      App.state.vehicle
    );
  }

  const type = String(
    App.state.vehicle?.powertrain || ""
  ).toLowerCase();

  if (type === "electric") {
    return "ev";
  }

  if (
    type.includes("plug-in") ||
    type.includes("phev")
  ) {
    return "both";
  }

  return "fuel";
};


/* =========================================================
   NAVIGATION
   ========================================================= */

App.showScreen = function (screenName) {
  App.state.screen = screenName;

  App.$all(".screen").forEach(screen => {
    screen.classList.toggle(
      "active",
      screen.id === "screen-" + screenName
    );
  });

  App.$all(".nav").forEach(nav => {
    nav.classList.toggle(
      "active",
      nav.dataset.screen === screenName
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (screenName === "stations") {
    App.initializeMap();

    setTimeout(() => {
      if (App.state.map) {
        App.state.map.invalidateSize(true);
      }
    }, 120);
  }

  if (screenName === "dashboard") {
    App.renderDashboard();
  }

  if (screenName === "rewards") {
    App.renderRewards();
  }

  if (screenName === "car") {
    App.renderVehicle();
  }
};


/* =========================================================
   VEHICLE RANGE
   ========================================================= */

App.getVehicleRange = function () {
  if (!window.GasGoData) {
    return 0;
  }

  return (
    GasGoData.getEstimatedVehicleRange(
      App.state.vehicle
    ) || 0
  );
};


/* =========================================================
   HOME VEHICLE
   ========================================================= */

App.renderHomeVehicle = function () {
  const vehicle = App.state.vehicle;

  if (!vehicle) {
    return;
  }

  const range = App.getVehicleRange();

  const rangeEl = App.$("homeRange");

  if (rangeEl) {
    rangeEl.innerHTML =
      Math.round(range) +
      " <small>mi</small>";
  }

  const levelEl = App.$("homeLevel");

  if (levelEl) {
    levelEl.textContent =
      Math.round(Number(vehicle.level)) +
      "%";
  }

  const progress = App.$("homeLevelBar");

  if (progress) {
    progress.style.width =
      App.clamp(vehicle.level, 0, 100) +
      "%";
  }

  const vehicleName = App.$("homeVehicleName");

  if (vehicleName) {
    vehicleName.textContent =
      vehicle.year +
      " " +
      vehicle.make +
      " " +
      vehicle.model;
  }

  const fuelLabel = App.$("homeFuelLabel");

  if (fuelLabel) {
    fuelLabel.textContent =
      vehicle.powertrain === "Electric"
        ? "Battery"
        : "Fuel";
  }
};


/* =========================================================
   STATUS
   ========================================================= */

App.setStationStatus = function (text) {
  const element = App.$("stationStatus");

  if (element) {
    element.textContent = text;
  }
};


/* =========================================================
   LOAD LOCATIONS
   ========================================================= */

App.loadStations = async function () {
  if (App.state.stationsLoading) {
    return;
  }

  App.state.stationsLoading = true;

  App.setStationStatus(
    "Loading fuel & EV locations…"
  );

  try {
    if (!window.GasGoData) {
      throw new Error(
        "stations.js did not load."
      );
    }

    const result =
      await GasGoData.fetchStations();

    App.state.stations =
      Array.isArray(result.stations)
        ? result.stations
        : [];

    App.state.stationSource =
      result.source || "";

    App.state.usingFallback =
      Boolean(result.fallback);

    App.state.stationsLoaded = true;

    App.applyStationFilters();

    const fuelCount =
      Number(result.fuelCount) ||
      App.state.stations.filter(
        item => item.type === "fuel"
      ).length;

    const evCount =
      Number(result.evCount) ||
      App.state.stations.filter(
        item => item.type === "ev"
      ).length;

    if (result.fallback) {
      App.setStationStatus(
        fuelCount +
        " demo fuel stops • " +
        evCount +
        " demo EV chargers. Live map data is temporarily unavailable."
      );
    } else if (result.cached) {
      App.setStationStatus(
        fuelCount +
        " fuel locations • " +
        evCount +
        " EV chargers loaded from map cache."
      );
    } else {
      App.setStationStatus(
        fuelCount +
        " fuel locations • " +
        evCount +
        " EV chargers loaded from OpenStreetMap."
      );
    }

    App.renderPriceReference();
    App.updateSmartStop();
    App.renderPlanMyStop();
  } catch (error) {
    console.error(
      "GasGo location loading error:",
      error
    );

    App.state.stations =
      GasGoData.getFallbackStations();

    App.state.usingFallback = true;
    App.state.stationsLoaded = true;

    App.applyStationFilters();

    App.setStationStatus(
      "Live locations unavailable. Showing clearly labeled GasGo demo locations."
    );
  } finally {
    App.state.stationsLoading = false;
    App.hideMapLoader();
  }
};


/* =========================================================
   MAP
   ========================================================= */

App.initializeMap = function () {
  if (App.state.mapInitialized) {
    if (App.state.map) {
      App.state.map.invalidateSize(true);
    }

    return;
  }

  const mapElement = App.$("map");

  if (!mapElement) {
    return;
  }

  if (typeof window.L === "undefined") {
    App.setStationStatus(
      "The map library could not load."
    );

    App.hideMapLoader();
    return;
  }

  const center = GasGoData.PR_CENTER;

  const map = L.map("map", {
    zoomControl: true,
    preferCanvas: true
  }).setView(
    [center.lat, center.lon],
    center.zoom
  );

  App.state.map = map;

  App.state.markerLayer =
    L.layerGroup().addTo(map);

  const tiles = L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        "&copy; OpenStreetMap contributors"
    }
  );

  tiles.addTo(map);

  /*
    IMPORTANT:
    Never let the map loader depend on every map tile or
    every Overpass location finishing.
  */

  setTimeout(
    App.hideMapLoader,
    900
  );

  tiles.once("load", () => {
    App.hideMapLoader();
  });

  App.state.mapInitialized = true;

  setTimeout(() => {
    map.invalidateSize(true);
  }, 100);

  if (App.state.stationsLoaded) {
    App.renderMapStations();
  } else {
    App.loadStations();
  }
};


App.hideMapLoader = function () {
  const loader = App.$("mapLoader");

  if (loader) {
    loader.style.display = "none";
  }
};


/* =========================================================
   MAP MARKER STYLE
   ========================================================= */

App.markerStyle = function (
  station,
  selected = false
) {
  /*
    Canvas circle markers are substantially lighter than
    hundreds of HTML divIcon markers.
  */

  if (station.type === "ev") {
    return {
      radius: selected ? 10 : 7,
      weight: selected ? 4 : 2,
      opacity: 1,
      fillOpacity: 0.92
    };
  }

  return {
    radius: selected ? 10 : 7,
    weight: selected ? 4 : 2,
    opacity: 1,
    fillOpacity: 0.9
  };
};


/* =========================================================
   POPUP
   ========================================================= */

App.stationPopupHTML = function (station) {
  if (station.type === "ev") {
    const ev = station.ev || {};

    const connectors =
      Array.isArray(ev.sockets) &&
      ev.sockets.length
        ? ev.sockets.join(", ")
        : "Not listed";

    return `
      <div>
        <div class="popup-title">
          ⚡ ${App.escape(station.name)}
        </div>

        <div class="popup-brand">
          ${App.escape(station.brand || "EV Charging")}
          ${
            station.municipality
              ? " • " +
                App.escape(station.municipality)
              : ""
          }
        </div>

        <div class="popup-prices">
          <div class="popup-price">
            <span>Connectors</span>
            <strong>
              ${App.escape(connectors)}
            </strong>
          </div>

          <div class="popup-price">
            <span>Power</span>
            <strong>
              ${App.escape(ev.power || "Not listed")}
            </strong>
          </div>

          <div class="popup-price">
            <span>Ports</span>
            <strong>
              ${App.escape(ev.capacity || "—")}
            </strong>
          </div>
        </div>

        <div class="popup-demo">
          EV information shown only when provided by
          OpenStreetMap. Charging price/live availability
          may not be available.
        </div>
      </div>
    `;
  }

  const prices =
    station.prices ||
    GasGoData.getStationPrices(station);

  return `
    <div>
      <div class="popup-title">
        ⛽ ${App.escape(station.name)}
      </div>

      <div class="popup-brand">
        ${App.escape(station.brand)}
        ${
          station.municipality
            ? " • " +
              App.escape(station.municipality)
            : ""
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
        GasGo demo fuel prices • Location source:
        ${App.escape(station.source)}
      </div>
    </div>
  `;
};


/* =========================================================
   MAP RENDER
   ========================================================= */

App.renderMapStations = function () {
  if (
    !App.state.map ||
    !App.state.markerLayer
  ) {
    App.renderStationList();
    return;
  }

  App.state.markerLayer.clearLayers();
  App.state.markers.clear();

  App.state.filteredStations.forEach(
    station => {
      const selected =
        App.state.selectedStation &&
        String(
          App.state.selectedStation.id
        ) === String(station.id);

      /*
        CircleMarker uses Leaflet's Canvas renderer because
        preferCanvas=true. This is much lighter on iPhone.
      */

      const marker = L.circleMarker(
        [station.lat, station.lon],
        App.markerStyle(
          station,
          selected
        )
      );

      marker.bindTooltip(
        station.type === "ev"
          ? "⚡"
          : "⛽",
        {
          permanent: true,
          direction: "center",
          className: "gasgo-map-symbol"
        }
      );

      marker.bindPopup(
        App.stationPopupHTML(station)
      );

      marker.on("click", () => {
        App.selectStation(
          station,
          false
        );
      });

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
   FILTERS
   ========================================================= */

App.applyStationFilters = function () {
  if (!window.GasGoData) {
    return;
  }

  let stations = [
    ...App.state.stations
  ];

  stations =
    GasGoData.searchStations(
      stations,
      App.state.searchQuery
    );

  if (
    App.state.selectedKind !== "all"
  ) {
    stations =
      GasGoData.filterByEnergyType(
        stations,
        App.state.selectedKind
      );
  }

  /*
    Brand filters apply only to fuel stations. This avoids
    hiding EV chargers just because "Puma" was previously
    selected.
  */

  if (
    App.state.selectedBrand !== "all"
  ) {
    stations =
      GasGoData.filterByBrand(
        stations,
        App.state.selectedBrand
      );
  }

  if (App.state.sortMode === "cheap") {
    stations =
      GasGoData.sortCheapest(
        stations,
        App.state.selectedFuel
      );
  } else if (
    App.state.sortMode === "closest"
  ) {
    if (App.state.userLocation) {
      stations =
        GasGoData.sortClosest(
          stations,
          App.state.userLocation
        );
    } else {
      stations =
        GasGoData.sortBestValue(
          stations,
          null,
          App.state.selectedFuel
        );
    }
  } else {
    stations =
      GasGoData.sortBestValue(
        stations,
        App.state.userLocation,
        App.state.selectedFuel
      );
  }

  App.state.filteredStations = stations;

  App.renderMapStations();
  App.updateSmartStop();
};


/* =========================================================
   ENERGY FILTER
   ========================================================= */

App.setEnergyFilter = function (
  kind,
  button
) {
  App.state.selectedKind = kind;

  App.$all("[data-kind]").forEach(
    item => {
      item.classList.toggle(
        "active",
        item === button
      );
    }
  );

  /*
    Brand-specific filters don't make sense while viewing
    EV-only locations.
  */

  if (kind === "ev") {
    App.state.selectedBrand = "all";

    App.$all(
      "[data-brand-filter]"
    ).forEach(item => {
      item.classList.toggle(
        "active",
        String(
          item.dataset.brandFilter || ""
        ).toLowerCase() === "all"
      );
    });
  }

  App.applyStationFilters();
};


/* =========================================================
   SEARCH
   ========================================================= */

App.searchStations = function (value) {
  App.state.searchQuery =
    String(value || "");

  App.applyStationFilters();
};

App.clearStationSearch = function () {
  const input = App.$("stationSearch");

  if (input) {
    input.value = "";
  }

  App.state.searchQuery = "";
  App.applyStationFilters();
};


/* =========================================================
   BRAND FILTER
   ========================================================= */

App.setBrandFilter = function (
  brand,
  button
) {
  App.state.selectedBrand = brand;

  App.$all(
    "[data-brand-filter]"
  ).forEach(item => {
    item.classList.toggle(
      "active",
      item === button
    );
  });

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

  App.state.sortMode = mode;

  App.$all("[data-sort]").forEach(
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
  App.state.selectedFuel = fuel;

  App.$all("[data-fuel]").forEach(
    item => {
      item.classList.toggle(
        "active",
        item === button
      );
    }
  );

  App.applyStationFilters();
  App.renderPlanMyStop();
};


/* =========================================================
   LIST
   ========================================================= */

App.renderStationList = function () {
  const container =
    App.$("stationList");

  if (!container) {
    return;
  }

  /*
    The map can contain all locations. The scrolling card
    list is capped for mobile rendering performance.
  */

  const stations =
    App.state.filteredStations.slice(
      0,
      100
    );

  if (!stations.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔎</div>
        <strong>No locations found</strong>
        Try another search or filter.
      </div>
    `;

    return;
  }

  container.innerHTML = stations
    .map(station => {
      let distanceText = "";

      if (App.state.userLocation) {
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

      if (station.type === "ev") {
        const ev = station.ev || {};

        const connector =
          Array.isArray(ev.sockets) &&
          ev.sockets.length
            ? ev.sockets
                .slice(0, 2)
                .join(", ")
            : "EV charger";

        return `
          <div
            class="station-list-item"
            onclick="GasGoApp.selectStationById('${App.escape(station.id)}')"
          >
            <div class="station-list-icon">
              ⚡
            </div>

            <div class="station-list-info">
              <div class="station-list-name">
                ${App.escape(station.name)}
              </div>

              <div class="station-list-meta">
                ${App.escape(
                  station.brand ||
                  "EV Charging"
                )}
                ${
                  station.municipality
                    ? " • " +
                      App.escape(
                        station.municipality
                      )
                    : ""
                }
                ${distanceText}
              </div>
            </div>

            <div class="station-list-price">
              ${App.escape(
                ev.power || connector
              )}
            </div>
          </div>
        `;
      }

      const prices =
        station.prices ||
        GasGoData.getStationPrices(
          station
        );

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
                  ? " • " +
                    App.escape(
                      station.municipality
                    )
                  : ""
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
    })
    .join("");
};


/* =========================================================
   SELECT LOCATION
   ========================================================= */

App.selectStationById = function (id) {
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

App.selectStation = function (
  station,
  moveMap = true
) {
  App.state.selectedStation = station;

  if (
    moveMap &&
    App.state.map
  ) {
    App.state.map.flyTo(
      [station.lat, station.lon],
      Math.max(
        App.state.map.getZoom(),
        14
      ),
      {
        duration: 0.5
      }
    );
  }

  App.renderStationSheet();
  App.renderMapStations();

  const marker =
    App.state.markers.get(
      String(station.id)
    );

  if (marker && moveMap) {
    setTimeout(() => {
      marker.openPopup();
    }, 550);
  }
};


/* =========================================================
   LOCATION SHEET
   ========================================================= */

App.renderStationSheet = function () {
  const station =
    App.state.selectedStation;

  const sheet =
    App.$("stationSheet");

  if (!sheet || !station) {
    return;
  }

  sheet.classList.add("visible");

  const name =
    App.$("selectedStationName");

  if (name) {
    name.textContent = station.name;
  }

  const brand =
    App.$("selectedStationBrand");

  if (brand) {
    brand.textContent = [
      station.type === "ev"
        ? "⚡ " +
          (station.brand ||
            "EV Charging")
        : station.brand,
      station.municipality
    ]
      .filter(Boolean)
      .join(" • ");
  }

  const distanceElement =
    App.$("selectedStationDistance");

  if (distanceElement) {
    if (App.state.userLocation) {
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
        ) + " approx.";
    } else {
      distanceElement.textContent =
        "Location not shared";
    }
  }

  const fuelPrices =
    App.$("selectedFuelPrices");

  const evInfo =
    App.$("selectedEVInfo");

  const logButton =
    App.$(
      "selectedLogPurchaseButton"
    );

  if (station.type === "ev") {
    if (fuelPrices) {
      fuelPrices.style.display = "none";
    }

    if (evInfo) {
      evInfo.style.display = "";
      App.renderSelectedEVInfo(evInfo);
    }

    if (logButton) {
      logButton.style.display = "none";
    }

    /*
      Backward compatibility with the current index before
      selectedFuelPrices / selectedEVInfo are added.
    */

    ["selectedRegular",
     "selectedPremium",
     "selectedDiesel"
    ].forEach(id => {
      const element = App.$(id);

      if (element) {
        element.textContent = "EV";
      }
    });
  } else {
    if (fuelPrices) {
      fuelPrices.style.display = "";
    }

    if (evInfo) {
      evInfo.style.display = "none";
    }

    if (logButton) {
      logButton.style.display = "";
    }

    const prices =
      station.prices ||
      GasGoData.getStationPrices(
        station
      );

    const regular =
      App.$("selectedRegular");

    const premium =
      App.$("selectedPremium");

    const diesel =
      App.$("selectedDiesel");

    if (regular) {
      regular.textContent =
        App.money(prices.regular);
    }

    if (premium) {
      premium.textContent =
        App.money(prices.premium);
    }

    if (diesel) {
      diesel.textContent =
        App.money(prices.diesel);
    }
  }

  App.renderCanIMakeIt();
};


/* =========================================================
   SELECTED EV INFO
   ========================================================= */

App.renderSelectedEVInfo = function (
  container
) {
  const station =
    App.state.selectedStation;

  if (
    !station ||
    station.type !== "ev"
  ) {
    return;
  }

  const ev = station.ev || {};

  const connectors =
    Array.isArray(ev.sockets) &&
    ev.sockets.length
      ? ev.sockets.join(", ")
      : "Not provided";

  container.innerHTML = `
    <div class="price-box">
      <span>Connectors</span>
      <b>${App.escape(connectors)}</b>
      <span>OSM data</span>
    </div>

    <div class="price-box">
      <span>Power</span>
      <b>${App.escape(
        ev.power || "Unknown"
      )}</b>
      <span>when listed</span>
    </div>

    <div class="price-box">
      <span>Ports</span>
      <b>${App.escape(
        ev.capacity || "—"
      )}</b>
      <span>when listed</span>
    </div>
  `;
};


/* =========================================================
   CAN I MAKE IT?
   ========================================================= */

App.renderCanIMakeIt = function () {
  const element =
    App.$("rangeResult");

  if (!element) {
    return;
  }

  const result =
    GasGoData.canIMakeIt(
      App.state.selectedStation,
      App.state.userLocation,
      App.state.vehicle
    );

  element.className =
    "range-result " +
    (result.status || "");

  let title = "Range estimate";

  if (result.status === "safe") {
    title =
      "🟢 Likely within range";
  } else if (
    result.status === "warning"
  ) {
    title =
      "🟡 Low safety margin";
  } else if (
    result.status === "danger"
  ) {
    title =
      "🔴 Choose a closer option";
  }

  let details = "";

  if (
    Number.isFinite(result.distance)
  ) {
    details +=
      "<br>Approx. straight-line distance: <strong>" +
      GasGoData.formatDistance(
        result.distance
      ) +
      "</strong>";
  }

  if (
    Number.isFinite(result.range)
  ) {
    details +=
      "<br>Estimated vehicle range: <strong>" +
      Math.round(result.range) +
      " mi</strong>";
  }

  if (
    Number.isFinite(result.remaining) &&
    result.remaining >= 0
  ) {
    details +=
      "<br>Estimated remaining range: <strong>" +
      Math.round(result.remaining) +
      " mi</strong>";
  }

  element.innerHTML = `
    <div class="range-result-title">
      ${title}
    </div>

    ${App.escape(result.message)}

    ${details}

    <div class="muted mt-8">
      Prototype estimate only. This uses approximate
      straight-line distance, not guaranteed road range.
      Traffic, route, weather, driving style and vehicle
      conditions may change actual range.
    </div>
  `;
};


/* =========================================================
   SAFER OPTION
   ========================================================= */

App.findSaferOption = function () {
  if (!App.state.userLocation) {
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

  App.selectStation(safer, true);

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
      "Choose a location first.",
      "error"
    );

    return;
  }

  const isAppleDevice =
    /iPad|iPhone|iPod|Macintosh/i.test(
      navigator.userAgent
    );

  const url = isAppleDevice
    ? GasGoData.getAppleMapsURL(
        station
      )
    : GasGoData.getGoogleMapsURL(
        station
      );

  window.open(
    url,
    "_blank",
    "noopener"
  );
};


/* =========================================================
   LOCATION
   ========================================================= */

App.requestLocation = function () {
  if (!navigator.geolocation) {
    App.toast(
      "Location is not supported by this browser.",
      "error"
    );

    return;
  }

  App.setStationStatus(
    "Waiting for location permission…"
  );

  navigator.geolocation.getCurrentPosition(
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
      App.renderPlanMyStop();

      App.setStationStatus(
        App.state.stations.length +
        " mapped locations loaded. Location enabled; distances are approximate."
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
        App.state.stations.length +
        " mapped locations loaded. Location wasn't shared."
      );

      App.toast(
        "Location wasn't shared.",
        "error"
      );
    },

    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000
    }
  );
};


/* =========================================================
   USER MARKER
   ========================================================= */

App.renderUserMarker = function () {
  if (
    !App.state.map ||
    !App.state.userLocation
  ) {
    return;
  }

  if (App.state.userMarker) {
    App.state.map.removeLayer(
      App.state.userMarker
    );
  }

  const icon = L.divIcon({
    className: "",
    html:
      '<div class="user-location-marker"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });

  App.state.userMarker = L.marker(
    [
      App.state.userLocation.lat,
      App.state.userLocation.lon
    ],
    {
      icon,
      zIndexOffset: 1000
    }
  )
    .addTo(App.state.map)
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
      duration: 0.6
    }
  );
};


/* =========================================================
   RESET MAP
   ========================================================= */

App.resetMap = function () {
  if (!App.state.map) {
    return;
  }

  App.state.map.flyTo(
    [
      GasGoData.PR_CENTER.lat,
      GasGoData.PR_CENTER.lon
    ],
    GasGoData.PR_CENTER.zoom,
    {
      duration: 0.5
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

  if (!App.state.stations.length) {
    card.innerHTML = `
      <div class="smart-stop-title">
        Finding your Smart Stop…
      </div>

      <div class="smart-stop-subtitle">
        Loading mapped energy locations.
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

  App.state.smartStop = smart;

  if (!smart?.station) {
    card.innerHTML = `
      <div class="smart-stop-title">
        Smart Stop unavailable
      </div>

      <div class="smart-stop-subtitle">
        No compatible mapped stop was found.
      </div>
    `;

    return;
  }

  const station = smart.station;

  let safetyText =
    "Location needed";

  let safetyClass = "";

  if (smart.safety === "safe") {
    safetyText = "Safe range";
    safetyClass = "smart-safe";
  } else if (
    smart.safety === "warning"
  ) {
    safetyText = "Low range";
    safetyClass = "smart-warning";
  } else if (
    smart.safety === "danger"
  ) {
    safetyText = "Range risk";
    safetyClass = "smart-danger";
  }

  const distanceText =
    Number.isFinite(smart.distance)
      ? GasGoData.formatDistance(
          smart.distance
        )
      : "—";

  if (station.type === "ev") {
    const ev = station.ev || {};

    card.innerHTML = `
      <div class="smart-stop-header">
        <div>
          <div class="eyebrow">
            GasGo Smart Stop
          </div>

          <div class="smart-stop-title">
            ⚡ ${App.escape(
              station.name
            )}
          </div>

          <div class="smart-stop-subtitle">
            ${App.escape(
              station.brand ||
              "EV Charging"
            )}
            ${
              station.municipality
                ? " • " +
                  App.escape(
                    station.municipality
                  )
                : ""
            }
          </div>
        </div>

        <div class="smart-stop-price">
          ⚡
          <small>
            EV
          </small>
        </div>
      </div>

      <div class="smart-stop-grid">
        <div class="smart-stat">
          <span>Distance</span>
          <strong>
            ${distanceText}
          </strong>
        </div>

        <div class="smart-stat">
          <span>Range</span>
          <strong class="${safetyClass}">
            ${safetyText}
          </strong>
        </div>

        <div class="smart-stat">
          <span>Power</span>
          <strong>
            ${App.escape(
              ev.power || "—"
            )}
          </strong>
        </div>
      </div>

      <div class="muted">
        ${
          App.state.userLocation
            ? "Recommendation uses mapped charger data and approximate distance."
            : "Share location to include distance and estimated range."
        }
        Charging price and live availability are not assumed
        when map data does not provide them.
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

    return;
  }

  const prices =
    station.prices ||
    GasGoData.getStationPrices(
      station
    );

  const average =
    GasGoData.averagePrice(
      App.state.stations,
      App.state.selectedFuel
    );

  const savings =
    Number.isFinite(average)
      ? GasGoData.estimateSavings(
          prices[
            App.state.selectedFuel
          ],
          average,
          40
        )
      : 0;

  card.innerHTML = `
    <div class="smart-stop-header">
      <div>
        <div class="eyebrow">
          GasGo Smart Stop
        </div>

        <div class="smart-stop-title">
          ${App.escape(
            station.name
          )}
        </div>

        <div class="smart-stop-subtitle">
          ${App.escape(
            station.brand
          )}
          ${
            station.municipality
              ? " • " +
                App.escape(
                  station.municipality
                )
              : ""
          }
        </div>
      </div>

      <div class="smart-stop-price">
        ${App.money(
          prices[
            App.state.selectedFuel
          ]
        )}
        <small>/L</small>
      </div>
    </div>

    <div class="smart-stop-grid">
      <div class="smart-stat">
        <span>Distance</span>
        <strong>
          ${distanceText}
        </strong>
      </div>

      <div class="smart-stat">
        <span>Range</span>
        <strong class="${safetyClass}">
          ${safetyText}
        </strong>
      </div>

      <div class="smart-stat">
        <span>Est. savings</span>
        <strong>
          ${App.money(savings)}
        </strong>
      </div>
    </div>

    <div class="muted">
      ${
        App.state.userLocation
          ? "Recommendation combines demo fuel price and approximate distance."
          : "Share location to include distance and estimated range."
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
   SMART STOP ACTIONS
   ========================================================= */

App.openSmartStop = function () {
  if (!App.state.smartStop?.station) {
    return;
  }

  App.showScreen("stations");

  setTimeout(() => {
    App.selectStation(
      App.state.smartStop.station,
      true
    );
  }, 180);
};

App.goToSmartStop = function () {
  if (!App.state.smartStop?.station) {
    return;
  }

  App.state.selectedStation =
    App.state.smartStop.station;

  App.openDirections();
};


/* =========================================================
   PLAN MY STOP
   ========================================================= */

App.planMyStop = function (
  amount,
  button
) {
  App.state.planAmount = amount;

  App.$all(".plan-amount").forEach(
    item => {
      item.classList.toggle(
        "active",
        item === button
      );
    }
  );

  App.renderPlanMyStop();
};


App.renderPlanMyStop = function () {
  const container =
    App.$("planMyStopResult");

  if (!container) {
    return;
  }

  if (!App.state.stations.length) {
    container.innerHTML = `
      <div class="muted">
        Loading locations…
      </div>
    `;

    return;
  }

  const vehicle =
    App.state.vehicle;

  const mode =
    App
