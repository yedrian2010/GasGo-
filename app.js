"use strict";

/* =========================================================
   GASGO APP
   Version 5.5.1

   Requires:
   - stations.js
   - vehicles.js

   Optional enhancements loaded after this file:
   - map-v55.js
   - smart-v6.js
   ========================================================= */

window.GasGoApp = window.GasGoApp || {};
const App = window.GasGoApp;

App.VERSION = "5.5.1";


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
   FALLBACK VEHICLE CATALOG
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

  configuration:
    "Gasoline • 1.4L Turbo / 1.8L",

  powertrain: "Gasoline",

  level: 68,
  fullRange: 350,

  tankCapacity: 46,

  batteryCapacity: null,
  batteryKWh: null,

  capacitySource: "vehicle-database"
};


/* =========================================================
   DEFAULT REWARDS
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
   BASIC HELPERS
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

  if (!Number.isFinite(value)) {
    return min;
  }

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


/*
  Returns the first valid positive numeric value.

  This lets app.js understand both the new vehicles.js
  V3 property names and older GasGo property names.
*/

App.firstFinitePositive = function (...values) {

  for (const value of values) {

    const number = Number(value);

    if (
      Number.isFinite(number) &&
      number > 0
    ) {
      return number;
    }

  }

  return null;

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

  } catch (error) {

    console.warn(
      "GasGo storage read error:",
      error
    );

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

  } catch (error) {

    console.warn(
      "GasGo storage save error:",
      error
    );

    return false;

  }

};


App.setText = function (
  id,
  text
) {

  const element = App.$(id);

  if (element) {
    element.textContent = text;
  }

};


