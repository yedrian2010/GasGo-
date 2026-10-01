"use strict";

/* =========================================================
   GASGO VEHICLE DATABASE
   Version 4.2.0

   PURPOSE
   ---------------------------------------------------------
   - Large selectable vehicle catalog
   - Verified vehicle configurations
   - Automatic fuel-tank capacity when verified
   - Manual fallback when a specification is unavailable
   - Gasoline / Hybrid / PHEV / EV support
   - Compatible with GasGo App v5.5.x

   IMPORTANT
   ---------------------------------------------------------
   A model appearing in CATALOG does NOT mean GasGo has a
   verified tank/battery specification for every model year.

   When an exact configuration is unavailable, GasGo should
   allow manual entry instead of guessing.
   ========================================================= */

window.GasGoVehicles = window.GasGoVehicles || {};

const Vehicles = window.GasGoVehicles;

Vehicles.VERSION = "4.2.0";


/* =========================================================
   HELPERS
   ========================================================= */

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function gallonsToLiters(gallons) {
  const value = Number(gallons);

  if (!Number.isFinite(value)) {
    return null;
  }

  return Number((value * 3.785411784).toFixed(1));
}

function litersToGallons(liters) {
  const value = Number(liters);

  if (!Number.isFinite(value)) {
    return null;
  }

  return Number((value / 3.785411784).toFixed(2));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function alphabetical(values) {
  return [...values].sort((a, b) =>
    String(a).localeCompare(String(b))
  );
}

function yearMatches(vehicleYear, requestedYear) {
  if (requestedYear === null || requestedYear === undefined || requestedYear === "") {
    return true;
  }

  return Number(vehicleYear) === Number(requestedYear);
}

function createVehicle({
  year,
  make,
  model,
  trim = "",
  engine = "",
  drivetrain = "",
  transmission = "",
  powertrain = "Gasoline",
  tankGallons = null,
  tankLiters = null,
  batteryKWh = null,
  electricRangeMiles = null,
  source = "",
  verified = false,
  notes = ""
}) {

  let liters = tankLiters;
  let gallons = tankGallons;

  if (liters == null && gallons != null) {
    liters = gallonsToLiters(gallons);
  }

  if (gallons == null && liters != null) {
    gallons = litersToGallons(liters);
  }

  return {
    year: Number(year),
    make,
    model,
    trim,
    engine,
    drivetrain,
    transmission,
    powertrain,

    tankGallons:
      gallons == null
        ? null
        : Number(Number(gallons).toFixed(2)),

    tankLiters:
      liters == null
        ? null
        : Number(Number(liters).toFixed(1)),

    batteryKWh:
      batteryKWh == null
        ? null
        : Number(batteryKWh),

    electricRangeMiles:
      electricRangeMiles == null
        ? null
        : Number(electricRangeMiles),

    source,
    verified: Boolean(verified),
    notes
  };
}


/* =========================================================
   VERIFIED VEHICLE DATABASE
   ========================================================= */

Vehicles.DATABASE = [

  /* =======================================================
     CHEVROLET
     ======================================================= */

  createVehicle({
    year: 2015,
    make: "Chevrolet",
    model: "Sonic",
    trim: "1.4L Turbo",
    engine: "1.4L Turbo",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankLiters: 46,
    source: "Chevrolet",
    verified: true
  }),

  createVehicle({
    year: 2015,
    make: "Chevrolet",
    model: "Sonic",
    trim: "1.8L",
    engine: "1.8L",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankLiters: 46,
    source: "Chevrolet",
    verified: true
  }),

  createVehicle({
    year: 2020,
    make: "Chevrolet",
    model: "Sonic",
    trim: "1.4L Turbo",
    engine: "1.4L Turbo",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankGallons: 12.1,
    source: "Chevrolet",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Chevrolet",
    model: "Equinox",
    trim: "FWD",
    engine: "1.5L Turbo",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankGallons: 14.8,
    tankLiters: 56,
    source: "Chevrolet",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Chevrolet",
    model: "Equinox",
    trim: "AWD",
    engine: "1.5L Turbo",
    drivetrain: "AWD",
    powertrain: "Gasoline",
    tankGallons: 15.6,
    tankLiters: 59,
    source: "Chevrolet",
    verified: true
  }),


  /* =======================================================
     TOYOTA COROLLA
     ======================================================= */

  createVehicle({
    year: 2023,
    make: "Toyota",
    model: "Corolla",
    trim: "LE",
    engine: "2.0L",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankGallons: 13.2,
    source: "Toyota",
    verified: true
  }),

  createVehicle({
    year: 2023,
    make: "Toyota",
    model: "Corolla",
    trim: "SE",
    engine: "2.0L",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankGallons: 13.2,
    source: "Toyota",
    verified: true
  }),

  createVehicle({
    year: 2023,
    make: "Toyota",
    model: "Corolla",
    trim: "XSE",
    engine: "2.0L",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankGallons: 13.2,
    source: "Toyota",
    verified: true
  }),

  createVehicle({
    year: 2023,
    make: "Toyota",
    model: "Corolla",
    trim: "Hybrid LE",
    drivetrain: "FWD",
    powertrain: "Hybrid",
    tankGallons: 11.3,
    source: "Toyota",
    verified: true
  }),

  createVehicle({
    year: 2023,
    make: "Toyota",
    model: "Corolla",
    trim: "Hybrid SE",
    drivetrain: "FWD/AWD",
    powertrain: "Hybrid",
    tankGallons: 11.3,
    source: "Toyota",
    verified: true
  }),

  createVehicle({
    year: 2023,
    make: "Toyota",
    model: "Corolla",
    trim: "Hybrid XLE",
    drivetrain: "FWD",
    powertrain: "Hybrid",
    tankGallons: 11.3,
    source: "Toyota",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Toyota",
    model: "Corolla",
    trim: "Gasoline",
    engine: "2.0L",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankGallons: 13.2,
    source: "Toyota",
    verified: true
  }),


  /* =======================================================
     TOYOTA COROLLA CROSS
     ======================================================= */

  createVehicle({
    year: 2025,
    make: "Toyota",
    model: "Corolla Cross",
    trim: "2WD",
    engine: "2.0L",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankGallons: 12.4,
    tankLiters: 47,
    source: "Toyota",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Toyota",
    model: "Corolla Cross",
    trim: "AWD",
    engine: "2.0L",
    drivetrain: "AWD",
    powertrain: "Gasoline",
    tankGallons: 13.2,
    tankLiters: 50,
    source: "Toyota",
    verified: true
  }),


  /* =======================================================
     HONDA CIVIC
     ======================================================= */

  createVehicle({
    year: 2024,
    make: "Honda",
    model: "Civic",
    trim: "Sedan Gasoline",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankGallons: 12.39,
    source: "Honda",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Honda",
    model: "Civic",
    trim: "Sedan LX",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankGallons: 12.4,
    source: "Honda",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Honda",
    model: "Civic",
    trim: "Sedan Sport",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankGallons: 12.4,
    source: "Honda",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Honda",
    model: "Civic",
    trim: "Sedan Sport Hybrid",
    drivetrain: "FWD",
    powertrain: "Hybrid",
    tankGallons: 10.6,
    source: "Honda",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Honda",
    model: "Civic",
    trim: "Sedan Sport Touring Hybrid",
    drivetrain: "FWD",
    powertrain: "Hybrid",
    tankGallons: 10.6,
    source: "Honda",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Honda",
    model: "Civic",
    trim: "Hatchback Sport",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankGallons: 12.4,
    source: "Honda",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Honda",
    model: "Civic",
    trim: "Hatchback Sport Hybrid",
    drivetrain: "FWD",
    powertrain: "Hybrid",
    tankGallons: 10.6,
    source: "Honda",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Honda",
    model: "Civic",
    trim: "Hatchback Sport Touring Hybrid",
    drivetrain: "FWD",
    powertrain: "Hybrid",
    tankGallons: 10.6,
    source: "Honda",
    verified: true
  }),


  /* =======================================================
     HYUNDAI ELANTRA
     ======================================================= */

  createVehicle({
    year: 2025,
    make: "Hyundai",
    model: "Elantra",
    trim: "Gasoline",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankGallons: 12.4,
    source: "Hyundai",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Hyundai",
    model: "Elantra",
    trim: "N Line",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankGallons: 12.4,
    source: "Hyundai",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Hyundai",
    model: "Elantra",
    trim: "Hybrid",
    drivetrain: "FWD",
    powertrain: "Hybrid",
    tankGallons: 11.0,
    source: "Hyundai",
    verified: true
  }),


  /* =======================================================
     FORD ESCAPE
     ======================================================= */

  createVehicle({
    year: 2025,
    make: "Ford",
    model: "Escape",
    trim: "1.5L FWD",
    engine: "1.5L EcoBoost",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankGallons: 14.8,
    source: "Ford",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Ford",
    model: "Escape",
    trim: "1.5L AWD",
    engine: "1.5L EcoBoost",
    drivetrain: "AWD",
    powertrain: "Gasoline",
    tankGallons: 15.7,
    source: "Ford",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Ford",
    model: "Escape",
    trim: "Hybrid",
    drivetrain: "FWD/AWD",
    powertrain: "Hybrid",
    tankGallons: 14.3,
    source: "Ford",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Ford",
    model: "Escape",
    trim: "Plug-In Hybrid",
    drivetrain: "FWD",
    powertrain: "PHEV",
    tankGallons: 11.1,
    source: "Ford",
    verified: true
  }),


  /* =======================================================
     NISSAN SENTRA
     ======================================================= */

  createVehicle({
    year: 2025,
    make: "Nissan",
    model: "Sentra",
    trim: "Gasoline",
    engine: "2.0L",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankGallons: 12.4,
    source: "Nissan",
    verified: true
  }),


  /* =======================================================
     MAZDA MAZDA3
     ======================================================= */

  createVehicle({
    year: 2025,
    make: "Mazda",
    model: "Mazda3",
    trim: "FWD",
    drivetrain: "FWD",
    powertrain: "Gasoline",
    tankLiters: 50,
    tankGallons: 13.2,
    source: "Mazda",
    verified: true
  }),

  createVehicle({
    year: 2025,
    make: "Mazda",
    model: "Mazda3",
    trim: "AWD",
    drivetrain: "AWD",
    powertrain: "Gasoline",
    tankLiters: 48,
    tankGallons: 12.7,
    source: "Mazda",
    verified: true
  }),


  /* =======================================================
     SUBARU CROSSTREK
     ======================================================= */

  createVehicle({
    year: 2025,
    make: "Subaru",
    model: "Crosstrek",
    trim: "AWD",
    drivetrain: "AWD",
    powertrain: "Gasoline",
    tankGallons: 16.6,
    source: "Subaru",
    verified: true
  })

];


/* =========================================================
   MASTER VEHICLE CATALOG

   This controls which makes/models appear in GasGo.

   IMPORTANT:
   This is intentionally broader than DATABASE.
   A vehicle can appear here without an automatic tank value.
   ========================================================= */

Vehicles.CATALOG = {

  Toyota: [
    "4Runner",
    "86",
    "Avalon",
    "bZ",
    "bZ4X",
    "Camry",
    "C-HR",
    "Corolla",
    "Corolla Cross",
    "Corolla Hatchback",
    "Crown",
    "Crown Signia",
    "GR86",
    "GR Corolla",
    "GR Supra",
    "Grand Highlander",
    "Highlander",
    "Land Cruiser",
    "Mirai",
    "Prius",
    "Prius Prime",
    "RAV4",
    "RAV4 Hybrid",
    "RAV4 Prime",
    "Sequoia",
    "Sienna",
    "Tacoma",
    "Tundra",
    "Venza",
    "Yaris",
    "Other"
  ],

  Honda: [
    "Accord",
    "Civic",
    "Clarity",
    "CR-V",
    "CR-Z",
    "Element",
    "Fit",
    "HR-V",
    "Insight",
    "Odyssey",
    "Passport",
    "Pilot",
    "Prelude",
    "Prologue",
    "Ridgeline",
    "S2000",
    "Other"
  ],

  Chevrolet: [
    "Avalanche",
    "Aveo",
    "Blazer",
    "Blazer EV",
    "Bolt EV",
    "Bolt EUV",
    "Camaro",
    "Captiva",
    "Cobalt",
    "Colorado",
    "Corvette",
    "Cruze",
    "Equinox",
    "Equinox EV",
    "HHR",
    "Impala",
    "Malibu",
    "Silverado",
    "Silverado 1500",
    "Silverado 2500HD",
    "Silverado 3500HD",
    "Silverado EV",
    "Sonic",
    "Spark",
    "Suburban",
    "Tahoe",
    "Trailblazer",
    "Traverse",
    "Trax",
    "Volt",
    "Other"
  ],

  Hyundai: [
    "Accent",
    "Azera",
    "Elantra",
    "Elantra GT",
    "Elantra N",
    "Equus",
    "Genesis",
    "Ioniq",
    "Ioniq 5",
    "Ioniq 5 N",
    "Ioniq 6",
    "Kona",
    "Kona Electric",
    "Nexo",
    "Palisade",
    "Santa Cruz",
    "Santa Fe",
    "Sonata",
    "Tucson",
    "Veloster",
    "Venue",
    "Veracruz",
    "Other"
  ],

  Kia: [
    "Amanti",
    "Borrego",
    "Cadenza",
    "Carnival",
    "EV6",
    "EV9",
    "Forte",
    "K4",
    "K5",
    "K900",
    "Niro",
    "Niro EV",
    "Niro Plug-In Hybrid",
    "Optima",
    "Rio",
    "Rondo",
    "Sedona",
    "Seltos",
    "Sorento",
    "Soul",
    "Soul EV",
    "Spectra",
    "Sportage",
    "Stinger",
    "Telluride",
    "Other"
  ],

  Nissan: [
    "350Z",
    "370Z",
    "Altima",
    "Ariya",
    "Armada",
    "Cube",
    "Frontier",
    "GT-R",
    "Juke",
    "Kicks",
    "Leaf",
    "Maxima",
    "Murano",
    "NV",
    "Pathfinder",
    "Quest",
    "Rogue",
    "Rogue Sport",
    "Sentra",
    "Titan",
    "Versa",
    "Xterra",
    "Z",
    "Other"
  ],

  Ford: [
    "Bronco",
    "Bronco Sport",
    "C-Max",
    "Crown Victoria",
    "E-Series",
    "EcoSport",
    "Edge",
    "Escape",
    "Expedition",
    "Explorer",
    "F-150",
    "F-150 Lightning",
    "F-250",
    "F-350",
    "Fiesta",
    "Five Hundred",
    "Flex",
    "Focus",
    "Fusion",
    "Maverick",
    "Mustang",
    "Mustang Mach-E",
    "Ranger",
    "Taurus",
    "Transit",
    "Other"
  ],

  Jeep: [
    "Cherokee",
    "Commander",
    "Compass",
    "Gladiator",
    "Grand Cherokee",
    "Grand Cherokee L",
    "Grand Wagoneer",
    "Liberty",
    "Patriot",
    "Renegade",
    "Wagoneer",
    "Wrangler",
    "Wrangler 4xe",
    "Other"
  ],

  Mitsubishi: [
    "Eclipse",
    "Eclipse Cross",
    "Endeavor",
    "Galant",
    "i-MiEV",
    "Lancer",
    "Mirage",
    "Mirage G4",
    "Montero",
    "Outlander",
    "Outlander PHEV",
    "Outlander Sport",
    "Other"
  ],

  Mazda: [
    "CX-3",
    "CX-30",
    "CX-5",
    "CX-50",
    "CX-70",
    "CX-9",
    "CX-90",
    "Mazda2",
    "Mazda3",
    "Mazda5",
    "Mazda6",
    "MX-30",
    "MX-5 Miata",
    "RX-8",
    "Tribute",
    "Other"
  ],

  Subaru: [
    "Ascent",
    "B9 Tribeca",
    "BRZ",
    "Crosstrek",
    "Forester",
    "Impreza",
    "Legacy",
    "Outback",
    "Solterra",
    "Tribeca",
    "WRX",
    "XV Crosstrek",
    "Other"
  ],

  Volkswagen: [
    "Arteon",
    "Atlas",
    "Atlas Cross Sport",
    "Beetle",
    "CC",
    "Eos",
    "Golf",
    "Golf GTI",
    "Golf R",
    "ID.4",
    "ID. Buzz",
    "Jetta",
    "Passat",
    "Taos",
    "Tiguan",
    "Touareg",
    "Other"
  ],

  BMW: [
    "1 Series",
    "2 Series",
    "3 Series",
    "4 Series",
    "5 Series",
    "6 Series",
    "7 Series",
    "8 Series",
    "i3",
    "i4",
    "i5",
    "i7",
    "iX",
    "M2",
    "M3",
    "M4",
    "M5",
    "M8",
    "X1",
    "X2",
    "X3",
    "X4",
    "X5",
    "X6",
    "X7",
    "XM",
    "Z4",
    "Other"
  ],

  "Mercedes-Benz": [
    "A-Class",
    "B-Class",
    "C-Class",
    "CLA",
    "CLE",
    "CLS",
    "E-Class",
    "EQA",
    "EQB",
    "EQE",
    "EQS",
    "G-Class",
    "GLA",
    "GLB",
    "GLC",
    "GLE",
    "GLK",
    "GLS",
    "M-Class",
    "S-Class",
    "SL",
    "SLC",
    "SLK",
    "Other"
  ],

  Audi: [
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "e-tron",
    "e-tron GT",
    "Q3",
    "Q4 e-tron",
    "Q5",
    "Q6 e-tron",
    "Q7",
    "Q8",
    "Q8 e-tron",
    "R8",
    "RS3",
    "RS5",
    "RS6",
    "RS7",
    "S3",
    "S4",
    "S5",
    "S6",
    "S7",
    "S8",
    "TT",
    "Other"
  ],

  Lexus: [
    "CT",
    "ES",
    "GS",
    "GX",
    "HS",
    "IS",
    "LC",
    "LFA",
    "LS",
    "LX",
    "NX",
    "RC",
    "RX",
    "RZ",
    "SC",
    "TX",
    "UX",
    "Other"
  ],

  Tesla: [
    "Model 3",
    "Model S",
    "Model X",
    "Model Y",
    "Cybertruck",
    "Roadster",
    "Other"
  ],

  Acura: [
    "CL",
    "ILX",
    "Integra",
    "MDX",
    "NSX",
    "RDX",
    "RL",
    "RLX",
    "RSX",
    "TL",
    "TLX",
    "TSX",
    "ZDX",
    "Other"
  ],

  GMC: [
    "Acadia",
    "Canyon",
    "Envoy",
    "Hummer EV Pickup",
    "Hummer EV SUV",
    "Savana",
    "Sierra",
    "Sierra 1500",
    "Sierra 2500HD",
    "Sierra 3500HD",
    "Terrain",
    "Yukon",
    "Yukon XL",
    "Other"
  ],

  Dodge: [
    "Avenger",
    "Caliber",
    "Challenger",
    "Charger",
    "Dart",
    "Durango",
    "Grand Caravan",
    "Hornet",
    "Journey",
    "Magnum",
    "Neon",
    "Nitro",
    "Ram 1500",
    "Viper",
    "Other"
  ],

  Ram: [
    "1500",
    "1500 Classic",
    "2500",
    "3500",
    "ProMaster",
    "ProMaster City",
    "Other"
  ],

  Buick: [
    "Cascada",
    "Enclave",
    "Encore",
    "Encore GX",
    "Envision",
    "Envista",
    "LaCrosse",
    "Lucerne",
    "Regal",
    "Verano",
    "Other"
  ],

  Cadillac: [
    "ATS",
    "CT4",
    "CT5",
    "CT6",
    "CTS",
    "ELR",
    "Escalade",
    "Escalade ESV",
    "Lyriq",
    "Optiq",
    "SRX",
    "STS",
    "XT4",
    "XT5",
    "XT6",
    "XTS",
    "Other"
  ],

  Chrysler: [
    "200",
    "300",
    "Aspen",
    "Pacifica",
    "Pacifica Hybrid",
    "PT Cruiser",
    "Sebring",
    "Town & Country",
    "Voyager",
    "Other"
  ],

  Infiniti: [
    "EX",
    "FX",
    "G",
    "JX",
    "M",
    "Q30",
    "Q40",
    "Q50",
    "Q60",
    "Q70",
    "QX30",
    "QX50",
    "QX55",
    "QX56",
    "QX60",
    "QX70",
    "QX80",
    "Other"
  ],

  Lincoln: [
    "Aviator",
    "Continental",
    "Corsair",
    "MKC",
    "MKS",
    "MKT",
    "MKX",
    "MKZ",
    "Nautilus",
    "Navigator",
    "Town Car",
    "Zephyr",
    "Other"
  ],

  Mini: [
    "Clubman",
    "Convertible",
    "Cooper",
    "Cooper Countryman",
    "Countryman",
    "Hardtop 2 Door",
    "Hardtop 4 Door",
    "Paceman",
    "Other"
  ],

  Volvo: [
    "C30",
    "C40 Recharge",
    "C70",
    "EX30",
    "EX40",
    "EX90",
    "S40",
    "S60",
    "S80",
    "S90",
    "V40",
    "V50",
    "V60",
    "V70",
    "V90",
    "XC40",
    "XC60",
    "XC70",
    "XC90",
    "Other"
  ],

  Porsche: [
    "718 Boxster",
    "718 Cayman",
    "911",
    "Boxster",
    "Cayenne",
    "Cayman",
    "Macan",
    "Panamera",
    "Taycan",
    "Other"
  ],

  "Land Rover": [
    "Defender",
    "Discovery",
    "Discovery Sport",
    "Freelander",
    "LR2",
    "LR3",
    "LR4",
    "Range Rover",
    "Range Rover Evoque",
    "Range Rover Sport",
    "Range Rover Velar",
    "Other"
  ]

};


/* =========================================================
   MAKE API
   ========================================================= */

Vehicles.getMakes = function(year = null) {

  const catalogMakes = Object.keys(Vehicles.CATALOG);

  const databaseMakes = Vehicles.DATABASE
    .filter(vehicle => yearMatches(vehicle.year, year))
    .map(vehicle => vehicle.make);

  return alphabetical(
    unique([
      ...catalogMakes,
      ...databaseMakes
    ])
  );
};


/* =========================================================
   MODEL API

   IMPORTANT FIX:
   Models are NOT hidden just because GasGo does not yet have
   a verified tank specification for that year.
   ========================================================= */

Vehicles.getModels = function(year, make) {

  if (!make) {
    return [];
  }

  const catalogModels =
    Array.isArray(Vehicles.CATALOG[make])
      ? Vehicles.CATALOG[make]
      : [];

  const databaseModels = Vehicles.DATABASE
    .filter(vehicle =>
      normalize(vehicle.make) === normalize(make)
    )
    .map(vehicle => vehicle.model);

  const combined = unique([
    ...catalogModels,
    ...databaseModels
  ]);

  const withoutOther = combined.filter(
    model => normalize(model) !== "other"
  );

  return [
    ...alphabetical(withoutOther),
    "Other"
  ];
};


/* =========================================================
   CONFIGURATION API
   ========================================================= */

Vehicles.getConfigurations = function(year, make, model) {

  if (!year || !make || !model) {
    return [];
  }

  if (normalize(model) === "other") {
    return [];
  }

  return Vehicles.DATABASE.filter(vehicle => {

    return (
      Number(vehicle.year) === Number(year) &&
      normalize(vehicle.make) === normalize(make) &&
      normalize(vehicle.model) === normalize(model)
    );

  });
};


/* Compatibility alias */

Vehicles.getVehicleConfigurations =
  Vehicles.getConfigurations;


/* =========================================================
   CONFIGURATION LABEL
   ========================================================= */

Vehicles.getConfigurationLabel = function(vehicle) {

  if (!vehicle) {
    return "Unknown configuration";
  }

  const pieces = [];

  if (vehicle.trim) {
    pieces.push(vehicle.trim);
  }

  if (
    vehicle.engine &&
    normalize(vehicle.engine) !== normalize(vehicle.trim)
  ) {
    pieces.push(vehicle.engine);
  }

  if (
    vehicle.drivetrain &&
    !pieces.some(
      item =>
        normalize(item).includes(
          normalize(vehicle.drivetrain)
        )
    )
  ) {
    pieces.push(vehicle.drivetrain);
  }

  if (
    vehicle.powertrain &&
    normalize(vehicle.powertrain) !== "gasoline" &&
    !pieces.some(
      item =>
        normalize(item).includes(
          normalize(vehicle.powertrain)
        )
    )
  ) {
    pieces.push(vehicle.powertrain);
  }

  return pieces.length
    ? pieces.join(" • ")
    : `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
};


/* =========================================================
   EXACT VEHICLE LOOKUP
   ========================================================= */

Vehicles.find = function(
  year,
  make,
  model,
  configuration = null
) {

  const matches =
    Vehicles.getConfigurations(
      year,
      make,
      model
    );

  if (!matches.length) {
    return null;
  }

  if (configuration === null ||
      configuration === undefined ||
      configuration === "") {

    return matches.length === 1
      ? matches[0]
      : null;
  }

  const requested = normalize(configuration);

  return matches.find(vehicle => {

    const label =
      normalize(
        Vehicles.getConfigurationLabel(vehicle)
      );

    return (
      label === requested ||
      normalize(vehicle.trim) === requested ||
      normalize(vehicle.engine) === requested
    );

  }) || null;
};


/* =========================================================
   LOOKUP API
   ========================================================= */

Vehicles.lookup = function(
  year,
  make,
  model,
  configuration = null
) {

  const matches =
    Vehicles.getConfigurations(
      year,
      make,
      model
    );

  if (!matches.length) {

    return {
      found: false,
      exact: false,
      requiresConfiguration: false,
      vehicle: null,
      configurations: [],
      reason: "manual-spec-required"
    };

  }

  if (configuration !== null &&
      configuration !== undefined &&
      configuration !== "") {

    const exactVehicle =
      Vehicles.find(
        year,
        make,
        model,
        configuration
      );

    if (exactVehicle) {

      return {
        found: true,
        exact: true,
        requiresConfiguration: false,
        vehicle: exactVehicle,
        configurations: matches,
        reason: "exact-match"
      };
    }
  }

  if (matches.length === 1) {

    return {
      found: true,
      exact: true,
      requiresConfiguration: false,
      vehicle: matches[0],
      configurations: matches,
      reason: "single-configuration"
    };
  }

  return {
    found: true,
    exact: false,
    requiresConfiguration: true,
    vehicle: null,
    configurations: matches,
    reason: "configuration-required"
  };
};


/* =========================================================
   CAPACITY HELPERS
   ========================================================= */

Vehicles.getTankLiters = function(vehicle) {

  if (!vehicle) {
    return null;
  }

  if (
    vehicle.tankLiters !== null &&
    vehicle.tankLiters !== undefined
  ) {
    return Number(vehicle.tankLiters);
  }

  if (
    vehicle.tankGallons !== null &&
    vehicle.tankGallons !== undefined
  ) {
    return gallonsToLiters(
      vehicle.tankGallons
    );
  }

  return null;
};


Vehicles.getTankGallons = function(vehicle) {

  if (!vehicle) {
    return null;
  }

  if (
    vehicle.tankGallons !== null &&
    vehicle.tankGallons !== undefined
  ) {
    return Number(vehicle.tankGallons);
  }

  if (
    vehicle.tankLiters !== null &&
    vehicle.tankLiters !== undefined
  ) {
    return litersToGallons(
      vehicle.tankLiters
    );
  }

  return null;
};


Vehicles.getBatteryKWh = function(vehicle) {

  if (!vehicle) {
    return null;
  }

  return vehicle.batteryKWh == null
    ? null
    : Number(vehicle.batteryKWh);
};


/* =========================================================
   POWERTRAIN HELPERS
   ========================================================= */

Vehicles.getPowertrain = function(vehicle) {

  if (!vehicle) {
    return null;
  }

  return vehicle.powertrain || "Gasoline";
};


Vehicles.isEV = function(vehicle) {

  return normalize(
    Vehicles.getPowertrain(vehicle)
  ) === "ev";
};


Vehicles.isHybrid = function(vehicle) {

  const type =
    normalize(
      Vehicles.getPowertrain(vehicle)
    );

  return (
    type === "hybrid" ||
    type === "phev"
  );
};


Vehicles.isPHEV = function(vehicle) {

  return normalize(
    Vehicles.getPowertrain(vehicle)
  ) === "phev";
};


/* =========================================================
   CATALOG CHECKS
   ========================================================= */

Vehicles.hasMake = function(make) {

  if (!make) {
    return false;
  }

  return Vehicles.getMakes()
    .some(
      item =>
        normalize(item) === normalize(make)
    );
};


Vehicles.hasModel = function(make, model) {

  if (!make || !model) {
    return false;
  }

  return Vehicles.getModels(null, make)
    .some(
      item =>
        normalize(item) === normalize(model)
    );
};


Vehicles.hasVerifiedSpec = function(
  year,
  make,
  model
) {

  return Vehicles.getConfigurations(
    year,
    make,
    model
  ).length > 0;
};


/* =========================================================
   MODEL INFORMATION
   ========================================================= */

Vehicles.getModelInfo = function(
  year,
  make,
  model
) {

  const configurations =
    Vehicles.getConfigurations(
      year,
      make,
      model
    );

  return {
    year: Number(year),
    make,
    model,

    inCatalog:
      Vehicles.hasModel(
        make,
        model
      ),

    hasVerifiedSpec:
      configurations.length > 0,

    requiresConfiguration:
      configurations.length > 1,

    configurationCount:
      configurations.length,

    configurations
  };
};


/* =========================================================
   SEARCH VERIFIED DATABASE
   ========================================================= */

Vehicles.search = function(query) {

  const requested =
    normalize(query);

  if (!requested) {
    return [...Vehicles.DATABASE];
  }

  return Vehicles.DATABASE.filter(vehicle => {

    const haystack =
      normalize([
        vehicle.year,
        vehicle.make,
        vehicle.model,
        vehicle.trim,
        vehicle.engine,
        vehicle.drivetrain,
        vehicle.powertrain
      ].join(" "));

    return haystack.includes(requested);
  });
};


/* =========================================================
   SEARCH FULL CATALOG
   ========================================================= */

Vehicles.searchCatalog = function(query) {

  const requested =
    normalize(query);

  const results = [];

  Object.entries(
    Vehicles.CATALOG
  ).forEach(([make, models]) => {

    models.forEach(model => {

      if (normalize(model) === "other") {
        return;
      }

      const text =
        normalize(
          `${make} ${model}`
        );

      if (
        !requested ||
        text.includes(requested)
      ) {

        results.push({
          make,
          model,
          verifiedYears:
            unique(
              Vehicles.DATABASE
                .filter(vehicle =>
                  normalize(vehicle.make) === normalize(make) &&
                  normalize(vehicle.model) === normalize(model)
                )
                .map(vehicle => vehicle.year)
            )
            .sort((a, b) => b - a)
        });
      }
    });
  });

  return results;
};


/* =========================================================
   DISPLAY NAME
   ========================================================= */

Vehicles.getDisplayName = function(vehicle) {

  if (!vehicle) {
    return "";
  }

  return [
    vehicle.year,
    vehicle.make,
    vehicle.model,
    vehicle.trim
  ]
    .filter(Boolean)
    .join(" ");
};


/* =========================================================
   CAPACITY DISPLAY
   ========================================================= */

Vehicles.formatCapacity = function(vehicle) {

  if (!vehicle) {
    return "Manual entry required";
  }

  const powertrain =
    normalize(vehicle.powertrain);

  if (powertrain === "ev") {

    if (vehicle.batteryKWh != null) {
      return `${vehicle.batteryKWh} kWh`;
    }

    return "Battery capacity unavailable";
  }

  const liters =
    Vehicles.getTankLiters(vehicle);

  const gallons =
    Vehicles.getTankGallons(vehicle);

  if (
    liters !== null &&
    gallons !== null
  ) {
    return `${liters.toFixed(1)} L (${gallons.toFixed(1)} gal)`;
  }

  return "Manual entry required";
};


/* =========================================================
   VEHICLE VALIDATION
   ========================================================= */

Vehicles.validateVehicle = function(vehicle) {

  if (!vehicle) {

    return {
      valid: false,
      errors: ["Vehicle is missing"]
    };
  }

  const errors = [];

  if (!vehicle.year) {
    errors.push("Missing year");
  }

  if (!vehicle.make) {
    errors.push("Missing make");
  }

  if (!vehicle.model) {
    errors.push("Missing model");
  }

  const powertrain =
    normalize(vehicle.powertrain);

  if (
    powertrain !== "ev" &&
    Vehicles.getTankLiters(vehicle) === null
  ) {
    errors.push("Missing fuel tank capacity");
  }

  if (
    powertrain === "ev" &&
    Vehicles.getBatteryKWh(vehicle) === null
  ) {
    errors.push("Missing battery capacity");
  }

  return {
    valid: errors.length === 0,
    errors
  };
};


/* =========================================================
   DATABASE STATISTICS
   ========================================================= */

Vehicles.getStats = function() {

  const makes =
    Vehicles.getMakes();

  const catalogModels =
    Object.values(
      Vehicles.CATALOG
    ).reduce(
      (total, models) =>
        total +
        models.filter(
          model =>
            normalize(model) !== "other"
        ).length,
      0
    );

  const verifiedModels =
    unique(
      Vehicles.DATABASE.map(vehicle =>
        `${vehicle.year}|${vehicle.make}|${vehicle.model}`
      )
    ).length;

  return {
    version: Vehicles.VERSION,

    makes:
      makes.length,

    catalogModels,

    verifiedConfigurations:
      Vehicles.DATABASE.length,

    verifiedYearModels:
      verifiedModels
  };
};


/* =========================================================
   DEBUG
   ========================================================= */

Vehicles.debug = function(
  year,
  make,
  model = null
) {

  const result = {

    version:
      Vehicles.VERSION,

    year,

    make,

    model,

    models:
      Vehicles.getModels(
        year,
        make
      ),

    configurations:
      model
        ? Vehicles.getConfigurations(
            year,
            make,
            model
          )
        : []
  };

  console.table(
    result.configurations
  );

  return result;
};


/* =========================================================
   READY
   ========================================================= */

console.log(
  `[GasGo] Vehicle database v${Vehicles.VERSION} loaded`
);

console.log(
  "[GasGo] Vehicle database stats:",
  Vehicles.getStats()
);

console.log(
  "[GasGo] 2015 Chevrolet models:",
  Vehicles.getModels(
    2015,
    "Chevrolet"
  )
);
