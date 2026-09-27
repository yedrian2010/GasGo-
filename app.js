"use strict";

/* =========================================================
   GASGO APP
   Version 5.4.0
   ========================================================= */

window.GasGoApp = window.GasGoApp || {};
const App = window.GasGoApp;

App.VERSION = "5.4.0";


/* =========================================================
   STORAGE
   ========================================================= */

App.STORAGE = {
  vehicle: "gasgoVehicleV5",
  onboarding: "gasgoOnboardingV54",
  rewards: "gasgoRewardsV5",
  fuelLogs: "gasgoFuelLogsV5",
  favorites: "gasgoFavoritesV5"
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

  Other: [
    "Other"
  ]

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


App.clamp = function (value, min, max) {

  value = Number(value);

  return Math.max(
    min,
    Math.min(max, value)
  );

};


App.money = function (value) {

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return "$" + number.toFixed(2);

};


App.number = function (
  value,
  decimals = 1
) {

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return number.toFixed(decimals);

};


App.escape = function (value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

};


App.loadStorage = function (
  key,
  fallback
) {

  try {

    const raw =
      localStorage.getItem(key);

    if (raw === null) {
      return fallback;
    }

    return JSON.parse(raw);

  } catch {

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

  } catch {

    return false;

  }

};


/* =========================================================
   TOAST
   ========================================================= */

App.toast = function (
  message,
  type = ""
) {

  const container =
    App.$("toastContainer");

  if (!container) {
    return;
  }

  const toast =
    document.createElement("div");

  toast.className =
    "toast " + type;

  toast.textContent =
    message;

  container.appendChild(toast);

  setTimeout(() => {

    toast.style.opacity = "0";

    toast.style.transform =
      "translateY(8px)";

  }, 2600);

  setTimeout(() => {

    toast.remove();

  }, 3100);

};


/* =========================================================
   VEHICLE HELPERS
   ========================================================= */

App.isElectricVehicle = function () {

  return (
    App.state.vehicle?.powertrain ===
    "Electric"
  );

};


App.getVehicleEnergyMode = function () {

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


App.getVehicleRange = function () {

  const vehicle =
    App.state.vehicle;

  if (!vehicle) {
    return 0;
  }

  if (
    window.GasGoData &&
    typeof GasGoData.getEstimatedVehicleRange ===
      "function"
  ) {

    return (
      GasGoData.getEstimatedVehicleRange(
        vehicle
      ) || 0
    );

  }

  return (
    Number(vehicle.fullRange) *
    Number(vehicle.level) /
    100
  );

};


/* =========================================================
   LOCAL DATA
   ========================================================= */

App.loadLocalData = function () {

  const savedVehicle =
    App.loadStorage(
      App.STORAGE.vehicle,
      null
    );

  if (
    savedVehicle &&
    typeof savedVehicle === "object"
  ) {

    App.state.vehicle = {
      ...App.DEFAULT_VEHICLE,
      ...savedVehicle
    };

  } else {

    /*
      Technical fallback only.

      A new user still sees onboarding because onboarding
      uses its own separate storage key.
    */

    App.state.vehicle = {
      ...App.DEFAULT_VEHICLE
    };

  }


  const rewards =
    App.loadStorage(
      App.STORAGE.rewards,
      null
    );

  App.state.rewards =
    rewards &&
    typeof rewards === "object"
      ? rewards
      : JSON.parse(
          JSON.stringify(
            App.DEFAULT_REWARDS
          )
        );


  const logs =
    App.loadStorage(
      App.STORAGE.fuelLogs,
      []
    );

  App.state.fuelLogs =
    Array.isArray(logs)
      ? logs
      : [];


  const favorites =
    App.loadStorage(
      App.STORAGE.favorites,
      []
    );

  App.state.favorites =
    Array.isArray(favorites)
      ? favorites
      : [];

};


/* =========================================================
   ONBOARDING
   ========================================================= */

App.shouldShowOnboarding = function () {

  return (
    App.loadStorage(
      App.STORAGE.onboarding,
      false
    ) !== true
  );

};


App.populateYearSelect = function (
  select
) {

  if (!select) {
    return;
  }

  select.innerHTML = "";

  for (
    let year = 2027;
    year >= 1996;
    year--
  ) {

    const option =
      document.createElement(
        "option"
      );

    option.value = year;
    option.textContent = year;

    select.appendChild(option);

  }

};


App.populateMakeSelect = function (
  select
) {

  if (!select) {
    return;
  }

  select.innerHTML = "";

  Object.keys(
    App.VEHICLES
  ).forEach(make => {

    const option =
      document.createElement(
        "option"
      );

    option.value = make;
    option.textContent = make;

    select.appendChild(option);

  });

};


App.populateModelSelect = function (
  make,
  select,
  selectedModel = null
) {

  if (!select) {
    return;
  }

  const models =
    App.VEHICLES[make] ||
    ["Other"];

  select.innerHTML = "";

  models.forEach(model => {

    const option =
      document.createElement(
        "option"
      );

    option.value = model;
    option.textContent = model;

    select.appendChild(option);

  });


  if (
    selectedModel &&
    models.includes(selectedModel)
  ) {

    select.value =
      selectedModel;

  }

};


App.prepareOnboarding = function () {

  const year =
    App.$("onboardingYear");

  const make =
    App.$("onboardingMake");

  App.populateYearSelect(year);

  App.populateMakeSelect(make);


  if (year) {
    year.value = "2020";
  }


  if (make) {

    if (
      Object.prototype.hasOwnProperty.call(
        App.VEHICLES,
        "Toyota"
      )
    ) {

      make.value = "Toyota";

    }

  }


  App.updateOnboardingModels();

  App.updateOnboardingPowertrain();

  App.updateOnboardingSliderLabels();

};


App.showOnboarding = function () {

  const onboarding =
    App.$("onboarding");

  if (!onboarding) {
    return;
  }

  App.prepareOnboarding();

  onboarding.classList.add(
    "open"
  );

};


App.updateOnboardingModels =
function () {

  const make =
    App.$("onboardingMake");

  const model =
    App.$("onboardingModel");

  if (
    !make ||
    !model
  ) {
    return;
  }

  App.populateModelSelect(
    make.value,
    model
  );

};


App.updateOnboardingPowertrain =
function () {

  const powertrain =
    App.$(
      "onboardingPowertrain"
    )?.value;

  const tankField =
    App.$("onboardingTankField");

  const levelDescription =
    App.$(
      "onboardingLevelDescription"
    );

  if (
    powertrain === "Electric"
  ) {

    if (tankField) {
      tankField.style.display =
        "none";
    }

    if (levelDescription) {
      levelDescription.textContent =
        "Current battery percentage";
    }

  } else {

    if (tankField) {
      tankField.style.display =
        "";
    }

    if (levelDescription) {
      levelDescription.textContent =
        powertrain ===
          "Plug-in Hybrid"
          ? "Current fuel / energy estimate"
          : "Current fuel percentage";
    }

  }

};


App.updateOnboardingSliderLabels =
function () {

  const level =
    App.$("onboardingLevel");

  const levelValue =
    App.$(
      "onboardingLevelValue"
    );

  if (
    level &&
    levelValue
  ) {

    levelValue.textContent =
      level.value + "%";

  }


  const range =
    App.$("onboardingRange");

  const rangeValue =
    App.$(
      "onboardingRangeValue"
    );

  if (
    range &&
    rangeValue
  ) {

    rangeValue.textContent =
      range.value + " mi";

  }


  const tank =
    App.$("onboardingTank");

  const tankValue =
    App.$(
      "onboardingTankValue"
    );

  if (
    tank &&
    tankValue
  ) {

    tankValue.textContent =
      tank.value;

  }

};


App.finishOnboarding = function () {

  const year =
    Number(
      App.$(
        "onboardingYear"
      )?.value
    );

  const make =
    App.$(
      "onboardingMake"
    )?.value;

  const model =
    App.$(
      "onboardingModel"
    )?.value;

  const powertrain =
    App.$(
      "onboardingPowertrain"
    )?.value;

  const level =
    Number(
      App.$(
        "onboardingLevel"
      )?.value
    );

  const fullRange =
    Number(
      App.$(
        "onboardingRange"
      )?.value
    );

  const tankCapacity =
    Number(
      App.$(
        "onboardingTank"
      )?.value
    );


  if (
    !year ||
    !make ||
    !model ||
    !powertrain
  ) {

    App.toast(
      "Complete your vehicle setup.",
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
      ),

    tankCapacity:
      powertrain === "Electric"
        ? 46
        : App.clamp(
            tankCapacity,
            20,
            120
          )

  };


  App.saveStorage(
    App.STORAGE.vehicle,
    App.state.vehicle
  );


  App.saveStorage(
    App.STORAGE.onboarding,
    true
  );


  App.$("onboarding")
    ?.classList.remove("open");


  App.refreshVehicleUI();

  App.syncEnergyFilterToVehicle();

  App.applyStationFilters();

  App.toast(
    "Vehicle added. Welcome to GasGo 🚗",
    "success"
  );

};


/* =========================================================
   VEHICLE ENERGY UI
   ========================================================= */

App.syncEnergyFilterToVehicle =
function () {

  const mode =
    App.getVehicleEnergyMode();

  if (mode === "ev") {
    App.state.selectedKind = "ev";
  } else if (
    mode === "both"
  ) {
    App.state.selectedKind = "all";
  } else {
    App.state.selectedKind = "fuel";
  }


  App.$all(
    "[data-kind]"
  ).forEach(button => {

    button.classList.toggle(
      "active",
      button.dataset.kind ===
        App.state.selectedKind
    );

  });


  App.updateEnergyFilterUI();

};


App.updateEnergyFilterUI =
function () {

  const fuelFilters =
    App.$("fuelTypeFilters");

  const brandFilters =
    App.$("brandFilters");


  if (
    App.state.selectedKind === "ev"
  ) {

    if (fuelFilters) {
      fuelFilters.style.display =
        "none";
    }

    if (brandFilters) {
      brandFilters.style.display =
        "none";
    }

  } else {

    if (fuelFilters) {
      fuelFilters.style.display =
        "";
    }

    if (brandFilters) {
      brandFilters.style.display =
        "";
    }

  }

};


/* =========================================================
   HOME
   ========================================================= */

App.renderHomeVehicle = function () {

  const vehicle =
    App.state.vehicle;

  if (!vehicle) {
    return;
  }


  const range =
    App.getVehicleRange();


  const homeRange =
    App.$("homeRange");

  if (homeRange) {

    homeRange.innerHTML =
      Math.round(range) +
      " <small>mi</small>";

  }


  const homeLevel =
    App.$("homeLevel");

  if (homeLevel) {

    homeLevel.textContent =
      Math.round(
        Number(vehicle.level)
      ) + "%";

  }


  const label =
    App.$("homeFuelLabel");

  if (label) {

    label.textContent =
      vehicle.powertrain ===
        "Electric"
        ? "Battery"
        : "Fuel";

  }


  const name =
    App.$("homeVehicleName");

  if (name) {

    name.textContent =
      vehicle.year +
      " " +
      vehicle.make +
      " " +
      vehicle.model;

  }


  const bar =
    App.$("homeLevelBar");

  if (bar) {

    bar.style.width =
      App.clamp(
        vehicle.level,
        0,
        100
      ) + "%";

  }


  const planSubtitle =
    App.$(
      "planMyStopSubtitle"
    );

  const planQuestion =
    App.$(
      "planMyStopQuestion"
    );

  const amountButtons =
    App.$(
      "planAmountButtons"
    );


  if (
    vehicle.powertrain ===
    "Electric"
  ) {

    if (planSubtitle) {
      planSubtitle.textContent =
        "Smart charging planner";
    }

    if (planQuestion) {
      planQuestion.textContent =
        "FIND A CHARGER";
    }

    if (amountButtons) {
      amountButtons.style.display =
        "none";
    }

  } else {

    if (planSubtitle) {
      planSubtitle.textContent =
        "Smart fuel planner";
    }

    if (planQuestion) {
      planQuestion.textContent =
        "HOW MUCH ARE YOU ADDING?";
    }

    if (amountButtons) {
      amountButtons.style.display =
        "";
    }

  }

};


/* =========================================================
   NAVIGATION
   ========================================================= */

App.showScreen = function (
  screenName
) {

  App.state.screen =
    screenName;


  App.$all(".screen")
    .forEach(screen => {

      screen.classList.toggle(
        "active",
        screen.id ===
          "screen-" +
          screenName
      );

    });


  App.$all(".nav")
    .forEach(nav => {

      nav.classList.toggle(
        "active",
        nav.dataset.screen ===
          screenName
      );

    });


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  if (
    screenName === "stations"
  ) {

    App.initializeMap();

    setTimeout(() => {

      App.state.map
        ?.invalidateSize(true);

    }, 120);

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
   STATION STATUS
   ========================================================= */

App.setStationStatus = function (
  text
) {

  const status =
    App.$("stationStatus");

  if (status) {
    status.textContent = text;
  }

};


/* =========================================================
   LOAD FUEL + EV
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
    "Loading mapped fuel & EV locations…"
  );


  try {

    if (!window.GasGoData) {

      throw new Error(
        "stations.js missing"
      );

    }


    const result =
      await GasGoData.fetchStations();


    App.state.stations =
      Array.isArray(
        result.stations
      )
        ? result.stations
        : [];


    App.state.stationSource =
      result.source || "";


    App.state.usingFallback =
      Boolean(
        result.fallback
      );


    App.state.stationsLoaded =
      true;


    const fuelCount =
      App.state.stations.filter(
        station =>
          station.type ===
          "fuel"
      ).length;


    const evCount =
      App.state.stations.filter(
        station =>
          station.type ===
          "ev"
      ).length;


    if (
      App.state.usingFallback
    ) {

      App.setStationStatus(
        fuelCount +
        " demo fuel stops • " +
        evCount +
        " demo EV chargers"
      );

    } else {

      App.setStationStatus(
        fuelCount +
        " mapped fuel locations • " +
        evCount +
        " mapped EV chargers"
      );

    }


    App.applyStationFilters();

    App.updateSmartStop();

    App.renderPlanMyStop();

    App.renderPriceReference();

  } catch (error) {

    console.error(
      "GasGo station error:",
      error
    );


    if (
      window.GasGoData &&
      typeof GasGoData.getFallbackStations ===
        "function"
    ) {

      App.state.stations =
        GasGoData.getFallbackStations();

      App.state.stationsLoaded =
        true;

      App.state.usingFallback =
        true;

      App.applyStationFilters();

      App.setStationStatus(
        "Live map data unavailable. Showing GasGo demo locations."
      );

    }

  } finally {

    App.state.stationsLoading =
      false;

  }

};


/* =========================================================
   MAP
   ========================================================= */

App.initializeMap = function () {

  if (
    App.state.mapInitialized
  ) {

    App.state.map
      ?.invalidateSize(true);

    return;

  }


  const mapElement =
    App.$("map");


  if (
    !mapElement ||
    typeof L === "undefined"
  ) {
    return;
  }


  const center =
    GasGoData.PR_CENTER || {
      lat: 18.2208,
      lon: -66.5901,
      zoom: 9
    };


  App.state.map =
    L.map(
      "map",
      {
        zoomControl: true,
        preferCanvas: true
      }
    ).setView(
      [
        center.lat,
        center.lon
      ],
      center.zoom
    );


  App.state.markerLayer =
    L.layerGroup()
      .addTo(
        App.state.map
      );


  const tiles =
    L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          "&copy; OpenStreetMap contributors"
      }
    );


  tiles.addTo(
    App.state.map
  );


  const hideLoader = () => {

    const loader =
      App.$("mapLoader");

    if (loader) {
      loader.style.display =
        "none";
    }

  };


  tiles.once(
    "load",
    hideLoader
  );


  tiles.once(
    "tileerror",
    hideLoader
  );


  setTimeout(
    hideLoader,
    1400
  );


  App.state.mapInitialized =
    true;


  setTimeout(() => {

    App.state.map
      ?.invalidateSize(true);

  }, 100);


  if (
    App.state.stationsLoaded
  ) {

    App.renderMapStations();

  } else {

    App.loadStations();

  }

};


/* =========================================================
   MAP POPUP
   ========================================================= */

App.stationPopupHTML = function (
  station
) {

  if (
    station.type === "ev"
  ) {

    const ev =
      station.ev || {};


    const sockets =
      Array.isArray(ev.sockets)
        ? ev.sockets.join(", ")
        : ev.sockets ||
          "Not listed";


    return `
      <div>
        <div class="popup-title">
          ⚡ ${App.escape(station.name)}
        </div>

        <div class="popup-brand">
          ${App.escape(
            station.brand ||
            "EV Charging"
          )}
        </div>

        <div class="popup-prices">

          <div class="popup-price">
            <span>Connectors</span>
            <strong>
              ${App.escape(sockets)}
            </strong>
          </div>

          <div class="popup-price">
            <span>Power</span>
            <strong>
              ${App.escape(
                ev.power ||
                "Not listed"
              )}
            </strong>
          </div>

          <div class="popup-price">
            <span>Ports</span>
            <strong>
              ${App.escape(
                ev.capacity ||
                "—"
              )}
            </strong>
          </div>

        </div>

        <div class="popup-demo">
          EV information is displayed only when
          provided by map data.
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
    <div>

      <div class="popup-title">
        ⛽ ${App.escape(station.name)}
      </div>

      <div class="popup-brand">
        ${App.escape(station.brand)}
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
        Prototype fuel price estimates
      </div>

    </div>
  `;

};


/* =========================================================
   MAP MARKERS
   ========================================================= */

App.renderMapStations = function () {

  if (
    !App.state.map ||
    !App.state.markerLayer
  ) {

    App.renderStationList();

    return;

  }


  App.state.markerLayer
    .clearLayers();


  App.state.markers.clear();


  App.state.filteredStations
    .forEach(station => {


      const selected =
        String(
          App.state.selectedStation?.id
        ) ===
        String(station.id);


      const marker =
        L.circleMarker(
          [
            station.lat,
            station.lon
          ],
          {
            radius:
              selected
                ? 10
                : 7,

            weight:
              selected
                ? 4
                : 2,

            opacity: 1,

            fillOpacity: 0.9
          }
        );


      marker.bindTooltip(
        station.type === "ev"
          ? "⚡"
          : "⛽",
        {
          permanent: true,
          direction: "center",
          className:
            "gasgo-map-symbol"
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

    });


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


  if (
    typeof GasGoData.searchStations ===
    "function"
  ) {

    stations =
      GasGoData.searchStations(
        stations,
        App.state.searchQuery
      );

  }


  if (
    App.state.selectedKind !==
    "all"
  ) {

    stations =
      stations.filter(
        station =>
          station.type ===
          App.state.selectedKind
      );

  }


  if (
    App.state.selectedBrand !==
    "all"
  ) {

    stations =
      stations.filter(
        station =>
          String(
            station.brand || ""
          ).toLowerCase() ===
          String(
            App.state.selectedBrand
          ).toLowerCase()
      );

  }


  if (
    App.state.sortMode ===
    "closest" &&
    App.state.userLocation
  ) {

    stations =
      GasGoData.sortClosest(
        stations,
        App.state.userLocation
      );

  } else if (
    App.state.sortMode ===
    "cheap"
  ) {

    const fuel =
      stations.filter(
        station =>
          station.type ===
          "fuel"
      );


    const ev =
      stations.filter(
        station =>
          station.type ===
          "ev"
      );


    const sortedFuel =
      GasGoData.sortCheapest(
        fuel,
        App.state.selectedFuel
      );


    stations = [
      ...sortedFuel,
      ...ev
    ];

  } else {

    const fuel =
      stations.filter(
        station =>
          station.type ===
          "fuel"
      );


    const ev =
      stations.filter(
        station =>
          station.type ===
          "ev"
      );


    const sortedFuel =
      GasGoData.sortBestValue(
        fuel,
        App.state.userLocation,
        App.state.selectedFuel
      );


    const sortedEV =
      App.state.userLocation
        ? GasGoData.sortClosest(
            ev,
            App.state.userLocation
          )
        : ev;


    if (
      App.state.selectedKind ===
      "ev"
    ) {

      stations = sortedEV;

    } else if (
      App.state.selectedKind ===
      "fuel"
    ) {

      stations = sortedFuel;

    } else {

      stations = [
        ...sortedFuel,
        ...sortedEV
      ];

    }

  }


  App.state.filteredStations =
    stations;


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

  App.state.selectedKind =
    kind;


  App.$all(
    "[data-kind]"
  ).forEach(item => {

    item.classList.toggle(
      "active",
      item === button
    );

  });


  if (kind === "ev") {

    App.state.selectedBrand =
      "all";


    App.$all(
      "[data-brand-filter]"
    ).forEach(
      (item, index) => {

        item.classList.toggle(
          "active",
          index === 0
        );

      }
    );

  }


  App.updateEnergyFilterUI();

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
  ).forEach(item => {

    item.classList.toggle(
      "active",
      item === button
    );

  });


  App.applyStationFilters();

  App.renderPlanMyStop();

};


/* =========================================================
   BRAND
   ========================================================= */

App.setBrandFilter = function (
  brand,
  button
) {

  App.state.selectedBrand =
    brand;


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


  App.state.sortMode =
    mode;


  App.$all(
    "[data-sort]"
  ).forEach(item => {

    item.classList.toggle(
      "active",
      item === button
    );

  });


  App.applyStationFilters();

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


App.clearStationSearch = function () {

  const input =
    App.$("stationSearch");

  if (input) {
    input.value = "";
  }

  App.state.searchQuery = "";

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
      .slice(0, 100);


  if (!stations.length) {

    container.innerHTML = `
      <div class="empty-state">

        <div class="empty-icon">
          🔎
        </div>

        <strong>
          No locations found
        </strong>

        Try another search or filter.

      </div>
    `;

    return;

  }


  container.innerHTML =
    stations.map(station => {


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


      if (
        station.type === "ev"
      ) {

        const ev =
          station.ev || {};


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
                ${App.escape(
                  station.name
                )}
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
                ev.power ||
                "CHARGE"
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
              ${App.escape(
                station.name
              )}
            </div>

            <div class="station-list-meta">
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

    }).join("");

};


/* =========================================================
   SELECT LOCATION
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
        duration: 0.5
      }
    );

  }


  App.renderStationSheet();

  App.renderMapStations();


  if (moveMap) {

    const marker =
      App.state.markers.get(
        String(station.id)
      );


    if (marker) {

      setTimeout(() => {

        marker.openPopup();

      }, 500);

    }

  }

};


/* =========================================================
   SELECTED LOCATION SHEET
   ========================================================= */

App.renderStationSheet = function () {

  const station =
    App.state.selectedStation;

  const sheet =
    App.$("stationSheet");


  if (
    !station ||
    !sheet
  ) {
    return;
  }


  sheet.classList.add(
    "visible"
  );


  if (
    App.$(
      "selectedStationName"
    )
  ) {

    App.$(
      "selectedStationName"
    ).textContent =
      station.name;

  }


  if (
    App.$(
      "selectedStationBrand"
    )
  ) {

    App.$(
      "selectedStationBrand"
    ).textContent =
      [
        station.type === "ev"
          ? "⚡ " +
            (
              station.brand ||
              "EV Charging"
            )
          : station.brand,

        station.municipality
      ]
        .filter(Boolean)
        .join(" • ");

  }


  const distanceElement =
    App.$(
      "selectedStationDistance"
    );


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

    } else {

      distanceElement.textContent =
        "Location off";

    }

  }


  const fuelPrices =
    App.$(
      "selectedFuelPrices"
    );

  const evInfo =
    App.$(
      "selectedEVInfo"
    );

  const purchaseButton =
    App.$(
      "selectedLogPurchaseButton"
    );


  if (
    station.type === "ev"
  ) {

    if (fuelPrices) {
      fuelPrices.style.display =
        "none";
    }

    if (evInfo) {

      evInfo.style.display =
        "";

      App.renderSelectedEVInfo(
        evInfo
      );

    }

    if (purchaseButton) {
      purchaseButton.style.display =
        "none";
    }

  } else {

    if (fuelPrices) {
      fuelPrices.style.display =
        "";
    }

    if (evInfo) {
      evInfo.style.display =
        "none";
    }

    if (purchaseButton) {
      purchaseButton.style.display =
        "";
    }


    const prices =
      station.prices ||
      GasGoData.getStationPrices(
        station
      );


    if (
      App.$(
        "selectedRegular"
      )
    ) {

      App.$(
        "selectedRegular"
      ).textContent =
        App.money(
          prices.regular
        );

    }


    if (
      App.$(
        "selectedPremium"
      )
    ) {

      App.$(
        "selectedPremium"
      ).textContent =
        App.money(
          prices.premium
        );

    }


    if (
      App.$(
        "selectedDiesel"
      )
    ) {

      App.$(
        "selectedDiesel"
      ).textContent =
        App.money(
          prices.diesel
        );

    }

  }


  App.renderCanIMakeIt();

};


/* =========================================================
   EV INFORMATION
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


  const ev =
    station.ev || {};


  const sockets =
    Array.isArray(ev.sockets)
      ? ev.sockets.join(", ")
      : ev.sockets ||
        "Not listed";


  container.innerHTML = `

    <div class="station-price">

      <span>
        Connectors
      </span>

      <strong>
        ${App.escape(sockets)}
      </strong>

      <small>
        OSM DATA
      </small>

    </div>


    <div class="station-price">

      <span>
        Power
      </span>

      <strong>
        ${App.escape(
          ev.power ||
          "—"
        )}
      </strong>

      <small>
        WHEN LISTED
      </small>

    </div>


    <div class="station-price">

      <span>
        Ports
      </span>

      <strong>
        ${App.escape(
          ev.capacity ||
          "—"
        )}
      </strong>

      <small>
        WHEN LISTED
      </small>

    </div>

  `;

};


/* =========================================================
   CAN I MAKE IT
   ========================================================= */

App.renderCanIMakeIt = function () {

  const element =
    App.$("rangeResult");


  if (!element) {
    return;
  }


  if (
    !App.state.selectedStation
  ) {

    element.innerHTML =
      "Select a location to estimate range.";

    return;

  }


  if (
    !App.state.userLocation
  ) {

    element.className =
      "range-result";

    element.innerHTML = `
      <div class="range-result-title">
        📍 Location needed
      </div>

      Share your approximate location to compare the
      selected stop with your estimated vehicle range.

      <div class="muted mt-8">
        GasGo does not guarantee remaining range.
      </div>
    `;

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
    (
      result.status ||
      ""
    );


  let title =
    "Range estimate";


  if (
    result.status === "safe"
  ) {

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


  element.innerHTML = `

    <div class="range-result-title">
      ${title}
    </div>

    ${App.escape(
      result.message ||
      ""
    )}

    ${
      Number.isFinite(
        result.distance
      )
        ? `
          <br>
          Approx. distance:
          <strong>
            ${GasGoData.formatDistance(
              result.distance
            )}
          </strong>
        `
        : ""
    }

    ${
      Number.isFinite(
        result.range
      )
        ? `
          <br>
          Estimated range:
          <strong>
            ${Math.round(
              result.range
            )} mi
          </strong>
        `
        : ""
    }

    <div class="muted mt-8">
      Prototype estimate only. Distance is approximate
      straight-line distance and is not a guaranteed
      driving range.
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
    "Safer option selected.",
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


  const apple =
    /iPhone|iPad|iPod|Macintosh/i
      .test(
        navigator.userAgent
      );


  const url =
    apple
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

  if (
    !navigator.geolocation
  ) {

    App.toast(
      "Location is not supported.",
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


      App.renderUserMarker();

      App.applyStationFilters();

      App.renderStationSheet();

      App.updateSmartStop();

      App.renderPlanMyStop();


      App.toast(
        "Location enabled.",
        "success"
      );

    },


    error => {

      console.warn(
        "Location error:",
        error
      );


      App.toast(
        "Location wasn't shared.",
        "error"
      );


      App.setStationStatus(
        App.state.stations.length +
        " mapped locations loaded. Location is off."
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
      iconSize: [18, 18],
      iconAnchor: [9, 9]
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
      duration: 0.5
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


  if (
    !App.state.stations.length
  ) {

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


  const mode =
    App.getVehicleEnergyMode();


  let candidates =
    App.state.stations;


  if (mode === "ev") {

    candidates =
      candidates.filter(
        station =>
          station.type === "ev"
      );

  } else if (
    mode === "fuel"
  ) {

    candidates =
      candidates.filter(
        station =>
          station.type === "fuel"
      );

  }


  let station = null;


  if (
    App.state.userLocation
  ) {

    const sorted =
      GasGoData.sortClosest(
        candidates,
        App.state.userLocation
      );


    station =
      sorted[0] || null;

  } else {

    if (
      mode === "fuel"
    ) {

      const sorted =
        GasGoData.sortCheapest(
          candidates,
          App.state.selectedFuel
        );

      station =
        sorted[0] || null;

    } else {

      station =
        candidates[0] || null;

    }

  }


  if (!station) {

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


  App.state.smartStop = {
    station
  };


  let distanceText =
    "Enable location";


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
      GasGoData.formatDistance(
        distance
      );

  }


  if (
    station.type === "ev"
  ) {

    const ev =
      station.ev || {};


    card.innerHTML = `

      <div class="smart-stop-header">

        <div>

          <div class="eyebrow">
            GASGO SMART STOP
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
          </div>

        </div>

        <div class="smart-stop-price">
          ⚡
          <small>EV</small>
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
          <span>Power</span>
          <strong>
            ${App.escape(
              ev.power ||
              "—"
            )}
          </strong>
        </div>

        <div class="smart-stat">
          <span>Range</span>
          <strong>
            ${Math.round(
              App.getVehicleRange()
            )} mi
          </strong>
        </div>

      </div>


      <div class="muted">
        Charging price and live availability are not
        assumed when the mapped data does not provide them.
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


  card.innerHTML = `

    <div class="smart-stop-header">

      <div>

        <div class="eyebrow">
          GASGO SMART STOP
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
          Est. range
        </span>

        <strong>
          ${Math.round(
            App.getVehicleRange()
          )} mi
        </strong>

      </div>


      <div class="smart-stat">

        <span>
          Fuel
        </span>

        <strong>
          ${App.state.selectedFuel}
        </strong>

      </div>

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

  const station =
    App.state.smartStop?.station;


  if (!station) {
    return;
  }


  App.showScreen(
    "stations"
  );


  setTimeout(() => {

    App.selectStation(
      station,
      true
    );

  }, 180);

};


App.goToSmartStop = function () {

  const station =
    App.state.smartStop?.station;


  if (!station) {
    return;
  }


  App.state.selectedStation =
    station;


  App.openDirections();

};


/* =========================================================
   PLAN MY STOP
   ========================================================= */

App.planMyStop = function (
  amount,
  button
) {

  App.state.planAmount =
    amount;


  App.$all(
    ".plan-amount"
  ).forEach(item => {

    item.classList.toggle(
      "active",
      item === button
    );

  });


  App.renderPlanMyStop();

};


App.renderPlanMyStop = function () {

  const container =
    App.$(
      "planMyStopResult"
    );


  if (!container) {
    return;
  }


  if (
    !App.state.stations.length
  ) {

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
    App.getVehicleEnergyMode();


  /* EV */

  if (mode === "ev") {

    let chargers =
      App.state.stations.filter(
        station =>
          station.type === "ev"
      );


    if (
      App.state.userLocation
    ) {

      chargers =
        GasGoData.sortClosest(
          chargers,
          App.state.userLocation
        );

    }


    const station =
      chargers[0];


    if (!station) {

      container.innerHTML = `
        <div class="muted">
          No mapped EV charger was found.
        </div>
      `;

      return;

    }


    App.state.planStation =
      station;


    const ev =
      station.ev || {};


    container.innerHTML = `

      <div class="smart-stop-header">

        <div>

          <div class="eyebrow">
            RECOMMENDED CHARGER
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
          </div>

        </div>

      </div>


      <div class="smart-stop-grid mt-12">

        <div class="smart-stat">

          <span>
            Est. range
          </span>

          <strong>
            ${Math.round(
              App.getVehicleRange()
            )} mi
          </strong>

        </div>


        <div class="smart-stat">

          <span>
            Power
          </span>

          <strong>
            ${App.escape(
              ev.power ||
              "—"
            )}
          </strong>

        </div>


        <div class="smart-stat">

          <span>
            Price
          </span>

          <strong>
            —
          </strong>

        </div>

      </div>


      <div class="muted mt-8">
        Charging price is not invented when the mapped
        charger does not provide pricing information.
      </div>


      <div class="button-row mt-12">

        <button
          class="secondary"
          onclick="GasGoApp.viewPlanStop()"
        >
          VIEW
        </button>

        <button
          class="primary"
          onclick="GasGoApp.goToPlanStop()"
        >
          GO
        </button>

      </div>

    `;

    return;

  }


  /* FUEL */

  let fuelStations =
    App.state.stations.filter(
      station =>
        station.type === "fuel"
    );


  if (
    App.state.userLocation
  ) {

    fuelStations =
      GasGoData.sortBestValue(
        fuelStations,
        App.state.userLocation,
        App.state.selectedFuel
      );

  } else {

    fuelStations =
      GasGoData.sortCheapest(
        fuelStations,
        App.state.selectedFuel
      );

  }


  const station =
    fuelStations[0];


  if (!station) {

    container.innerHTML = `
      <div class="muted">
        No mapped fuel station was found.
      </div>
    `;

    return;

  }


  App.state.planStation =
    station;


  const prices =
    station.prices ||
    GasGoData.getStationPrices(
      station
    );


  const price =
    Number(
      prices[
        App.state.selectedFuel
      ]
    );


  const level =
    App.clamp(
      vehicle.level,
      0,
      100
    );


  const tank =
    Number(
      vehicle.tankCapacity ||
      46
    );


  const remainingCapacity =
    tank *
    (
      (100 - level) /
      100
    );


  let liters = 0;


  if (
    App.state.planAmount ===
    "fill"
  ) {

    liters =
      remainingCapacity;

  } else {

    liters =
      Number(
        App.state.planAmount
      ) /
      price;

    liters =
      Math.min(
        liters,
        remainingCapacity
      );

  }


  const cost =
    liters * price;


  const addedLevel =
    tank > 0
      ? liters /
        tank *
        100
      : 0;


  const newLevel =
    App.clamp(
      level +
      addedLevel,
      0,
      100
    );


  const newRange =
    Number(
      vehicle.fullRange
    ) *
    newLevel /
    100;


  App.state.planStation =
    station;


  container.innerHTML = `

    <div class="smart-stop-header">

      <div>

        <div class="eyebrow">
          RECOMMENDED FUEL STOP
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
        </div>

      </div>


      <div class="smart-stop-price">

        ${App.money(price)}

        <small>
          /L
        </small>

      </div>

    </div>


    <div class="smart-stop-grid mt-12">

      <div class="smart-stat">

        <span>
          Add
        </span>

        <strong>
          ${App.number(
            liters,
            1
          )} L
        </strong>

      </div>


      <div class="smart-stat">

        <span>
          Est. cost
        </span>

        <strong>
          ${App.money(
            cost
          )}
        </strong>

      </div>


      <div class="smart-stat">

        <span>
          New level
        </span>

        <strong>
          ${Math.round(
            newLevel
          )}%
        </strong>

      </div>

    </div>


    <div class="muted mt-8">

      Estimated range after adding fuel:
      <strong>
        ${Math.round(
          newRange
        )} mi
      </strong>.

      Fuel prices are prototype estimates.

    </div>


    <div class="button-row mt-12">

      <button
        class="secondary"
        onclick="GasGoApp.viewPlanStop()"
      >
        VIEW
      </button>

      <button
        class="primary"
        onclick="GasGoApp.goToPlanStop()"
      >
        GO
      </button>

    </div>

  `;

};


App.viewPlanStop = function () {

  if (
    !App.state.planStation
  ) {
    return;
  }


  App.showScreen(
    "stations"
  );


  setTimeout(() => {

    App.selectStation(
      App.state.planStation,
      true
    );

  }, 180);

};


App.goToPlanStop = function () {

  if (
    !App.state.planStation
  ) {
    return;
  }


  App.state.selectedStation =
    App.state.planStation;


  App.openDirections();

};


/* =========================================================
   VEHICLE DISPLAY
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


  if (
    App.$("vehicleType")
  ) {

    App.$(
      "vehicleType"
    ).textContent =
      vehicle.powertrain;

  }


  if (
    App.$(
      "vehicleLevelDisplay"
    )
  ) {

    App.$(
      "vehicleLevelDisplay"
    ).textContent =
      Math.round(
        vehicle.level
      ) + "%";

  }


  if (
    App.$(
      "vehicleRangeDisplay"
    )
  ) {

    App.$(
      "vehicleRangeDisplay"
    ).textContent =
      Math.round(
        App.getVehicleRange()
      ) +
      " mi";

  }


  if (
    App.$(
      "vehicleFullRangeDisplay"
    )
  ) {

    App.$(
      "vehicleFullRangeDisplay"
    ).textContent =
      Math.round(
        vehicle.fullRange
      ) +
      " mi";

  }


  const capacityLabel =
    App.$(
      "vehicleCapacityLabel"
    );


  const tankDisplay =
    App.$(
      "vehicleTankDisplay"
    );


  if (
    vehicle.powertrain ===
    "Electric"
  ) {

    if (capacityLabel) {
      capacityLabel.textContent =
        "Energy source";
    }

    if (tankDisplay) {
      tankDisplay.textContent =
        "Battery";
    }

  } else {

    if (capacityLabel) {
      capacityLabel.textContent =
        "Tank capacity";
    }

    if (tankDisplay) {
      tankDisplay.textContent =
        App.number(
          vehicle.tankCapacity,
          0
        ) +
        " L";
    }

  }

};


/* =========================================================
   VEHICLE MODAL
   ========================================================= */

App.openVehicleModal = function () {

  const modal =
    App.$("vehicleModal");


  if (!modal) {
    return;
  }


  const vehicle =
    App.state.vehicle;


  App.populateYearSelect(
    App.$("vehicleYear")
  );


  App.populateMakeSelect(
    App.$("vehicleMake")
  );


  App.$("vehicleYear").value =
    vehicle.year;


  App.$("vehicleMake").value =
    vehicle.make;


  App.updateVehicleModels(
    vehicle.model
  );


  App.$(
    "vehiclePowertrain"
  ).value =
    vehicle.powertrain;


  App.$(
    "vehicleLevel"
  ).value =
    vehicle.level;


  App.$(
    "vehicleFullRange"
  ).value =
    vehicle.fullRange;


  App.$(
    "vehicleTankCapacity"
  ).value =
    vehicle.tankCapacity ||
    46;


  App.updateVehiclePowertrainUI();

  App.updateVehicleSliderLabels();


  modal.classList.add(
    "open"
  );

};


App.closeVehicleModal = function () {

  App.$("vehicleModal")
    ?.classList.remove(
      "open"
    );

};


App.updateVehicleModels = function (
  selectedModel = null
) {

  const make =
    App.$("vehicleMake");

  const model =
    App.$("vehicleModel");


  if (
    !make ||
    !model
  ) {
    return;
  }


  App.populateModelSelect(
    make.value,
    model,
    selectedModel
  );

};


App.updateVehiclePowertrainUI =
function () {

  const powertrain =
    App.$(
      "vehiclePowertrain"
    )?.value;


  const tankField =
    App.$(
      "vehicleTankField"
    );


  const description =
    App.$(
      "vehicleLevelDescription"
    );


  if (
    powertrain === "Electric"
  ) {

    if (tankField) {
      tankField.style.display =
        "none";
    }

    if (description) {
      description.textContent =
        "Current battery percentage";
    }

  } else {

    if (tankField) {
      tankField.style.display =
        "";
    }

    if (description) {
      description.textContent =
        "Current fuel percentage";
    }

  }

};


App.updateVehicleSliderLabels =
function () {

  const level =
    App.$("vehicleLevel");

  const levelValue =
    App.$(
      "vehicleLevelValue"
    );


  if (
    level &&
    levelValue
  ) {

    levelValue.textContent =
      level.value + "%";

  }


  const range =
    App.$(
      "vehicleFullRange"
    );

  const rangeValue =
    App.$(
      "vehicleFullRangeValue"
    );


  if (
    range &&
    rangeValue
  ) {

    rangeValue.textContent =
      range.value +
      " mi";

  }


  const tank =
    App.$(
      "vehicleTankCapacity"
    );

  const tankValue =
    App.$(
      "vehicleTankCapacityValue"
    );


  if (
    tank &&
    tankValue
  ) {

    tankValue.textContent =
      tank.value;

  }

};


/* =========================================================
   SAVE VEHICLE
   ========================================================= */

App.saveVehicle = function () {

  const year =
    Number(
      App.$(
        "vehicleYear"
      )?.value
    );

  const make =
    App.$(
      "vehicleMake"
    )?.value;

  const model =
    App.$(
      "vehicleModel"
    )?.value;

  const powertrain =
    App.$(
      "vehiclePowertrain"
    )?.value;

  const level =
    Number(
      App.$(
        "vehicleLevel"
      )?.value
    );

  const fullRange =
    Number(
      App.$(
        "vehicleFullRange"
      )?.value
    );

  const tank =
    Number(
      App.$(
        "vehicleTankCapacity"
      )?.value
    );


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
      ),

    tankCapacity:
      powertrain === "Electric"
        ? (
            App.state.vehicle
              ?.tankCapacity ||
            46
          )
        : App.clamp(
            tank,
            20,
            120
          )

  };


  App.saveStorage(
    App.STORAGE.vehicle,
    App.state.vehicle
  );


  App.saveStorage(
    App.STORAGE.onboarding,
    true
  );


  App.closeVehicleModal();

  App.refreshVehicleUI();

  App.syncEnergyFilterToVehicle();

  App.applyStationFilters();


  App.toast(
    "Vehicle saved.",
    "success"
  );

};


/* =========================================================
   REFRESH VEHICLE
   ========================================================= */

App.refreshVehicleUI = function () {

  App.renderHomeVehicle();

  App.renderVehicle();

  App.renderStationSheet();

  App.updateSmartStop();

  App.renderPlanMyStop();

};


/* =========================================================
   FUEL LEVEL AFTER FILL-UP
   ========================================================= */

App.calculateLevelAfterFillUp =
function (liters) {

  const vehicle =
    App.state.vehicle;


  if (
    !vehicle ||
    vehicle.powertrain ===
      "Electric"
  ) {

    return null;

  }


  const tank =
    Number(
      vehicle.tankCapacity
    );


  const added =
    Number(liters);


  if (
    !Number.isFinite(tank) ||
    tank <= 0 ||
    !Number.isFinite(added) ||
    added <= 0
  ) {

    return null;

  }


  const oldLevel =
    App.clamp(
      vehicle.level,
      0,
      100
    );


  const addedPercent =
    added /
    tank *
    100;


  const newLevel =
    App.clamp(
      oldLevel +
      addedPercent,
      0,
      100
    );


  return {
    oldLevel,
    newLevel
  };

};


/* =========================================================
   FUEL LOG MODAL
   ========================================================= */

App.openFuelLogModal = function () {

  if (
    App.state.vehicle
      ?.powertrain ===
      "Electric"
  ) {

    App.toast(
      "Your selected vehicle is electric.",
      "error"
    );

    return;

  }


  if (
    App.state.selectedStation
      ?.type === "ev"
  ) {

    App.toast(
      "Select a fuel station to log a fill-up.",
      "error"
    );

    return;

  }


  const modal =
    App.$("fuelLogModal");


  if (!modal) {
    return;
  }


  const date =
    App.$("logDate");


  if (date) {

    const now =
      new Date();


    date.value =
      new Date(
        now.getTime() -
        now.getTimezoneOffset() *
        60000
      )
        .toISOString()
        .slice(0, 10);

  }


  if (
    App.state.selectedStation
  ) {

    const station =
      App.$("logStation");


    if (station) {

      station.value =
        App.state.selectedStation
          .name;

    }


    const prices =
      App.state.selectedStation
        .prices ||
      GasGoData.getStationPrices(
        App.state.selectedStation
      );


    const price =
      App.$("logPrice");


    if (price) {

      price.value =
        Number(
          prices[
            App.state.selectedFuel
          ]
        ).toFixed(2);

    }

  }


  App.updateFuelLogPreview();


  modal.classList.add(
    "open"
  );

};


App.closeFuelLogModal = function () {

  App.$("fuelLogModal")
    ?.classList.remove(
      "open"
    );

};


/* =========================================================
   FUEL LOG PREVIEW
   ========================================================= */

App.updateFuelLogPreview =
function () {

  const liters =
    Number(
      App.$(
        "logLiters"
      )?.value
    );


  const price =
    Number(
      App.$(
        "logPrice"
      )?.value
    );


  const total =
    Number.isFinite(liters) &&
    Number.isFinite(price)
      ? liters * price
      : 0;


  if (
    App.$(
      "logCalculatedTotal"
    )
  ) {

    App.$(
      "logCalculatedTotal"
    ).textContent =
      App.money(total);

  }


  const preview =
    App.$(
      "logFuelLevelPreview"
    );


  if (preview) {

    const result =
      App.calculateLevelAfterFillUp(
        liters
      );


    preview.textContent =
      result
        ? Math.round(
            result.oldLevel
          ) +
          "% → " +
          Math.round(
            result.newLevel
          ) +
          "%"
        : "—";

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
      App.$(
        "logStation"
      )?.value ||
      ""
    ).trim();

  const fuel =
    App.$("logFuel")?.value ||
    "regular";

  const liters =
    Number(
      App.$(
        "logLiters"
      )?.value
    );

  const price =
    Number(
      App.$(
        "logPrice"
      )?.value
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
    liters * price;


  const level =
    App.calculateLevelAfterFillUp(
      liters
    );


  const log = {

    id:
      "log-" +
      Date.now(),

    date,

    station,

    fuel,

    liters,

    price,

    total,

    vehicleLevelBefore:
      level?.oldLevel ?? null,

    vehicleLevelAfter:
      level?.newLevel ?? null

  };


  App.state.fuelLogs.unshift(
    log
  );


  App.saveStorage(
    App.STORAGE.fuelLogs,
    App.state.fuelLogs
  );


  if (level) {

    App.state.vehicle.level =
      Number(
        level.newLevel.toFixed(1)
      );


    App.saveStorage(
      App.STORAGE.vehicle,
      App.state.vehicle
    );

  }


  App.closeFuelLogModal();

  App.renderDashboard();

  App.refreshVehicleUI();


  App.toast(
    level
      ? "Fill-up saved • " +
        Math.round(
          level.oldLevel
        ) +
        "% → " +
        Math.round(
          level.newLevel
        ) +
        "%"
      : "Fill-up saved.",
    "success"
  );

};


/* =========================================================
   DELETE LOG
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

};


/* =========================================================
   DASHBOARD
   ========================================================= */

App.renderDashboard = function () {

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


  const averagePrice =
    totalLiters > 0
      ? totalSpent /
        totalLiters
      : 0;


  if (
    App.$("dashSpent")
  ) {

    App.$(
      "dashSpent"
    ).textContent =
      App.money(
        totalSpent
      );

  }


  if (
    App.$("dashLiters")
  ) {

    App.$(
      "dashLiters"
    ).textContent =
      App.number(
        totalLiters,
        1
      ) +
      " L";

  }


  if (
    App.$("dashSavings")
  ) {

    App.$(
      "dashSavings"
    ).textContent =
      "$0.00";

  }


  if (
    App.$("dashFillUps")
  ) {

    App.$(
      "dashFillUps"
    ).textContent =
      logs.length;

  }


  if (
    App.$(
      "dashAveragePrice"
    )
  ) {

    App.$(
      "dashAveragePrice"
    ).textContent =
      averagePrice > 0
        ? App.money(
            averagePrice
          ) +
          "/L"
        : "—";

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


  if (
    !App.state.fuelLogs.length
  ) {

    container.innerHTML = `
      <div class="empty-state">

        <div class="empty-icon">
          ⛽
        </div>

        <strong>
          No fill-ups yet
        </strong>

        Add your first fuel purchase to start tracking.

      </div>
    `;

    return;

  }


  container.innerHTML =
    App.state.fuelLogs
      .slice(0, 30)
      .map(log => `

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
              •
              ${App.number(
                log.liters,
                1
              )} L
              •
              ${App.money(
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

      `).join("");

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
        now.getMonth() -
          offset,
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
    .forEach(log => {

      const date =
        new Date(
          log.date +
          "T12:00:00"
        );


      const month =
        months.find(
          item =>
            item.year ===
              date.getFullYear() &&
            item.month ===
              date.getMonth()
        );


      if (month) {

        month.total +=
          Number(
            log.total || 0
          );

      }

    });


  const max =
    Math.max(
      1,
      ...months.map(
        month =>
          month.total
      )
    );


  container.innerHTML =
    months.map(month => {

      const height =
        month.total > 0
          ? Math.max(
              5,
              month.total /
                max *
                100
            )
          : 2;


      return `

        <div class="chart-column">

          <div class="chart-value">
            ${
              month.total > 0
                ? App.money(
                    month.total
                  )
                : ""
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

    }).join("");

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


  let totalPoints = 0;


  Object.values(
    App.state.rewards
  ).forEach(reward => {

    totalPoints +=
      Number(
        reward.points || 0
      );

  });


  if (
    App.$(
      "totalRewardPoints"
    )
  ) {

    App.$(
      "totalRewardPoints"
    ).textContent =
      totalPoints.toLocaleString();

  }


  container.innerHTML =
    Object.entries(
      App.state.rewards
    )
      .map(
        ([brand, reward]) => `

        <div class="card reward-card">

          <div class="reward-head">

            <div class="reward-logo">
              ${App.escape(
                brand.charAt(0)
              )}
            </div>

            <div class="reward-info">

              <strong>
                ${App.escape(
                  brand
                )}
              </strong>

              <div class="muted">
                GasGo Rewards
              </div>

            </div>

            <div class="reward-points">
              ${Number(
                reward.points || 0
              ).toLocaleString()}
              pts
            </div>

          </div>

        </div>

      `)
      .join("");

};


/* =========================================================
   PRICE REFERENCES
   ========================================================= */

App.renderPriceReference =
function () {

  const container =
    App.$(
      "brandPriceList"
    );


  if (
    !container ||
    !window.GasGoData ||
    !GasGoData.BRAND_PRICES
  ) {
    return;
  }


  container.innerHTML =
    Object.entries(
      GasGoData.BRAND_PRICES
    )
      .filter(
        ([brand]) =>
          brand !==
          "Independent"
      )
      .map(
        ([brand, prices]) => `

        <div class="card price-card">

          <div class="row">

            <div>

              <strong>
                ${App.escape(
                  brand
                )}
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
                  prices.regular
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
                  prices.premium
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
                  prices.diesel
                )}
              </b>

              <span>
                per L
              </span>

            </div>

          </div>

        </div>

      `)
      .join("");

};


/* =========================================================
   QUICK ACTIONS
   ========================================================= */

App.openStations = function () {
  App.showScreen("stations");
};

App.openDashboard = function () {
  App.showScreen("dashboard");
};

App.openRewards = function () {
  App.showScreen("rewards");
};

App.openCar = function () {
  App.showScreen("car");
};

App.openPrices = function () {
  App.showScreen("prices");
};


/* =========================================================
   LISTENERS
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


  [
    "vehicleLevel",
    "vehicleFullRange",
    "vehicleTankCapacity"
  ].forEach(id => {

    const element =
      App.$(id);


    if (element) {

      element.addEventListener(
        "input",
        App.updateVehicleSliderLabels
      );

    }

  });


  [
    "logLiters",
    "logPrice"
  ].forEach(id => {

    const element =
      App.$(id);


    if (element) {

      element.addEventListener(
        "input",
        App.updateFuelLogPreview
      );

    }

  });


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        App.closeVehicleModal();

        App.closeFuelLogModal();

      }

    }
  );

};


/* =========================================================
   INIT
   ========================================================= */

App.init = function () {

  console.log(
    "GasGo " +
    App.VERSION +
    " starting…"
  );


  if (
    !window.GasGoData
  ) {

    console.error(
      "stations.js must load before app.js"
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

  App.syncEnergyFilterToVehicle();

  App.showScreen("home");


  /*
    Stations load in the background.
    The user does not have to wait for the map.
  */

  App.loadStations();


  /*
    FIRST-TIME EXPERIENCE
  */

  if (
    App.shouldShowOnboarding()
  ) {

    setTimeout(() => {

      App.showOnboarding();

    }, 250);

  }


  console.log(
    "GasGo ready 🚗⛽⚡"
  );

};


/* =========================================================
   START
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    App.init
  );

} else {

  App.init();

}