App.setDisplay = function (
  id,
  value
) {

  const element = App.$(id);

  if (element) {
    element.style.display = value;
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

    console.log(
      "GasGo:",
      message
    );

    return;
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
   VEHICLE DATABASE HELPERS
   ========================================================= */

App.getVehicleDB = function () {

  if (
    window.GasGoVehicles &&
    typeof window.GasGoVehicles ===
      "object"
  ) {

    return window.GasGoVehicles;

  }

  return null;

};


App.normalizePowertrain = function (
  value
) {

  const text =
    String(value || "")
      .trim()
      .toLowerCase();


  if (
    text === "ev" ||
    text === "electric" ||
    text.includes("battery electric")
  ) {
    return "Electric";
  }


  if (
    text.includes("plug-in") ||
    text.includes("plug in") ||
    text.includes("phev")
  ) {
    return "Plug-in Hybrid";
  }


  if (
    text.includes("hybrid")
  ) {
    return "Hybrid";
  }


  return "Gasoline";

};


/* =========================================================
   VEHICLE CATALOG ACCESS
   ========================================================= */

App.getVehicleYears = function () {

  const DB =
    App.getVehicleDB();


  if (
    DB &&
    typeof DB.getYears ===
      "function"
  ) {

    try {

      const years =
        DB.getYears();

      if (
        Array.isArray(years) &&
        years.length
      ) {

        return years
          .map(Number)
          .filter(Number.isFinite)
          .sort(
            (a, b) => b - a
          );

      }

    } catch (error) {

      console.warn(
        "GasGo vehicle years error:",
        error
      );

    }

  }


  const years = [];

  for (
    let year = 2027;
    year >= 1996;
    year--
  ) {
    years.push(year);
  }

  return years;

};


App.getVehicleMakes = function (
  year = null
) {

  const DB =
    App.getVehicleDB();


  if (
    DB &&
    typeof DB.getMakes ===
      "function"
  ) {

    try {

      const makes =
        DB.getMakes(year);

      if (
        Array.isArray(makes) &&
        makes.length
      ) {
        return makes;
      }

    } catch (error) {

      console.warn(
        "GasGo vehicle makes error:",
        error
      );

    }

  }


  return Object.keys(
    App.VEHICLES
  );

};


App.getVehicleModels = function (
  year,
  make
) {

  const DB =
    App.getVehicleDB();


  if (
    DB &&
    typeof DB.getModels ===
      "function"
  ) {

    try {

      const models =
        DB.getModels(
          Number(year),
          make
        );

      if (
        Array.isArray(models) &&
        models.length
      ) {
        return models;
      }

    } catch (error) {

      console.warn(
        "GasGo vehicle models error:",
        error
      );

    }

  }


  return (
    App.VEHICLES[make] ||
    ["Other"]
  );

};


App.getVehicleConfigurations =
function (
  year,
  make,
  model
) {

  const DB =
    App.getVehicleDB();


  if (
    !DB ||
    typeof DB.getConfigurations !==
      "function"
  ) {
    return [];
  }


  try {

    const results =
      DB.getConfigurations(
        Number(year),
        make,
        model
      );

    return Array.isArray(results)
      ? results
      : [];

  } catch (error) {

    console.warn(
      "GasGo configuration error:",
      error
    );

    return [];

  }

};


App.getVehicleConfigurationLabel =
function (record) {

  const DB =
    App.getVehicleDB();


  if (
    DB &&
    typeof DB.getConfigurationLabel ===
      "function"
  ) {

    try {

      return String(
        DB.getConfigurationLabel(
          record
        ) || ""
      );

    } catch (error) {

      console.warn(
        "GasGo configuration label error:",
        error
      );

    }

  }


  const pieces = [
    record?.powertrain,
    record?.trim,
    record?.engine,
    record?.drivetrain
  ].filter(Boolean);


  return pieces.join(" • ");

};


/* =========================================================
   VEHICLE LOOKUP
   V5.5.1 compatibility layer
   ========================================================= */

App.lookupVehicleSpecification =
function ({
  year,
  make,
  model,
  configuration = ""
}) {

  const DB =
    App.getVehicleDB();


  if (
    !DB ||
    typeof DB.lookup !==
      "function"
  ) {

    return {
      found: false,
      exact: false,
      requiresConfiguration: false,
      vehicle: null,
      tankLiters: null,
      tankCapacity: null,
      batteryKWh: null,
      batteryCapacity: null
    };

  }


  try {

    const raw =
      DB.lookup({
        year: Number(year),
        make,
        model,
        configuration
      }) || {};


    const vehicle =
      raw.vehicle || null;


    /*
      vehicles.js V3 uses tankLiters.

      Older GasGo code used tankCapacity.

      We normalize both so the rest of the app can
      safely use either name.
    */

    const tankLiters =
      App.firstFinitePositive(
        raw.tankLiters,
        raw.tankCapacity,
        raw.tankCapacityLiters,
        vehicle?.tankLiters,
        vehicle?.tankCapacity,
        vehicle?.tankCapacityLiters
      );


    /*
      Same compatibility layer for EV batteries.
    */

    const batteryKWh =
      App.firstFinitePositive(
        raw.batteryKWh,
        raw.batteryCapacity,
        vehicle?.batteryKWh,
        vehicle?.batteryCapacity
      );


    return {

      ...raw,

      vehicle,

      found:
        raw.found === true ||
        Boolean(vehicle),

      exact:
        raw.exact === true,

      requiresConfiguration:
        raw.requiresConfiguration ===
        true,

      powertrain:
        raw.powertrain ||
        vehicle?.powertrain ||
        null,

      tankLiters,

      tankCapacity:
        tankLiters,

      batteryKWh,

      batteryCapacity:
        batteryKWh,

      verified:
        raw.verified === true ||
        vehicle?.verified === true

    };

  } catch (error) {

    console.warn(
      "GasGo vehicle lookup error:",
      error
    );


    return {
      found: false,
      exact: false,
      requiresConfiguration: false,
      vehicle: null,
      tankLiters: null,
      tankCapacity: null,
      batteryKWh: null,
      batteryCapacity: null
    };

  }

};


/* =========================================================
   POPULATE YEAR
   ========================================================= */

App.populateYearSelect = function (
  select,
  selectedYear = null
) {

  if (!select) {
    return;
  }


  const years =
    App.getVehicleYears();


  select.innerHTML = "";


  years.forEach(year => {

    const option =
      document.createElement(
        "option"
      );

    option.value =
      String(year);

    option.textContent =
      String(year);

    select.appendChild(
      option
    );

  });


  if (
    selectedYear &&
    years.includes(
      Number(selectedYear)
    )
  ) {

    select.value =
      String(selectedYear);

  }

};


/* =========================================================
   POPULATE MAKE
   ========================================================= */

App.populateMakeSelect = function (
  select,
  year = null,
  selectedMake = null
) {

  if (!select) {
    return;
  }


  const makes =
    App.getVehicleMakes(year);


  select.innerHTML = "";


  makes.forEach(make => {

    const option =
      document.createElement(
        "option"
      );

    option.value = make;
    option.textContent = make;

    select.appendChild(
      option
    );

  });


  if (
    selectedMake &&
    makes.includes(
      selectedMake
    )
  ) {
    select.value =
      selectedMake;
  }

};


/* =========================================================
   POPULATE MODEL
   ========================================================= */

App.populateModelSelect = function (
  year,
  make,
  select,
  selectedModel = null
) {

  if (!select) {
    return;
  }


  const models =
    App.getVehicleModels(
      year,
      make
    );


  select.innerHTML = "";


  models.forEach(model => {

    const option =
      document.createElement(
        "option"
      );

    option.value = model;
    option.textContent = model;

    select.appendChild(
      option
    );

  });


  if (
    selectedModel &&
    models.includes(
      selectedModel
    )
  ) {

    select.value =
      selectedModel;

  }

};


/* =========================================================
   POPULATE CONFIGURATION
   ========================================================= */

App.populateConfigurationSelect =
function (
  select,
  configurations,
  selectedConfiguration = null
) {

  if (!select) {
    return;
  }


  select.innerHTML = "";


  if (
    !Array.isArray(
      configurations
    ) ||
    !configurations.length
  ) {
    return;
  }


  if (
    configurations.length > 1
  ) {

    const placeholder =
      document.createElement(
        "option"
      );

    placeholder.value = "";

    placeholder.textContent =
      "Select configuration";

    select.appendChild(
      placeholder
    );

  }


  configurations.forEach(
    record => {

      const label =
        App.getVehicleConfigurationLabel(
          record
        );


      const option =
        document.createElement(
          "option"
        );

      option.value = label;
      option.textContent = label;

      select.appendChild(
        option
      );

    }
  );


  if (selectedConfiguration) {

    const exists =
      Array.from(
        select.options
      ).some(
        option =>
          option.value ===
          selectedConfiguration
      );


    if (exists) {

      select.value =
        selectedConfiguration;

    }

  }


  if (
    configurations.length === 1
  ) {

    select.value =
      App.getVehicleConfigurationLabel(
        configurations[0]
      );

  }

};


/* =========================================================
   TANK SLIDER
   ========================================================= */

App.setTankSliderValue = function (
  element,
  liters
) {

  if (!element) {
    return;
  }


  const capacity =
    Number(liters);


  if (
    !Number.isFinite(capacity) ||
    capacity <= 0
  ) {
    return;
  }


  if (
    capacity >
    Number(element.max || 120)
  ) {

    element.max =
      String(
        Math.ceil(capacity)
      );

  }


  if (
    capacity <
    Number(element.min || 0)
  ) {

    element.min =
      String(
        Math.floor(capacity)
      );

  }


  element.value =
    String(
      Number(
        capacity.toFixed(1)
      )
    );

};


/* =========================================================
   VEHICLE DATABASE STATUS
   ========================================================= */

App.setVehicleSpecStatus = function (
  prefix,
  message,
  type = ""
) {

  const status =
    App.$(
      prefix + "TankStatus"
    );


  if (!status) {
    return;
  }


  status.textContent =
    message;


  status.dataset.status =
    type;


  status.classList.remove(
    "detected",
    "verified",
    "manual",
    "warning",
    "select"
  );


  if (
    type === "verified"
  ) {

    status.classList.add(
      "verified",
      "detected"
    );

  } else if (
    [
      "detected",
      "manual",
      "warning",
      "select"
    ].includes(type)
  ) {

    status.classList.add(type);

  }

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


App.prepareOnboarding = function () {

  const year =
    App.$("onboardingYear");

  const make =
    App.$("onboardingMake");

  const model =
    App.$("onboardingModel");


  /*
    Sonic 2015 is a verified record in vehicles.js V3,
    which also gives us an easy reference for testing
    automatic tank detection.
  */

  App.populateYearSelect(
    year,
    2015
  );


  if (year) {
    year.value = "2015";
  }


  App.populateMakeSelect(
    make,
    2015,
    "Chevrolet"
  );


  if (
    make &&
    Array.from(
      make.options
    ).some(
      option =>
        option.value ===
        "Chevrolet"
    )
  ) {

    make.value =
      "Chevrolet";

  }


  App.populateModelSelect(
    2015,
    "Chevrolet",
    model,
    "Sonic"
  );


  if (
    model &&
    Array.from(
      model.options
    ).some(
      option =>
        option.value ===
        "Sonic"
    )
  ) {

    model.value = "Sonic";

  }


  App.updateOnboardingVehicleSpec();

  App.updateOnboardingPowertrain();

  App.updateOnboardingSliderLabels();

};


App.showOnboarding = function () {

  const onboarding =
    App.$("onboarding") ||
    App.$("onboardingModal");


  if (!onboarding) {
    return;
  }


  App.prepareOnboarding();


  onboarding.classList.add(
    "open"
  );

};


/* =========================================================
   ONBOARDING YEAR
   ========================================================= */

App.updateOnboardingYear = function () {

  const year =
    Number(
      App.$(
        "onboardingYear"
      )?.value
    );


  const make =
    App.$(
      "onboardingMake"
    );


  const previousMake =
    make?.value || "";


  App.populateMakeSelect(
    make,
    year,
    previousMake
  );


  App.updateOnboardingModels();

};


/* =========================================================
   ONBOARDING MODELS
   ========================================================= */

App.updateOnboardingModels =
function () {

  const year =
    Number(
      App.$(
        "onboardingYear"
      )?.value
    );


  const make =
    App.$(
      "onboardingMake"
    );


  const model =
    App.$(
      "onboardingModel"
    );


  if (
    !make ||
    !model
  ) {
    return;
  }


  const previousModel =
    model.value;


  App.populateModelSelect(
    year,
    make.value,
    model,
    previousModel
  );


  App.updateOnboardingVehicleSpec();

};


/* =========================================================
   ONBOARDING VEHICLE SPEC
   ========================================================= */

App.updateOnboardingVehicleSpec =
function () {

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


  const configurationField =
    App.$(
      "onboardingConfigurationField"
    );


  const configurationSelect =
    App.$(
      "onboardingConfiguration"
    );


  /*
    CRITICAL V5.5.1 FIX:

    Save the current configuration BEFORE rebuilding
    the select.

    Previously selecting a configuration could cause
    this function to rebuild the menu and erase the
    option the driver had just selected.
  */

  const previousConfiguration =
    configurationSelect?.value ||
    "";


  if (
    !year ||
    !make ||
    !model
  ) {

    if (configurationField) {
      configurationField.style.display =
        "none";
    }

    return;

  }


  const configurations =
    App.getVehicleConfigurations(
      year,
      make,
      model
    );


  if (!configurations.length) {

    if (configurationField) {
      configurationField.style.display =
        "none";
    }


    if (configurationSelect) {
      configurationSelect.innerHTML =
        "";
    }


    App.setVehicleSpecStatus(
      "onboarding",
      "Specification unavailable — adjust tank capacity manually.",
      "manual"
    );


    return;

  }


  if (configurationField) {

    configurationField.style.display =
      configurations.length > 1
        ? ""
        : "none";

  }


  App.populateConfigurationSelect(
    configurationSelect,
    configurations,
    previousConfiguration
  );


  if (
    configurations.length > 1 &&
    !configurationSelect?.value
  ) {

    App.setVehicleSpecStatus(
      "onboarding",
      "Select the correct configuration to detect tank capacity.",
      "select"
    );

    return;

  }


  App.applyOnboardingVehicleSpecification();

};


/* =========================================================
   APPLY ONBOARDING SPECIFICATION
   ========================================================= */

App.applyOnboardingVehicleSpecification =
function () {

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


  const configuration =
    App.$(
      "onboardingConfiguration"
    )?.value || "";


  const result =
    App.lookupVehicleSpecification({
      year,
      make,
      model,
      configuration
    });


  if (
    result.requiresConfiguration
  ) {

    App.setVehicleSpecStatus(
      "onboarding",
      "Select the correct configuration to detect tank capacity.",
      "select"
    );

    return;

  }


  if (!result.found) {

    App.setVehicleSpecStatus(
      "onboarding",
      "Specification unavailable — adjust tank capacity manually.",
      "manual"
    );

    return;

  }


  const powertrain =
    App.normalizePowertrain(
      result.powertrain
    );


  const powertrainSelect =
    App.$(
      "onboardingPowertrain"
    );


  if (powertrainSelect) {

    const optionExists =
      Array.from(
        powertrainSelect.options
      ).some(
        option =>
          option.value ===
          powertrain
      );


    if (optionExists) {

      powertrainSelect.value =
        powertrain;

    }

  }


  const tank =
    App.firstFinitePositive(
      result.tankLiters,
      result.tankCapacity
    );


  if (
    powertrain !== "Electric" &&
    tank !== null
  ) {

    App.setTankSliderValue(
      App.$("onboardingTank"),
      tank
    );


    App.setVehicleSpecStatus(
      "onboarding",
      "✓ Vehicle specification detected • " +
      App.number(
        tank,
        1
      ) +
      " L",
      "verified"
    );

  } else if (
    powertrain === "Electric"
  ) {

    const battery =
      App.firstFinitePositive(
        result.batteryKWh,
        result.batteryCapacity
      );


    App.setVehicleSpecStatus(
      "onboarding",
      battery !== null
        ? "✓ Electric vehicle detected • " +
          App.number(
            battery,
            1
          ) +
          " kWh"
        : "✓ Electric vehicle detected.",
      "verified"
    );

  } else {

    App.setVehicleSpecStatus(
      "onboarding",
      "Vehicle detected, but tank capacity is unavailable — adjust manually.",
      "manual"
    );

  }


  App.updateOnboardingPowertrain();

  App.updateOnboardingSliderLabels();

};


/* =========================================================
   ONBOARDING POWERTRAIN
   ========================================================= */

App.updateOnboardingPowertrain =
function () {

  const powertrain =
    App.$(
      "onboardingPowertrain"
    )?.value;


  const tankField =
    App.$(
      "onboardingTankField"
    );


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


/* =========================================================
   ONBOARDING SLIDER LABELS
   ========================================================= */

App.updateOnboardingSliderLabels =
function () {

  const level =
    App.$(
      "onboardingLevel"
    );


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
    App.$(
      "onboardingRange"
    );


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
    App.$(
      "onboardingTank"
    );


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


/* =========================================================
   MANUAL ONBOARDING TANK
   ========================================================= */

App.onOnboardingTankManualInput =
function () {

  App.updateOnboardingSliderLabels();


  const tank =
    Number(
      App.$(
        "onboardingTank"
      )?.value
    );


  if (
    Number.isFinite(tank)
  ) {

    App.setVehicleSpecStatus(
      "onboarding",
      "Manual capacity • " +
      App.number(
        tank,
        1
      ) +
      " L",
      "manual"
    );

  }

};


/* =========================================================
   FINISH ONBOARDING
   ========================================================= */

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


  const configuration =
    App.$(
      "onboardingConfiguration"
    )?.value || "";


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


  const configurations =
    App.getVehicleConfigurations(
      year,
      make,
      model
    );


  if (
    configurations.length > 1 &&
    !configuration
  ) {

    App.toast(
      "Select your vehicle configuration.",
      "error"
    );

    return;

  }


  const specification =
    App.lookupVehicleSpecification({
      year,
      make,
      model,
      configuration
    });


  const batteryCapacity =
    specification.found
      ? App.firstFinitePositive(
          specification.batteryKWh,
          specification.batteryCapacity
        )
      : null;


  App.state.vehicle = {

    year,

    make,

    model,

    configuration,

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
        ? null
        : (
            Number.isFinite(
              tankCapacity
            ) &&
            tankCapacity > 0
              ? Number(
                  tankCapacity.toFixed(1)
                )
              : 46
          ),

    batteryCapacity:
      batteryCapacity,

    batteryKWh:
      batteryCapacity,

    capacitySource:
      specification.found
        ? "vehicle-database"
        : "manual"

  };


  App.saveStorage(
    App.STORAGE.vehicle,
    App.state.vehicle
  );


  App.saveStorage(
    App.STORAGE.onboarding,
    true
  );


  const onboarding =
    App.$("onboarding") ||
    App.$("onboardingModal");


  onboarding?.classList.remove(
    "open"
  );


  App.refreshVehicleUI();

  App.syncEnergyFilterToVehicle();

  App.applyStationFilters();


  App.toast(
    "Vehicle added. Welcome to GasGo 🚗",
    "success"
  );

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

  const type =
    String(
      App.state.vehicle?.powertrain ||
      ""
    ).toLowerCase();


  if (
    type === "electric"
  ) {
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

    const result =
      Number(
        GasGoData.getEstimatedVehicleRange(
          vehicle
        )
      );


    if (
      Number.isFinite(result)
    ) {
      return result;
    }

  }


  return (
    Number(
      vehicle.fullRange || 0
    ) *
    Number(
      vehicle.level || 0
    ) /
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
    typeof savedVehicle ===
      "object"
  ) {

    App.state.vehicle = {
      ...App.DEFAULT_VEHICLE,
      ...savedVehicle
    };

  } else {

    App.state.vehicle = {
      ...App.DEFAULT_VEHICLE
    };

  }


  /*
    Keep both EV battery property names synchronized.
  */

  const savedBattery =
    App.firstFinitePositive(
      App.state.vehicle.batteryKWh,
      App.state.vehicle.batteryCapacity
    );


  App.state.vehicle.batteryCapacity =
    savedBattery;

  App.state.vehicle.batteryKWh =
    savedBattery;


  if (
    App.state.vehicle.powertrain ===
    "Electric"
  ) {

    App.state.vehicle.tankCapacity =
      null;

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
   VEHICLE ENERGY UI
   ========================================================= */

App.syncEnergyFilterToVehicle =
function () {

  const mode =
    App.getVehicleEnergyMode();


  if (
    mode === "ev"
  ) {

    App.state.selectedKind =
      "ev";

  } else if (
    mode === "both"
  ) {

    App.state.selectedKind =
      "all";

  } else {

    App.state.selectedKind =
      "fuel";

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
    App.$(
      "fuelTypeFilters"
    );


  const brandFilters =
    App.$(
      "brandFilters"
    );


  if (
    App.state.selectedKind ===
    "ev"
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
    App.$(
      "homeRange"
    );


  if (homeRange) {

    homeRange.innerHTML =
      Math.round(range) +
      " <small>mi</small>";

  }


  App.setText(
    "homeLevel",
    Math.round(
      Number(
        vehicle.level
      )
    ) + "%"
  );


  App.setText(
    "homeFuelLabel",
    vehicle.powertrain ===
      "Electric"
      ? "Battery"
      : "Fuel"
  );


  App.setText(
    "homeVehicleName",
    vehicle.year +
    " " +
    vehicle.make +
    " " +
    vehicle.model
  );


  const bar =
    App.$(
      "homeLevelBar"
    );


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


  App.$all(
    ".screen"
  ).forEach(screen => {

    screen.classList.toggle(
      "active",
      screen.id ===
        "screen-" +
        screenName
    );

  });


  App.$all(
    ".nav"
  ).forEach(nav => {

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
    screenName ===
    "stations"
  ) {

    App.initializeMap();


    setTimeout(() => {

      App.state.map
        ?.invalidateSize(true);

    }, 120);

  }


  if (
    screenName ===
    "dashboard"
  ) {
    App.renderDashboard();
  }


  if (
    screenName ===
    "rewards"
  ) {
    App.renderRewards();
  }


  if (
    screenName ===
    "car"
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

  App.setText(
    "stationStatus",
    text
  );

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

    if (
      !window.GasGoData
    ) {

      throw new Error(
        "stations.js missing"
      );

    }


    let result = null;


    if (
      typeof GasGoData.fetchStations ===
        "function"
    ) {

      result =
        await GasGoData.fetchStations();

    } else if (
      typeof GasGoData.loadStations ===
        "function"
    ) {

      result =
        await GasGoData.loadStations();

    } else if (
      typeof GasGoData.getStations ===
        "function"
    ) {

      result =
        await GasGoData.getStations();

    }


    if (
      Array.isArray(result)
    ) {

      App.state.stations =
        result;

      App.state.stationSource =
        "mapped";

      App.state.usingFallback =
        false;

    } else {

      App.state.stations =
        Array.isArray(
          result?.stations
        )
          ? result.stations
          : [];


      App.state.stationSource =
        result?.source || "";


      App.state.usingFallback =
        Boolean(
          result?.fallback
        );

    }


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

    } else {

      App.setStationStatus(
        "Unable to load mapped locations."
      );

    }

  } finally {

    App.state.stationsLoading =
      false;


    const loader =
      App.$(
        "mapLoader"
      );


    if (
      loader &&
      App.state.mapInitialized
    ) {

      loader.style.display =
        "none";

    }

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
    typeof L ===
      "undefined"
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


  const hideLoader =
    function () {

      const loader =
        App.$(
          "mapLoader"
        );


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

  if (!station) {
    return "";
  }


  if (
    station.type ===
    "ev"
  ) {

    const ev =
      station.ev || {};


    const sockets =
      Array.isArray(
        ev.sockets
      )
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
    (
      typeof GasGoData.getStationPrices ===
        "function"
        ? GasGoData.getStationPrices(
            station
          )
        : {}
    );


  return `
    <div>

      <div class="popup-title">
        ⛽ ${App.escape(station.name)}
      </div>

      <div class="popup-brand">
        ${App.escape(
          station.brand || ""
        )}
      </div>

      <div class="popup-prices">

        <div class="popup-price">
          <span>Regular</span>
          <strong>
            ${App.money(
              prices.regular
            )}
          </strong>
        </div>

        <div class="popup-price">
          <span>Premium</span>
          <strong>
            ${App.money(
              prices.premium
            )}
          </strong>
        </div>

        <div class="popup-price">
          <span>Diesel</span>
          <strong>
            ${App.money(
              prices.diesel
            )}
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
    !App.state.markerLayer ||
    typeof L === "undefined"
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
            Number(station.lat),
            Number(station.lon)
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
        station.type ===
          "ev"
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

          App.state.selectedStation =
            station;

          App.renderStationSheet();

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

  if (
    !window.GasGoData
  ) {
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

  } else if (
    App.state.searchQuery
  ) {

    const query =
      String(
        App.state.searchQuery
      ).toLowerCase();


    stations =
      stations.filter(
        station => {

          const haystack = [
            station.name,
            station.brand,
            station.municipality
          ]
            .join(" ")
            .toLowerCase();


          return haystack.includes(
            query
          );

        }
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
    App.state.userLocation &&
    typeof GasGoData.sortClosest ===
      "function"
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
      typeof GasGoData.sortCheapest ===
        "function"
        ? GasGoData.sortCheapest(
            fuel,
            App.state.selectedFuel
          )
        : fuel;


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
      typeof GasGoData.sortBestValue ===
        "function"
        ? GasGoData.sortBestValue(
            fuel,
            App.state.userLocation,
            App.state.selectedFuel
          )
        : fuel;


    const sortedEV =
      (
        App.state.userLocation &&
        typeof GasGoData.sortClosest ===
          "function"
      )
        ? GasGoData.sortClosest(
            ev,
            App.state.userLocation
          )
        : ev;


    if (
      App.state.selectedKind ===
      "ev"
    ) {

      stations =
        sortedEV;

    } else if (
      App.state.selectedKind ===
      "fuel"
    ) {

      stations =
        sortedFuel;

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


  if (
    kind === "ev"
  ) {

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
    App.$(
      "stationSearch"
    );


  if (input) {
    input.value = "";
  }


  App.state.searchQuery =
    "";


  App.applyStationFilters();

};


/* =========================================================
   DISTANCE HELPERS
   ========================================================= */

App.getStationDistance = function (
  station
) {

  if (
    !station ||
    !App.state.userLocation ||
    typeof GasGoData.distanceMiles !==
      "function"
  ) {
    return null;
  }


  return GasGoData.distanceMiles(
    App.state.userLocation.lat,
    App.state.userLocation.lon,
    station.lat,
    station.lon
  );

};


App.formatDistance = function (
  distance
) {

  if (
    !Number.isFinite(
      Number(distance)
    )
  ) {
    return "—";
  }


  if (
    typeof GasGoData.formatDistance ===
      "function"
  ) {

    return GasGoData.formatDistance(
      distance
    );

  }


  return Number(
    distance
  ).toFixed(1) + " mi";

};


/* =========================================================
   END PART 1/2

   PART 2 begins with:
   App.renderStationList = function () {
   ========================================================= */
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
        <div class="empty-icon">📍</div>
        <strong>No locations found</strong>
        Try changing your filters or search.
      </div>
    `;

    return;

  }


  container.innerHTML =
    stations.map(station => {

      const distance =
        App.getStationDistance(
          station
        );


      const distanceText =
        App.formatDistance(
          distance
        );


      if (
        station.type === "ev"
      ) {

        const ev =
          station.ev || {};


        const power =
          ev.power ||
          "Power not listed";


        const sockets =
          Array.isArray(
            ev.sockets
          )
            ? ev.sockets.join(", ")
            : ev.sockets ||
              "Connectors not listed";


        return `
          <article
            class="card station-list-item"
            onclick="GasGoApp.selectStationById('${App.escape(station.id)}')"
          >

            <div class="station-list-main">

              <div class="station-list-icon">
                ⚡
              </div>

              <div class="station-list-info">

                <strong>
                  ${App.escape(station.name)}
                </strong>

                <div class="muted">
                  ${App.escape(
                    station.brand ||
                    "EV Charging"
                  )}
                </div>

                <div class="muted">
                  ${App.escape(power)}
                  •
                  ${App.escape(sockets)}
                </div>

              </div>

            </div>

            <div class="station-list-side">

              <strong>
                ${App.escape(distanceText)}
              </strong>

              <span class="badge">
                EV
              </span>

            </div>

          </article>
        `;

      }


      const prices =
        station.prices ||
        (
          typeof GasGoData.getStationPrices ===
            "function"
            ? GasGoData.getStationPrices(
                station
              )
            : {}
        );


      const price =
        Number(
          prices[
            App.state.selectedFuel
          ]
        );


      return `
        <article
          class="card station-list-item"
          onclick="GasGoApp.selectStationById('${App.escape(station.id)}')"
        >

          <div class="station-list-main">

            <div class="station-list-icon">
              ⛽
            </div>

            <div class="station-list-info">

              <strong>
                ${App.escape(station.name)}
              </strong>

              <div class="muted">
                ${App.escape(
                  station.brand ||
                  "Fuel Station"
                )}
              </div>

              <div class="muted">
                ${App.escape(distanceText)}
              </div>

            </div>

          </div>

          <div class="station-list-side">

            <strong>
              ${
                Number.isFinite(price)
                  ? App.money(price)
                  : "—"
              }
            </strong>

            <span class="muted">
              /L
            </span>

          </div>

        </article>
      `;

    }).join("");

};


/* =========================================================
   SELECT STATION
   ========================================================= */

App.selectStationById = function (
  stationId
) {

  const station =
    App.state.stations.find(
      item =>
        String(item.id) ===
        String(stationId)
    );


  if (!station) {
    return;
  }


  App.selectStation(
    station,
    true
  );

};


App.selectStation = function (
  station,
  focusMap = false
) {

  if (!station) {
    return;
  }


  App.state.selectedStation =
    station;


  App.renderStationSheet();


  if (
    focusMap &&
    App.state.map
  ) {

    const lat =
      Number(station.lat);

    const lon =
      Number(station.lon);


    if (
      Number.isFinite(lat) &&
      Number.isFinite(lon)
    ) {

      App.state.map.setView(
        [lat, lon],
        Math.max(
          App.state.map.getZoom(),
          14
        ),
        {
          animate: true
        }
      );

    }


    const marker =
      App.state.markers.get(
        String(station.id)
      );


    if (marker) {

      setTimeout(() => {

        try {
          marker.openPopup();
        } catch (error) {
          console.warn(
            "GasGo popup error:",
            error
          );
        }

      }, 100);

    }

  }


  App.renderMapStations();

};


/* =========================================================
   STATION SHEET
   ========================================================= */

App.renderStationSheet = function () {

  const sheet =
    App.$("stationSheet");


  if (!sheet) {
    return;
  }


  const station =
    App.state.selectedStation;


  if (!station) {

    sheet.innerHTML = `
      <div class="muted">
        Select a station or charger to view details.
      </div>
    `;

    return;

  }


  const distance =
    App.getStationDistance(
      station
    );


  const distanceText =
    App.formatDistance(
      distance
    );


  if (
    station.type === "ev"
  ) {

    const ev =
      station.ev || {};


    const sockets =
      Array.isArray(
        ev.sockets
      )
        ? ev.sockets.join(", ")
        : ev.sockets ||
          "Not listed";


    sheet.innerHTML = `
      <div class="station-sheet-head">

        <div>

          <div class="eyebrow">
            EV CHARGER
          </div>

          <h3>
            ⚡ ${App.escape(station.name)}
          </h3>

          <div class="muted">
            ${App.escape(
              station.brand ||
              "EV Charging"
            )}
            ${
              distance !== null
                ? " • " +
                  App.escape(
                    distanceText
                  )
                : ""
            }
          </div>

        </div>

      </div>

      <div class="station-sheet-grid">

        <div class="station-sheet-stat">
          <span>Connectors</span>
          <strong>
            ${App.escape(sockets)}
          </strong>
        </div>

        <div class="station-sheet-stat">
          <span>Power</span>
          <strong>
            ${App.escape(
              ev.power ||
              "Not listed"
            )}
          </strong>
        </div>

        <div class="station-sheet-stat">
          <span>Ports</span>
          <strong>
            ${App.escape(
              ev.capacity ||
              "—"
            )}
          </strong>
        </div>

      </div>

      <div class="notice mt-12">
        Charging availability and pricing may not be
        available in OpenStreetMap data.
      </div>

      <div class="button-row mt-12">

        <button
          class="secondary"
          onclick="GasGoApp.runCanIMakeIt()"
        >
          CAN I MAKE IT?
        </button>

        <button
          class="primary"
          onclick="GasGoApp.openDirections()"
        >
          DIRECTIONS
        </button>

      </div>
    `;


    return;

  }


  const prices =
    station.prices ||
    (
      typeof GasGoData.getStationPrices ===
        "function"
        ? GasGoData.getStationPrices(
            station
          )
        : {}
    );


  sheet.innerHTML = `
    <div class="station-sheet-head">

      <div>

        <div class="eyebrow">
          FUEL STATION
        </div>

        <h3>
          ⛽ ${App.escape(station.name)}
        </h3>

        <div class="muted">
          ${App.escape(
            station.brand ||
            "Fuel Station"
          )}
          ${
            distance !== null
              ? " • " +
                App.escape(
                  distanceText
                )
              : ""
          }
        </div>

      </div>

    </div>

    <div class="price-grid mt-12">

      <div class="price-box">
        <span>Regular</span>
        <b>
          ${App.money(
            prices.regular
          )}
        </b>
        <span>per L</span>
      </div>

      <div class="price-box">
        <span>Premium</span>
        <b>
          ${App.money(
            prices.premium
          )}
        </b>
        <span>per L</span>
      </div>

      <div class="price-box">
        <span>Diesel</span>
        <b>
          ${App.money(
            prices.diesel
          )}
        </b>
        <span>per L</span>
      </div>

    </div>

    <div class="notice mt-12">
      Prototype fuel prices are estimates for the GasGo demo.
    </div>

    <div class="button-row mt-12">

      <button
        class="secondary"
        onclick="GasGoApp.runCanIMakeIt()"
      >
        CAN I MAKE IT?
      </button>

      <button
        class="primary"
        onclick="GasGoApp.openDirections()"
      >
        DIRECTIONS
      </button>

    </div>

    <button
      class="secondary full-button mt-8"
      onclick="GasGoApp.openFuelLogModal()"
    >
      + LOG FILL-UP
    </button>
  `;

};


/* =========================================================
   LOCATION
   ========================================================= */

App.requestLocation = function () {

  if (
    !navigator.geolocation
  ) {

    App.toast(
      "Location is not supported on this device.",
      "error"
    );

    return;

  }


  App.toast(
    "Requesting your location…"
  );


  navigator.geolocation.getCurrentPosition(

    position => {

      App.state.userLocation = {
        lat:
          position.coords.latitude,

        lon:
          position.coords.longitude
      };


      App.state.location =
        App.state.userLocation;


      App.updateUserMarker();

      App.applyStationFilters();

      App.updateSmartStop();

      App.renderPlanMyStop();


      App.toast(
        "Location updated 📍",
        "success"
      );

    },

    error => {

      console.warn(
        "GasGo location error:",
        error
      );


      App.toast(
        "Location permission was not available.",
        "error"
      );

    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    }

  );

};


App.updateUserMarker = function () {

  if (
    !App.state.map ||
    !App.state.userLocation ||
    typeof L === "undefined"
  ) {
    return;
  }


  const lat =
    App.state.userLocation.lat;

  const lon =
    App.state.userLocation.lon;


  if (
    App.state.userMarker
  ) {

    App.state.userMarker.setLatLng(
      [lat, lon]
    );

  } else {

    App.state.userMarker =
      L.circleMarker(
        [lat, lon],
        {
          radius: 8,
          weight: 4,
          fillOpacity: 1
        }
      )
      .bindTooltip(
        "YOU",
        {
          permanent: false
        }
      )
      .addTo(
        App.state.map
      );

  }


  App.state.map.setView(
    [lat, lon],
    Math.max(
      App.state.map.getZoom(),
      12
    )
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
      "Select a location first.",
      "error"
    );

    return;

  }


  let url = "";


  if (
    window.GasGoData &&
    typeof GasGoData.getGoogleMapsURL ===
      "function"
  ) {

    url =
      GasGoData.getGoogleMapsURL(
        station
      );

  }


  if (!url) {

    url =
      "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent(
        station.lat +
        "," +
        station.lon
      );

  }


  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

};


/* =========================================================
   CAN I MAKE IT?
   ========================================================= */

App.runCanIMakeIt = function () {

  const station =
    App.state.selectedStation;


  if (!station) {

    App.toast(
      "Select a station or charger first.",
      "error"
    );

    return;

  }


  App.renderCanIMakeIt(
    station
  );

};


App.renderCanIMakeIt = function (
  station
) {

  const container =
    App.$(
      "rangeResult"
    );


  if (!container) {

    const distance =
      App.getStationDistance(
        station
      );


    if (
      distance === null
    ) {

      App.toast(
        "Share your location to estimate whether you can reach this stop."
      );

      App.requestLocation();

      return;

    }


    const range =
      App.getVehicleRange();


    const safe =
      range >=
      distance * 1.25;


    App.toast(
      safe
        ? "Estimated range looks sufficient."
        : "Your estimated range may be too low for this stop.",
      safe
        ? "success"
        : "error"
    );


    return;

  }


  if (
    !App.state.userLocation
  ) {

    container.innerHTML = `
      <div class="range-result warning">
        <strong>Location required</strong>
        Share your location so GasGo can compare
        your estimated range with the distance
        to this stop.
      </div>
    `;


    App.requestLocation();

    return;

  }


  let result = null;


  if (
    window.GasGoData &&
    typeof GasGoData.canIMakeIt ===
      "function"
  ) {

    result =
      GasGoData.canIMakeIt(
        station,
        App.state.userLocation,
        App.state.vehicle
      );

  }


  const distance =
    result?.distance ??
    App.getStationDistance(
      station
    );


  const range =
    result?.range ??
    App.getVehicleRange();


  let status =
    result?.status;


  if (!status) {

    if (
      range >=
      distance * 1.25
    ) {

      status = "safe";

    } else if (
      range >= distance
    ) {

      status = "warning";

    } else {

      status = "danger";

    }

  }


  const remaining =
    Math.max(
      0,
      Number(range) -
      Number(distance)
    );


  let title = "";
  let message = "";
  let icon = "";


  if (
    status === "safe"
  ) {

    title =
      "You can make it";

    message =
      "Your estimated range provides a safety reserve for this trip.";

    icon = "✓";

  } else if (
    status === "warning"
  ) {

    title =
      "Low range";

    message =
      "You may reach this stop, but your estimated safety reserve is low.";

    icon = "!";

  } else {

    title =
      "Choose a closer stop";

    message =
      "Your estimated range is below the distance to this location.";

    icon = "⚠";

  }


  container.innerHTML = `
    <div class="range-result ${App.escape(status)}">

      <div class="range-result-icon">
        ${icon}
      </div>

      <div>

        <strong>
          ${App.escape(title)}
        </strong>

        <div>
          ${App.escape(message)}
        </div>

        <div class="range-result-grid">

          <div>
            <span>Distance</span>
            <b>
              ${App.escape(
                App.formatDistance(
                  distance
                )
              )}
            </b>
          </div>

          <div>
            <span>Est. range</span>
            <b>
              ${Math.round(range)} mi
            </b>
          </div>

          <div>
            <span>Est. remaining</span>
            <b>
              ${remaining.toFixed(1)} mi
            </b>
          </div>

        </div>

        <div class="muted mt-8">
          GasGo range is an estimate and is not a guarantee.
          Driving conditions, vehicle condition, speed,
          weather and other factors can affect actual range.
        </div>

      </div>

    </div>
  `;

};


/* =========================================================
   SMART STOP
   ========================================================= */

App.updateSmartStop = function () {

  if (
    !App.state.stations.length ||
    !window.GasGoData
  ) {

    App.state.smartStop =
      null;

    App.renderSmartStop();

    return;

  }


  let result = null;


  if (
    typeof GasGoData.getSmartStop ===
      "function"
  ) {

    result =
      GasGoData.getSmartStop(
        App.state.stations,
        App.state.userLocation,
        App.state.vehicle,
        App.state.selectedFuel
      );

  }


  if (
    result?.station
  ) {

    App.state.smartStop =
      result;

  } else {

    let compatible =
      App.state.stations.filter(
        station => {

          const mode =
            App.getVehicleEnergyMode();


          if (
            mode === "ev"
          ) {

            return (
              station.type ===
              "ev"
            );

          }


          if (
            mode === "both"
          ) {

            return true;

          }


          return (
            station.type ===
            "fuel"
          );

        }
      );


    if (
      App.state.userLocation &&
      typeof GasGoData.sortClosest ===
        "function"
    ) {

      compatible =
        GasGoData.sortClosest(
          compatible,
          App.state.userLocation
        );

    }


    App.state.smartStop =
      compatible[0]
        ? {
            station:
              compatible[0]
          }
        : null;

  }


  App.renderSmartStop();

};


/* =========================================================
   SMART STOP CARD
   ========================================================= */

App.renderSmartStop = function () {

  const card =
    App.$(
      "smartStopCard"
    );


  if (!card) {
    return;
  }


  const station =
    App.state.smartStop?.station;


  if (!station) {

    card.innerHTML = `
      <div class="muted">
        Loading your recommended stop…
      </div>
    `;

    return;

  }


  const distance =
    App.formatDistance(
      App.getStationDistance(
        station
      )
    );


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
            ⚡ ${App.escape(station.name)}
          </div>

          <div class="smart-stop-subtitle">
            ${App.escape(
              station.brand ||
              "EV Charging"
            )}
          </div>

        </div>

      </div>

      <div class="smart-stop-grid">

        <div class="smart-stat">
          <span>Distance</span>
          <strong>
            ${App.escape(distance)}
          </strong>
        </div>

        <div class="smart-stat">
          <span>Est. range</span>
          <strong>
            ${Math.round(
              App.getVehicleRange()
            )} mi
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
    (
      typeof GasGoData.getStationPrices ===
        "function"
        ? GasGoData.getStationPrices(
            station
          )
        : {}
    );


  const price =
    prices[
      App.state.selectedFuel
    ];


  card.innerHTML = `
    <div class="smart-stop-header">

      <div>

        <div class="eyebrow">
          GASGO SMART STOP
        </div>

        <div class="smart-stop-title">
          ${App.escape(station.name)}
        </div>

        <div class="smart-stop-subtitle">
          ${App.escape(
            station.brand ||
            "Fuel Station"
          )}
        </div>

      </div>

      <div class="smart-stop-price">
        ${App.money(price)}
        <small>/L</small>
      </div>

    </div>

    <div class="smart-stop-grid">

      <div class="smart-stat">
        <span>Distance</span>
        <strong>
          ${App.escape(distance)}
        </strong>
      </div>

      <div class="smart-stat">
        <span>Est. range</span>
        <strong>
          ${Math.round(
            App.getVehicleRange()
          )} mi
        </strong>
      </div>

      <div class="smart-stat">
        <span>Fuel</span>
        <strong>
          ${App.escape(
            App.state.selectedFuel
          )}
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


  if (
    mode === "ev"
  ) {

    let chargers =
      App.state.stations.filter(
        station =>
          station.type ===
          "ev"
      );


    if (
      App.state.userLocation &&
      typeof GasGoData.sortClosest ===
        "function"
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
            ⚡ ${App.escape(station.name)}
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
          <span>Est. range</span>
          <strong>
            ${Math.round(
              App.getVehicleRange()
            )} mi
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
          <span>Price</span>
          <strong>
            —
          </strong>
        </div>

      </div>

      <div class="muted mt-8">
        Charging price is not invented when mapped
        data does not provide it.
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


  let fuelStations =
    App.state.stations.filter(
      station =>
        station.type ===
        "fuel"
    );


  if (
    App.state.userLocation &&
    typeof GasGoData.sortBestValue ===
      "function"
  ) {

    fuelStations =
      GasGoData.sortBestValue(
        fuelStations,
        App.state.userLocation,
        App.state.selectedFuel
      );

  } else if (
    typeof GasGoData.sortCheapest ===
      "function"
  ) {

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


  /*
    This value now comes from the vehicle database
    when a verified vehicle/configuration is selected.
  */

  const tank =
    Number(
      vehicle.tankCapacity
    );


  if (
    !Number.isFinite(tank) ||
    tank <= 0
  ) {

    container.innerHTML = `
      <div class="muted">
        Add your vehicle tank capacity to calculate this plan.
      </div>
    `;

    return;

  }


  if (
    !Number.isFinite(price) ||
    price <= 0
  ) {

    container.innerHTML = `
      <div class="muted">
        Fuel price data is unavailable for this stop.
      </div>
    `;

    return;

  }


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

  }


  liters =
    Math.min(
      liters,
      remainingCapacity
    );


  const cost =
    liters * price;


  const newLevel =
    App.clamp(
      level +
      (
        liters /
        tank *
        100
      ),
      0,
      100
    );


  const newRange =
    Number(
      vehicle.fullRange
    ) *
    newLevel /
    100;


  container.innerHTML = `
    <div class="smart-stop-header">

      <div>

        <div class="eyebrow">
          RECOMMENDED FUEL STOP
        </div>

        <div class="smart-stop-title">
          ${App.escape(station.name)}
        </div>

        <div class="smart-stop-subtitle">
          ${App.escape(
            station.brand ||
            "Fuel Station"
          )}
        </div>

      </div>

      <div class="smart-stop-price">
        ${App.money(price)}
        <small>/L</small>
      </div>

    </div>

    <div class="smart-stop-grid mt-12">

      <div class="smart-stat">
        <span>Add</span>
        <strong>
          ${App.number(liters, 1)} L
        </strong>
      </div>

      <div class="smart-stat">
        <span>Est. cost</span>
        <strong>
          ${App.money(cost)}
        </strong>
      </div>

      <div class="smart-stat">
        <span>New level</span>
        <strong>
          ${Math.round(newLevel)}%
        </strong>
      </div>

    </div>

    <div class="muted mt-8">
      Estimated range after adding fuel:
      <strong>
        ${Math.round(newRange)} mi
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


  App.setText(
    "vehicleTitle",
    vehicle.year +
    " " +
    vehicle.make +
    " " +
    vehicle.model
  );


  App.setText(
    "vehicleType",
    vehicle.powertrain
  );


  App.setText(
    "vehicleLevelDisplay",
    Math.round(
      Number(
        vehicle.level
      )
    ) + "%"
  );


  App.setText(
    "vehicleRangeDisplay",
    Math.round(
      App.getVehicleRange()
    ) + " mi"
  );


  App.setText(
    "vehicleFullRangeDisplay",
    Math.round(
      Number(
        vehicle.fullRange
      )
    ) + " mi"
  );


  const capacityLabel =
    App.$(
      "vehicleCapacityLabel"
    );


  if (capacityLabel) {

    capacityLabel.textContent =
      vehicle.powertrain ===
        "Electric"
        ? "Battery capacity"
        : "Tank capacity";

  }


  const capacityDisplay =
    App.$(
      "vehicleTankDisplay"
    );


  if (!capacityDisplay) {
    return;
  }


  if (
    vehicle.powertrain ===
    "Electric"
  ) {

    const battery =
      App.firstFinitePositive(
        vehicle.batteryKWh,
        vehicle.batteryCapacity
      );


    capacityDisplay.textContent =
      battery !== null
        ? App.number(
            battery,
            1
          ) + " kWh"
        : "Not listed";

  } else {

    const tank =
      Number(
        vehicle.tankCapacity
      );


    capacityDisplay.textContent =
      Number.isFinite(tank)
        ? App.number(
            tank,
            1
          ) + " L"
        : "Not set";

  }

};


/* =========================================================
   OPEN VEHICLE MODAL
   ========================================================= */

App.openVehicleModal = function () {

  const modal =
    App.$(
      "vehicleModal"
    );


  const vehicle =
    App.state.vehicle;


  if (
    !modal ||
    !vehicle
  ) {
    return;
  }


  App.populateYearSelect(
    App.$("vehicleYear"),
    vehicle.year
  );


  if (
    App.$("vehicleYear")
  ) {

    App.$("vehicleYear").value =
      String(vehicle.year);

  }


  App.populateMakeSelect(
    App.$("vehicleMake"),
    vehicle.year,
    vehicle.make
  );


  App.populateModelSelect(
    vehicle.year,
    vehicle.make,
    App.$("vehicleModel"),
    vehicle.model
  );


  const configurationSelect =
    App.$(
      "vehicleConfiguration"
    );


  const configurationField =
    App.$(
      "vehicleConfigurationField"
    );


  const configurations =
    App.getVehicleConfigurations(
      vehicle.year,
      vehicle.make,
      vehicle.model
    );


  App.populateConfigurationSelect(
    configurationSelect,
    configurations,
    vehicle.configuration ||
    ""
  );


  if (
    configurationField
  ) {

    configurationField.style.display =
      configurations.length > 1
        ? ""
        : "none";

  }


  if (
    App.$("vehiclePowertrain")
  ) {

    App.$("vehiclePowertrain").value =
      vehicle.powertrain;

  }


  if (
    App.$("vehicleLevel")
  ) {

    App.$("vehicleLevel").value =
      vehicle.level;

  }


  if (
    App.$("vehicleFullRange")
  ) {

    App.$("vehicleFullRange").value =
      vehicle.fullRange;

  }


  if (
    App.$("vehicleTankCapacity") &&
    vehicle.tankCapacity !== null
  ) {

    App.setTankSliderValue(
      App.$("vehicleTankCapacity"),
      vehicle.tankCapacity
    );

  }


  if (
    vehicle.capacitySource ===
    "vehicle-database"
  ) {

    App.setVehicleSpecStatus(
      "vehicle",
      "✓ Saved from vehicle specification database",
      "verified"
    );

  } else {

    App.setVehicleSpecStatus(
      "vehicle",
      "Manual capacity",
      "manual"
    );

  }


  App.updateVehiclePowertrainUI();

  App.updateVehicleSliderLabels();


  modal.classList.add(
    "open"
  );

};


App.closeVehicleModal = function () {

  App.$(
    "vehicleModal"
  )?.classList.remove(
    "open"
  );

};


/* =========================================================
   VEHICLE YEAR
   ========================================================= */

App.updateVehicleYear = function () {

  const year =
    Number(
      App.$(
        "vehicleYear"
      )?.value
    );


  const make =
    App.$(
      "vehicleMake"
    );


  const previousMake =
    make?.value ||
    App.state.vehicle?.make ||
    "";


  App.populateMakeSelect(
    make,
    year,
    previousMake
  );


  App.updateVehicleModels();

};


/* =========================================================
   VEHICLE MODELS
   ========================================================= */

App.updateVehicleModels = function (
  selectedModel = null
) {

  const year =
    Number(
      App.$(
        "vehicleYear"
      )?.value
    );


  const make =
    App.$(
      "vehicleMake"
    );


  const model =
    App.$(
      "vehicleModel"
    );


  if (
    !make ||
    !model
  ) {
    return;
  }


  const modelToPreserve =
    selectedModel ??
    model.value ??
    "";


  App.populateModelSelect(
    year,
    make.value,
    model,
    modelToPreserve
  );


  App.updateVehicleSpec();

};


/* =========================================================
   VEHICLE SPECIFICATION
   ========================================================= */

App.updateVehicleSpec = function (
  selectedConfiguration = null,
  preserveManualValues = false
) {

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


  const select =
    App.$(
      "vehicleConfiguration"
    );


  const field =
    App.$(
      "vehicleConfigurationField"
    );


  /*
    CRITICAL FIX:

    If the function was called because the user changed
    the configuration itself, preserve the current value.
  */

  const currentConfiguration =
    selectedConfiguration ??
    select?.value ??
    "";


  if (
    !year ||
    !make ||
    !model
  ) {

    if (field) {
      field.style.display =
        "none";
    }

    return null;

  }


  const configurations =
    App.getVehicleConfigurations(
      year,
      make,
      model
    );


  if (
    field
  ) {

    field.style.display =
      configurations.length > 1
        ? ""
        : "none";

  }


  App.populateConfigurationSelect(
    select,
    configurations,
    currentConfiguration
  );


  if (
    configurations.length > 1 &&
    !select?.value
  ) {

    App.setVehicleSpecStatus(
      "vehicle",
      "Select the correct configuration to detect tank capacity.",
      "select"
    );

    return {
      found: true,
      exact: false,
      requiresConfiguration: true
    };

  }


  return (
    App.applyVehicleSpecification(
      preserveManualValues
    )
  );

};


/* =========================================================
   APPLY VEHICLE SPECIFICATION
   ========================================================= */

App.applyVehicleSpecification =
function (
  preserveManualValues = false
) {

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


  const configuration =
    App.$(
      "vehicleConfiguration"
    )?.value || "";


  const result =
    App.lookupVehicleSpecification({
      year,
      make,
      model,
      configuration
    });


  if (
    result.requiresConfiguration
  ) {

    App.setVehicleSpecStatus(
      "vehicle",
      "Select the correct configuration to detect tank capacity.",
      "select"
    );

    return result;

  }


  if (!result.found) {

    if (!preserveManualValues) {

      App.setVehicleSpecStatus(
        "vehicle",
        "Exact specification unavailable • adjust capacity manually.",
        "manual"
      );

    }


    return result;

  }


  const powertrain =
    App.normalizePowertrain(
      result.powertrain
    );


  const powertrainSelect =
    App.$(
      "vehiclePowertrain"
    );


  if (powertrainSelect) {

    const exists =
      Array.from(
        powertrainSelect.options
      ).some(
        option =>
          option.value ===
          powertrain
      );


    if (exists) {

      powertrainSelect.value =
        powertrain;

    }

  }


  const tank =
    App.firstFinitePositive(
      result.tankLiters,
      result.tankCapacity
    );


  if (
    powertrain !== "Electric" &&
    tank !== null
  ) {

    App.setTankSliderValue(
      App.$(
        "vehicleTankCapacity"
      ),
      tank
    );


    App.setVehicleSpecStatus(
      "vehicle",
      "✓ Vehicle specification detected • " +
      App.number(
        tank,
        1
      ) +
      " L",
      "verified"
    );

  } else if (
    powertrain === "Electric"
  ) {

    const battery =
      App.firstFinitePositive(
        result.batteryKWh,
        result.batteryCapacity
      );


    App.setVehicleSpecStatus(
      "vehicle",
      battery !== null
        ? "✓ Electric vehicle detected • " +
          App.number(
            battery,
            1
          ) +
          " kWh"
        : "✓ Electric vehicle detected.",
      "verified"
    );

  } else {

    App.setVehicleSpecStatus(
      "vehicle",
      "Vehicle detected, but tank capacity is unavailable • adjust manually.",
      "manual"
    );

  }


  App.updateVehiclePowertrainUI();

  App.updateVehicleSliderLabels();


  return result;

};


/* =========================================================
   VEHICLE POWERTRAIN UI
   ========================================================= */

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
        powertrain ===
          "Plug-in Hybrid"
          ? "Current fuel / energy estimate"
          : "Current fuel percentage";

    }

  }

};


/* =========================================================
   VEHICLE SLIDER LABELS
   ========================================================= */

App.updateVehicleSliderLabels =
function () {

  const level =
    App.$(
      "vehicleLevel"
    );


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
      range.value + " mi";

  }


  const tank =
    App.$(
      "vehicleTankCapacity"
    );


  const tankValue =
    App.$(
      "vehicleTankCapacityValue"
    ) ||
    App.$(
      "vehicleTankValue"
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
   MANUAL VEHICLE TANK
   ========================================================= */

App.onVehicleTankManualInput =
function () {

  App.updateVehicleSliderLabels();


  const tank =
    Number(
      App.$(
        "vehicleTankCapacity"
      )?.value
    );


  if (
    Number.isFinite(tank)
  ) {

    App.setVehicleSpecStatus(
      "vehicle",
      "Manual capacity • " +
      App.number(
        tank,
        1
      ) +
      " L",
      "manual"
    );

  }

};


/*
  Compatibility aliases for the inline handlers already
  used by the V5 index.html.
*/

App.markOnboardingTankManual =
function () {

  App.onOnboardingTankManualInput();

};


App.markVehicleTankManual =
function () {

  App.onVehicleTankManualInput();

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


  const configuration =
    App.$(
      "vehicleConfiguration"
    )?.value || "";


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


  const manualTank =
    Number(
      App.$(
        "vehicleTankCapacity"
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


  const configurations =
    App.getVehicleConfigurations(
      year,
      make,
      model
    );


  if (
    configurations.length > 1 &&
    !configuration
  ) {

    App.toast(
      "Choose your vehicle configuration.",
      "error"
    );

    return;

  }


  const specification =
    App.lookupVehicleSpecification({
      year,
      make,
      model,
      configuration
    });


  const detectedTank =
    App.firstFinitePositive(
      specification.tankLiters,
      specification.tankCapacity
    );


  const battery =
    App.firstFinitePositive(
      specification.batteryKWh,
      specification.batteryCapacity
    );


  let finalTank = null;


  if (
    powertrain !== "Electric"
  ) {

    if (
      detectedTank !== null
    ) {

      finalTank =
        detectedTank;

    } else if (
      Number.isFinite(
        manualTank
      ) &&
      manualTank > 0
    ) {

      finalTank =
        manualTank;

    }

  }


  App.state.vehicle = {

    year,

    make,

    model,

    configuration,

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
      finalTank === null
        ? null
        : Number(
            finalTank.toFixed(1)
          ),

    batteryCapacity:
      battery,

    batteryKWh:
      battery,

    capacitySource:
      specification.found &&
      (
        detectedTank !== null ||
        battery !== null
      )
        ? "vehicle-database"
        : "manual"

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
    specification.found &&
    detectedTank !== null
      ? "Vehicle saved • tank detected automatically."
      : "Vehicle saved.",
    "success"
  );

};


/* =========================================================
   REFRESH VEHICLE UI
   ========================================================= */

App.refreshVehicleUI = function () {

  App.renderHomeVehicle();

  App.renderVehicle();

  App.renderStationSheet();

  App.updateSmartStop();

  App.renderPlanMyStop();

};


/* =========================================================
   FUEL LOG CALCULATIONS
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


  const newLevel =
    App.clamp(
      oldLevel +
      (
        added /
        tank *
        100
      ),
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
    App.state.vehicle?.powertrain ===
    "Electric"
  ) {

    App.toast(
      "Your selected vehicle is electric.",
      "error"
    );

    return;

  }


  if (
    App.state.selectedStation?.type ===
    "ev"
  ) {

    App.toast(
      "Select a fuel station to log a fill-up.",
      "error"
    );

    return;

  }


  const modal =
    App.$(
      "fuelLogModal"
    );


  if (!modal) {
    return;
  }


  const date =
    App.$(
      "logDate"
    );


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
      App.state.selectedStation;


    if (
      App.$("logStation")
    ) {

      App.$("logStation").value =
        station.name;

    }


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


    if (
      App.$("logPrice") &&
      Number.isFinite(price)
    ) {

      App.$("logPrice").value =
        price.toFixed(2);

    }

  }


  App.updateFuelLogPreview();


  modal.classList.add(
    "open"
  );

};


App.closeFuelLogModal =
function () {

  App.$(
    "fuelLogModal"
  )?.classList.remove(
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
    (
      Number.isFinite(liters) &&
      Number.isFinite(price)
    )
      ? liters * price
      : 0;


  App.setText(
    "logCalculatedTotal",
    App.money(total)
  );


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
    App.$(
      "logDate"
    )?.value;


  const station =
    String(
      App.$(
        "logStation"
      )?.value || ""
    ).trim();


  const fuel =
    App.$(
      "logFuel"
    )?.value ||
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


  App.state.fuelLogs.unshift({

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
      level?.oldLevel ??
      null,

    vehicleLevelAfter:
      level?.newLevel ??
      null

  });


  App.saveStorage(
    App.STORAGE.fuelLogs,
    App.state.fuelLogs
  );


  if (level) {

    App.state.vehicle.level =
      Number(
        level.newLevel.toFixed(
          1
        )
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

};


/* =========================================================
   DASHBOARD
   ========================================================= */

App.renderDashboard = function () {

  const logs =
    App.state.fuelLogs;


  const spent =
    logs.reduce(
      (sum, log) =>
        sum +
        Number(
          log.total || 0
        ),
      0
    );


  const liters =
    logs.reduce(
      (sum, log) =>
        sum +
        Number(
          log.liters || 0
        ),
      0
    );


  const average =
    liters > 0
      ? spent / liters
      : 0;


  App.setText(
    "dashSpent",
    App.money(spent)
  );


  App.setText(
    "dashLiters",
    App.number(
      liters,
      1
    ) + " L"
  );


  App.setText(
    "dashSavings",
    "$0.00"
  );


  App.setText(
    "dashFillUps",
    String(logs.length)
  );


  App.setText(
    "dashAveragePrice",
    average > 0
      ? App.money(
          average
        ) + "/L"
      : "—"
  );


  App.renderFuelLogs();

  App.renderSpendingChart();

};


/* =========================================================
   FUEL LOG LIST
   ========================================================= */

App.renderFuelLogs = function () {

  const container =
    App.$(
      "fuelLogList"
    );


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
              ${App.escape(log.station)}
            </div>

            <div class="log-meta">
              ${App.escape(log.date)}
              •
              ${App.number(log.liters, 1)} L
              •
              ${App.money(log.price)}/L
            </div>

          </div>

          <div>

            <div class="log-total">
              ${App.money(log.total)}
            </div>

            <button
              class="section-link"
              onclick="GasGoApp.deleteFuelLog('${App.escape(log.id)}')"
            >
              Remove
            </button>

          </div>

        </div>
      `)
      .join("");

};


/* =========================================================
   SPENDING CHART
   ========================================================= */

App.renderSpendingChart = function () {

  const container =
    App.$(
      "spendingChart"
    );


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
    App.$(
      "rewardsList"
    );


  if (!container) {
    return;
  }


  const total =
    Object.values(
      App.state.rewards
    ).reduce(
      (sum, reward) =>
        sum +
        Number(
          reward.points || 0
        ),
      0
    );


  App.setText(
    "totalRewardPoints",
    total.toLocaleString()
  );


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
                ${App.escape(brand)}
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
      `
    )
    .join("");

};


/* =========================================================
   PRICE REFERENCE
   ========================================================= */

App.renderPriceReference = function () {

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

              <span>Regular</span>

              <b>
                ${App.money(
                  prices.regular
                )}
              </b>

              <span>per L</span>

            </div>

            <div class="price-box">

              <span>Premium</span>

              <b>
                ${App.money(
                  prices.premium
                )}
              </b>

              <span>per L</span>

            </div>

            <div class="price-box">

              <span>Diesel</span>

              <b>
                ${App.money(
                  prices.diesel
                )}
              </b>

              <span>per L</span>

            </div>

          </div>

        </div>
      `
    )
    .join("");

};


/* =========================================================
   RESET GASGO
   ========================================================= */

App.resetApp = function () {

  const confirmed =
    window.confirm(
      "Reset GasGo? This will remove your saved vehicle, fuel logs, rewards progress and app setup from this device."
    );


  if (!confirmed) {
    return;
  }


  Object.values(
    App.STORAGE
  ).forEach(key => {

    try {
      localStorage.removeItem(
        key
      );
    } catch (error) {
      console.warn(
        "GasGo reset storage error:",
        error
      );
    }

  });


  App.state.vehicle = {
    ...App.DEFAULT_VEHICLE
  };


  App.state.rewards =
    JSON.parse(
      JSON.stringify(
        App.DEFAULT_REWARDS
      )
    );


  App.state.fuelLogs = [];

  App.state.favorites = [];

  App.state.selectedStation =
    null;

  App.state.smartStop =
    null;

  App.state.planStation =
    null;


  App.renderHomeVehicle();

  App.renderVehicle();

  App.renderRewards();

  App.renderDashboard();

  App.renderStationSheet();

  App.updateSmartStop();

  App.renderPlanMyStop();


  App.toast(
    "GasGo reset complete.",
    "success"
  );


  setTimeout(() => {

    App.showScreen(
      "home"
    );

    App.showOnboarding();

  }, 250);

};


/* =========================================================
   NAVIGATION ALIASES
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
   COMPATIBILITY ALIASES
   ========================================================= */

/*
  These keep older V5 HTML onclick handlers working.
*/

App.navTo = function (
  screen
) {
  App.showScreen(screen);
};


App.changeScreen = function (
  screen
) {
  App.showScreen(screen);
};


App.openMap = function () {
  App.showScreen("stations");
};


App.locateMe = function () {
  App.requestLocation();
};


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

App.setupListeners = function () {

  const search =
    App.$(
      "stationSearch"
    );


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


  /*
    Vehicle onboarding listeners.

    Some of these also exist inline in index.html.
    The functions are idempotent and preserve the
    configuration selection.
  */

  const onboardingYear =
    App.$(
      "onboardingYear"
    );


  if (onboardingYear) {

    onboardingYear.addEventListener(
      "change",
      App.updateOnboardingYear
    );

  }


  const onboardingMake =
    App.$(
      "onboardingMake"
    );


  if (onboardingMake) {

    onboardingMake.addEventListener(
      "change",
      App.updateOnboardingModels
    );

  }


  const onboardingModel =
    App.$(
      "onboardingModel"
    );


  if (onboardingModel) {

    onboardingModel.addEventListener(
      "change",
      App.updateOnboardingVehicleSpec
    );

  }


  const onboardingConfiguration =
    App.$(
      "onboardingConfiguration"
    );


  if (onboardingConfiguration) {

    onboardingConfiguration.addEventListener(
      "change",
      App.updateOnboardingVehicleSpec
    );

  }


  const onboardingPowertrain =
    App.$(
      "onboardingPowertrain"
    );


  if (onboardingPowertrain) {

    onboardingPowertrain.addEventListener(
      "change",
      App.updateOnboardingPowertrain
    );

  }


  /*
    Vehicle modal listeners.
  */

  const vehicleYear =
    App.$(
      "vehicleYear"
    );


  if (vehicleYear) {

    vehicleYear.addEventListener(
      "change",
      App.updateVehicleYear
    );

  }


  const vehicleMake =
    App.$(
      "vehicleMake"
    );


  if (vehicleMake) {

    vehicleMake.addEventListener(
      "change",
      () =>
        App.updateVehicleModels()
    );

  }


  const vehicleModel =
    App.$(
      "vehicleModel"
    );


  if (vehicleModel) {

    vehicleModel.addEventListener(
      "change",
      () =>
        App.updateVehicleSpec()
    );

  }


  const vehicleConfiguration =
    App.$(
      "vehicleConfiguration"
    );


  if (vehicleConfiguration) {

    vehicleConfiguration.addEventListener(
      "change",
      () =>
        App.updateVehicleSpec()
    );

  }


  const vehiclePowertrain =
    App.$(
      "vehiclePowertrain"
    );


  if (vehiclePowertrain) {

    vehiclePowertrain.addEventListener(
      "change",
      App.updateVehiclePowertrainUI
    );

  }


  /*
    Sliders
  */

  [
    "onboardingLevel",
    "onboardingRange"
  ].forEach(id => {

    App.$(id)?.addEventListener(
      "input",
      App.updateOnboardingSliderLabels
    );

  });


  App.$(
    "onboardingTank"
  )?.addEventListener(
    "input",
    App.onOnboardingTankManualInput
  );


  [
    "vehicleLevel",
    "vehicleFullRange"
  ].forEach(id => {

    App.$(id)?.addEventListener(
      "input",
      App.updateVehicleSliderLabels
    );

  });


  App.$(
    "vehicleTankCapacity"
  )?.addEventListener(
    "input",
    App.onVehicleTankManualInput
  );


  /*
    Fuel log
  */

  [
    "logLiters",
    "logPrice"
  ].forEach(id => {

    App.$(id)?.addEventListener(
      "input",
      App.updateFuelLogPreview
    );

  });


  /*
    Escape closes modals.
  */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Escape"
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


  if (
    !window.GasGoVehicles
  ) {

    console.warn(
      "vehicles.js was not found. GasGo will use the fallback vehicle catalog."
    );

  }


  App.loadLocalData();

  App.setupListeners();

  App.renderHomeVehicle();

  App.renderVehicle();

  App.renderRewards();

  App.renderDashboard();

  App.renderPriceReference();

  App.syncEnergyFilterToVehicle();

  App.showScreen(
    "home"
  );

  App.loadStations();


  if (
    App.shouldShowOnboarding()
  ) {

    setTimeout(() => {

      App.showOnboarding();

    }, 250);

  }


  console.log(
    "GasGo ready 🚗⛽⚡ • app.js v" +
    App.VERSION
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
