"use strict";

/* =========================================================
   GASGO VEHICLE DATABASE
   Version 4.1.0

   IMPORTANT
   ---------------------------------------------------------
   - The vehicle catalog and verified specifications are
     intentionally separate.
   - A vehicle can appear in the selector even when GasGo
     does not yet have a verified tank specification.
   - GasGo NEVER invents a tank capacity.
   - When an exact specification is unavailable, the app
     falls back to manual capacity entry.
   ========================================================= */

(function () {

  window.GasGoVehicles = window.GasGoVehicles || {};

  const Vehicles = window.GasGoVehicles;

  Vehicles.VERSION = "4.1.0";


  /* =======================================================
     HELPERS
     ======================================================= */

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
    return [...new Set(values)];
  }


  function alphabetical(values) {
    return [...values].sort((a, b) =>
      String(a).localeCompare(String(b))
    );
  }


  function yearMatches(vehicle, year) {

    const requestedYear = Number(year);

    if (!requestedYear) {
      return true;
    }

    if (Number(vehicle.year) === requestedYear) {
      return true;
    }

    if (
      vehicle.startYear != null &&
      vehicle.endYear != null
    ) {

      return (
        requestedYear >= Number(vehicle.startYear) &&
        requestedYear <= Number(vehicle.endYear)
      );

    }

    return false;
  }


  function createVehicle(data) {

    const vehicle = {
      year: data.year ?? null,
      startYear: data.startYear ?? null,
      endYear: data.endYear ?? null,

      make: data.make || "",
      model: data.model || "",

      trim: data.trim || "",
      engine: data.engine || "",
      drivetrain: data.drivetrain || "",

      configuration: data.configuration || "",

      powertrain: data.powertrain || "Gasoline",

      bodyStyle: data.bodyStyle || "",

      tankLiters:
        Number.isFinite(Number(data.tankLiters))
          ? Number(data.tankLiters)
          : null,

      tankGallons:
        Number.isFinite(Number(data.tankGallons))
          ? Number(data.tankGallons)
          : null,

      batteryKWh:
        Number.isFinite(Number(data.batteryKWh))
          ? Number(data.batteryKWh)
          : null,

      source: data.source || "",
      sourceType: data.sourceType || "manufacturer",

      verified: data.verified !== false
    };


    if (
      vehicle.tankLiters == null &&
      vehicle.tankGallons != null
    ) {

      vehicle.tankLiters =
        gallonsToLiters(vehicle.tankGallons);

    }


    if (
      vehicle.tankGallons == null &&
      vehicle.tankLiters != null
    ) {

      vehicle.tankGallons =
        litersToGallons(vehicle.tankLiters);

    }


    return vehicle;
  }



  /* =======================================================
     VERIFIED VEHICLE SPECIFICATIONS

     These records are used ONLY for automatic capacity
     detection.

     The model selector DOES NOT depend on this list.
     ======================================================= */

  Vehicles.DATABASE = [

    /* =====================================================
       CHEVROLET
       ===================================================== */

    createVehicle({
      year: 2015,
      make: "Chevrolet",
      model: "Sonic",
      engine: "1.4L Turbo",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      bodyStyle: "Sedan / Hatchback",
      tankLiters: 46.0,
      source: "Chevrolet Owner Manual",
      verified: true
    }),

    createVehicle({
      year: 2015,
      make: "Chevrolet",
      model: "Sonic",
      engine: "1.8L",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      bodyStyle: "Sedan / Hatchback",
      tankLiters: 46.0,
      source: "Chevrolet Owner Manual",
      verified: true
    }),

    createVehicle({
      year: 2020,
      make: "Chevrolet",
      model: "Sonic",
      engine: "1.4L Turbo",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallons: 12.1,
      source: "Chevrolet vehicle specification",
      verified: true
    }),


    /* =====================================================
       TOYOTA
       ===================================================== */

    createVehicle({
      year: 2023,
      make: "Toyota",
      model: "Corolla",
      trim: "LE / SE / XSE",
      engine: "2.0L",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallons: 13.2,
      source: "Toyota vehicle specification",
      verified: true
    }),

    createVehicle({
      year: 2023,
      make: "Toyota",
      model: "Corolla",
      trim: "Hybrid",
      engine: "1.8L Hybrid",
      drivetrain: "FWD / AWD",
      powertrain: "Hybrid",
      tankGallons: 11.3,
      source: "Toyota vehicle specification",
      verified: true
    }),

    createVehicle({
      year: 2025,
      make: "Toyota",
      model: "Corolla",
      engine: "2.0L",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallons: 13.2,
      source: "Toyota vehicle specification",
      verified: true
    }),

    createVehicle({
      year: 2025,
      make: "Toyota",
      model: "Corolla Cross",
      engine: "2.0L",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankLiters: 47.0,
      source: "Toyota vehicle specification",
      verified: true
    }),

    createVehicle({
      year: 2025,
      make: "Toyota",
      model: "Corolla Cross",
      engine: "2.0L",
      drivetrain: "AWD",
      powertrain: "Gasoline",
      tankLiters: 50.0,
      source: "Toyota vehicle specification",
      verified: true
    }),


    /* =====================================================
       HONDA
       ===================================================== */

    createVehicle({
      year: 2024,
      make: "Honda",
      model: "Civic",
      bodyStyle: "Sedan",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallons: 12.39,
      source: "Honda vehicle specification",
      verified: true
    }),

    createVehicle({
      year: 2025,
      make: "Honda",
      model: "Civic",
      bodyStyle: "Hatchback",
      configuration: "Gasoline • CVT",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallons: 12.39,
      source: "Honda vehicle specification",
      verified: true
    }),

    createVehicle({
      year: 2025,
      make: "Honda",
      model: "Civic",
      bodyStyle: "Hatchback",
      configuration: "Gasoline • Manual",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallons: 12.4,
      source: "Honda vehicle specification",
      verified: true
    }),

    createVehicle({
      year: 2025,
      make: "Honda",
      model: "Civic",
      bodyStyle: "Sedan",
      configuration: "Hybrid",
      drivetrain: "FWD",
      powertrain: "Hybrid",
      tankGallons: 10.6,
      source: "Honda vehicle specification",
      verified: true
    }),


    /* =====================================================
       HYUNDAI
       ===================================================== */

    createVehicle({
      year: 2025,
      make: "Hyundai",
      model: "Elantra",
      engine: "2.0L",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallons: 12.4,
      source: "Hyundai vehicle specification",
      verified: true
    }),

    createVehicle({
      year: 2025,
      make: "Hyundai",
      model: "Elantra",
      trim: "N Line",
      engine: "1.6L Turbo",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallons: 12.4,
      source: "Hyundai vehicle specification",
      verified: true
    }),

    createVehicle({
      year: 2025,
      make: "Hyundai",
      model: "Elantra",
      trim: "Hybrid",
      engine: "1.6L Hybrid",
      drivetrain: "FWD",
      powertrain: "Hybrid",
      tankGallons: 11.0,
      source: "Hyundai vehicle specification",
      verified: true
    }),


    /* =====================================================
       FORD
       ===================================================== */

    createVehicle({
      year: 2025,
      make: "Ford",
      model: "Escape",
      engine: "1.5L EcoBoost",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallons: 14.8,
      source: "Ford vehicle specification",
      verified: true
    }),

    createVehicle({
      year: 2025,
      make: "Ford",
      model: "Escape",
      engine: "1.5L EcoBoost",
      drivetrain: "AWD",
      powertrain: "Gasoline",
      tankGallons: 15.7,
      source: "Ford vehicle specification",
      verified: true
    }),

    createVehicle({
      year: 2025,
      make: "Ford",
      model: "Escape",
      engine: "2.0L EcoBoost",
      drivetrain: "AWD",
      powertrain: "Gasoline",
      tankGallons: 15.7,
      source: "Ford vehicle specification",
      verified: true
    }),

    createVehicle({
      year: 2025,
      make: "Ford",
      model: "Escape",
      engine: "2.5L Hybrid",
      drivetrain: "FWD / AWD",
      powertrain: "Hybrid",
      tankGallons: 14.3,
      source: "Ford vehicle specification",
      verified: true
    }),

    createVehicle({
      year: 2025,
      make: "Ford",
      model: "Escape",
      engine: "2.5L Plug-in Hybrid",
      drivetrain: "FWD",
      powertrain: "Plug-in Hybrid",
      tankGallons: 11.1,
      source: "Ford vehicle specification",
      verified: true
    }),


    /* =====================================================
       NISSAN
       ===================================================== */

    createVehicle({
      year: 2025,
      make: "Nissan",
      model: "Sentra",
      trim: "S / SV / SR",
      engine: "2.0L",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallons: 12.4,
      source: "Nissan vehicle specification",
      verified: true
    }),


    /* =====================================================
       MAZDA
       ===================================================== */

    createVehicle({
      year: 2025,
      make: "Mazda",
      model: "Mazda3",
      engine: "2.5L",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankLiters: 50.0,
      source: "Mazda vehicle specification",
      verified: true
    }),

    createVehicle({
      year: 2025,
      make: "Mazda",
      model: "Mazda3",
      engine: "2.5L / Turbo",
      drivetrain: "AWD",
      powertrain: "Gasoline",
      tankLiters: 48.0,
      source: "Mazda vehicle specification",
      verified: true
    }),


    /* =====================================================
       SUBARU
       ===================================================== */

    createVehicle({
      year: 2025,
      make: "Subaru",
      model: "Crosstrek",
      engine: "2.0L / 2.5L",
      drivetrain: "AWD",
      powertrain: "Gasoline",
      tankGallons: 16.6,
      source: "Subaru vehicle specification",
      verified: true
    })

  ];



  /* =======================================================
     MASTER MODEL CATALOG

     THIS controls what appears in the dropdown.

     IMPORTANT:
     It is NOT filtered by DATABASE availability.
     ======================================================= */

  Vehicles.CATALOG = {

    Toyota: [
      "Corolla",
      "Camry",
      "RAV4",
      "Corolla Cross",
      "Highlander",
      "Grand Highlander",
      "Tacoma",
      "Tundra",
      "4Runner",
      "Sequoia",
      "Prius",
      "Sienna",
      "GR86",
      "GR Corolla",
      "GR Supra",
      "Crown",
      "Crown Signia",
      "bZ4X",
      "Other"
    ],


    Honda: [
      "Civic",
      "Accord",
      "CR-V",
      "HR-V",
      "Pilot",
      "Passport",
      "Ridgeline",
      "Odyssey",
      "Prologue",
      "Clarity",
      "Fit",
      "Insight",
      "CR-Z",
      "Other"
    ],


    Chevrolet: [
      "Sonic",
      "Spark",
      "Malibu",
      "Cruze",
      "Impala",
      "Trax",
      "Trailblazer",
      "Equinox",
      "Blazer",
      "Traverse",
      "Tahoe",
      "Suburban",
      "Silverado",
      "Colorado",
      "Camaro",
      "Corvette",
      "Bolt EV",
      "Bolt EUV",
      "Equinox EV",
      "Blazer EV",
      "Silverado EV",
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
      "Palisade",
      "Santa Cruz",
      "Veloster",
      "Ioniq",
      "Ioniq 5",
      "Ioniq 6",
      "Nexo",
      "Other"
    ],


    Kia: [
      "Rio",
      "Forte",
      "K4",
      "K5",
      "Stinger",
      "Soul",
      "Seltos",
      "Sportage",
      "Sorento",
      "Telluride",
      "Carnival",
      "Niro",
      "EV6",
      "EV9",
      "Other"
    ],


    Nissan: [
      "Versa",
      "Sentra",
      "Altima",
      "Maxima",
      "Kicks",
      "Rogue",
      "Murano",
      "Pathfinder",
      "Armada",
      "Frontier",
      "Titan",
      "Z",
      "GT-R",
      "Leaf",
      "Ariya",
      "Other"
    ],


    Ford: [
      "Fiesta",
      "Focus",
      "Fusion",
      "Taurus",
      "Mustang",
      "Escape",
      "Edge",
      "Explorer",
      "Expedition",
      "EcoSport",
      "Bronco",
      "Bronco Sport",
      "Maverick",
      "Ranger",
      "F-150",
      "Super Duty",
      "Mustang Mach-E",
      "F-150 Lightning",
      "Other"
    ],


    Jeep: [
      "Wrangler",
      "Compass",
      "Renegade",
      "Cherokee",
      "Grand Cherokee",
      "Gladiator",
      "Wagoneer",
      "Grand Wagoneer",
      "Avenger",
      "Other"
    ],


    Mitsubishi: [
      "Mirage",
      "Mirage G4",
      "Lancer",
      "Outlander",
      "Outlander Sport",
      "Eclipse Cross",
      "Outlander PHEV",
      "Other"
    ],


    Mazda: [
      "Mazda3",
      "Mazda6",
      "CX-3",
      "CX-30",
      "CX-5",
      "CX-50",
      "CX-70",
      "CX-9",
      "CX-90",
      "MX-5 Miata",
      "MX-30",
      "Other"
    ],


    Subaru: [
      "Impreza",
      "Legacy",
      "Crosstrek",
      "Forester",
      "Outback",
      "Ascent",
      "WRX",
      "BRZ",
      "Solterra",
      "Other"
    ],


    Volkswagen: [
      "Jetta",
      "Passat",
      "Arteon",
      "Golf",
      "Golf GTI",
      "Golf R",
      "Beetle",
      "Taos",
      "Tiguan",
      "Atlas",
      "Atlas Cross Sport",
      "ID.4",
      "ID. Buzz",
      "Other"
    ],


    BMW: [
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "7 Series",
      "8 Series",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "Z4",
      "i3",
      "i4",
      "i5",
      "i7",
      "iX",
      "XM",
      "Other"
    ],


    "Mercedes-Benz": [
      "A-Class",
      "C-Class",
      "E-Class",
      "S-Class",
      "CLA",
      "CLS",
      "GLA",
      "GLB",
      "GLC",
      "GLE",
      "GLS",
      "G-Class",
      "AMG GT",
      "EQA",
      "EQB",
      "EQE",
      "EQS",
      "Other"
    ],


    Audi: [
      "A3",
      "A4",
      "A5",
      "A6",
      "A7",
      "A8",
      "Q3",
      "Q4 e-tron",
      "Q5",
      "Q7",
      "Q8",
      "TT",
      "R8",
      "e-tron",
      "e-tron GT",
      "Other"
    ],


    Lexus: [
      "IS",
      "ES",
      "LS",
      "RC",
      "LC",
      "UX",
      "NX",
      "RX",
      "GX",
      "LX",
      "RZ",
      "TX",
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
      "Integra",
      "TLX",
      "ILX",
      "RLX",
      "RDX",
      "MDX",
      "ZDX",
      "NSX",
      "Other"
    ],


    GMC: [
      "Terrain",
      "Acadia",
      "Yukon",
      "Canyon",
      "Sierra",
      "Hummer EV",
      "Other"
    ],


    Dodge: [
      "Dart",
      "Charger",
      "Challenger",
      "Hornet",
      "Journey",
      "Durango",
      "Grand Caravan",
      "Other"
    ],


    Ram: [
      "1500",
      "2500",
      "3500",
      "ProMaster",
      "ProMaster City",
      "Other"
    ],


    Buick: [
      "Encore",
      "Encore GX",
      "Envista",
      "Envision",
      "Enclave",
      "Regal",
      "LaCrosse",
      "Other"
    ],


    Cadillac: [
      "ATS",
      "CTS",
      "CT4",
      "CT5",
      "CT6",
      "XT4",
      "XT5",
      "XT6",
      "Escalade",
      "Lyriq",
      "Other"
    ],


    Chrysler: [
      "200",
      "300",
      "Pacifica",
      "Voyager",
      "Other"
    ],


    Infiniti: [
      "Q50",
      "Q60",
      "QX30",
      "QX50",
      "QX55",
      "QX60",
      "QX80",
      "Other"
    ],


    Lincoln: [
      "MKZ",
      "Continental",
      "Corsair",
      "Nautilus",
      "Aviator",
      "Navigator",
      "Other"
    ],


    Mini: [
      "Cooper",
      "Cooper Clubman",
      "Cooper Countryman",
      "Other"
    ],


    Volvo: [
      "S60",
      "S90",
      "V60",
      "V90",
      "XC40",
      "XC60",
      "XC90",
      "C40 Recharge",
      "EX30",
      "EX90",
      "Other"
    ],


    Porsche: [
      "718 Boxster",
      "718 Cayman",
      "911",
      "Panamera",
      "Macan",
      "Cayenne",
      "Taycan",
      "Other"
    ],


    "Land Rover": [
      "Range Rover",
      "Range Rover Sport",
      "Range Rover Velar",
      "Range Rover Evoque",
      "Discovery",
      "Discovery Sport",
      "Defender",
      "Other"
    ]

  };



  /* =======================================================
     YEARS

     GasGo currently allows model years 1996 through 2027.

     IMPORTANT:
     Models are NOT removed from the dropdown simply
     because GasGo does not yet have a verified spec.
     ======================================================= */

  Vehicles.MIN_YEAR = 1996;
  Vehicles.MAX_YEAR = 2027;



  /* =======================================================
     PUBLIC API
     ======================================================= */

  Vehicles.getAll = function () {

    return Vehicles.DATABASE.map(vehicle => ({
      ...vehicle
    }));

  };


  Vehicles.getYears = function () {

    const years = [];

    for (
      let year = Vehicles.MAX_YEAR;
      year >= Vehicles.MIN_YEAR;
      year--
    ) {

      years.push(year);

    }

    return years;

  };


  /* =======================================================
     MAKES

     FIX V4.1:
     ALL catalog makes are returned regardless of whether
     a verified database record exists for that year.
     ======================================================= */

  Vehicles.getMakes = function () {

    return Object.keys(Vehicles.CATALOG);

  };


  /* =======================================================
     MODELS

     CRITICAL V4.1 FIX

     The year DOES NOT reduce the model list to only
     verified DATABASE entries.

     Example:

     getModels(2015, "Chevrolet")

     returns:
     Sonic, Spark, Malibu, Cruze, Impala, Trax, etc.

     It does NOT return only Sonic.
     ======================================================= */

  Vehicles.getModels = function (year, make) {

    const requestedMake = String(make || "").trim();

    if (!requestedMake) {
      return ["Other"];
    }


    const catalogMake = Object.keys(Vehicles.CATALOG)
      .find(
        key =>
          normalize(key) === normalize(requestedMake)
      );


    if (!catalogMake) {

      return ["Other"];

    }


    const models =
      Vehicles.CATALOG[catalogMake] || [];


    return [...models];

  };



  /* =======================================================
     CONFIGURATIONS

     Configurations ARE based on verified records because
     GasGo needs actual specification data before offering
     an automatic capacity.
     ======================================================= */

  Vehicles.getConfigurations = function (
    year,
    make,
    model
  ) {

    const records = Vehicles.DATABASE.filter(vehicle => {

      return (
        yearMatches(vehicle, year) &&
        normalize(vehicle.make) === normalize(make) &&
        normalize(vehicle.model) === normalize(model)
      );

    });


    return records.map(vehicle => ({
      ...vehicle
    }));

  };


  Vehicles.getVehicleConfigurations =
    Vehicles.getConfigurations;



  /* =======================================================
     CONFIGURATION LABEL
     ======================================================= */

  Vehicles.getConfigurationLabel = function (vehicle) {

    if (!vehicle) {
      return "Standard";
    }


    if (vehicle.configuration) {
      return vehicle.configuration;
    }


    const parts = [];


    if (vehicle.trim) {
      parts.push(vehicle.trim);
    }


    if (vehicle.engine) {
      parts.push(vehicle.engine);
    }


    if (vehicle.drivetrain) {
      parts.push(vehicle.drivetrain);
    }


    if (vehicle.bodyStyle) {
      parts.push(vehicle.bodyStyle);
    }


    if (vehicle.powertrain) {

      const powertrainAlreadyIncluded =
        parts.some(part =>
          normalize(part).includes(
            normalize(vehicle.powertrain)
          )
        );


      if (!powertrainAlreadyIncluded) {
        parts.push(vehicle.powertrain);
      }

    }


    return parts.length
      ? unique(parts).join(" • ")
      : "Standard";

  };



  /* =======================================================
     FIND
     ======================================================= */

  Vehicles.find = function (options = {}) {

    const {
      year,
      make,
      model,
      configuration,
      powertrain,
      engine,
      drivetrain,
      trim
    } = options;


    return Vehicles.DATABASE.filter(vehicle => {

      if (
        year != null &&
        !yearMatches(vehicle, year)
      ) {
        return false;
      }


      if (
        make &&
        normalize(vehicle.make) !== normalize(make)
      ) {
        return false;
      }


      if (
        model &&
        normalize(vehicle.model) !== normalize(model)
      ) {
        return false;
      }


      if (
        powertrain &&
        normalize(vehicle.powertrain) !==
          normalize(powertrain)
      ) {
        return false;
      }


      if (
        engine &&
        !normalize(vehicle.engine).includes(
          normalize(engine)
        )
      ) {
        return false;
      }


      if (
        drivetrain &&
        !normalize(vehicle.drivetrain).includes(
          normalize(drivetrain)
        )
      ) {
        return false;
      }


      if (
        trim &&
        !normalize(vehicle.trim).includes(
          normalize(trim)
        )
      ) {
        return false;
      }


      if (configuration) {

        const label =
          Vehicles.getConfigurationLabel(vehicle);


        if (
          normalize(label) !==
          normalize(configuration)
        ) {
          return false;
        }

      }


      return true;

    }).map(vehicle => ({
      ...vehicle
    }));

  };



  /* =======================================================
     LOOKUP

     Exact record:
       exact = true

     Multiple configurations:
       requiresConfiguration = true

     No verified record:
       manual = true
     ======================================================= */

  Vehicles.lookup = function (options = {}) {

    const year = Number(options.year);

    const make =
      String(options.make || "").trim();

    const model =
      String(options.model || "").trim();

    const configuration =
      String(options.configuration || "").trim();


    if (!year || !make || !model) {

      return {
        found: false,
        exact: false,
        manual: true,
        requiresConfiguration: false,
        vehicle: null,
        tankLiters: null,
        batteryKWh: null,
        matches: []
      };

    }


    let matches = Vehicles.find({
      year,
      make,
      model
    });


    if (!matches.length) {

      return {
        found: false,
        exact: false,
        manual: true,
        requiresConfiguration: false,
        vehicle: null,
        tankLiters: null,
        batteryKWh: null,
        matches: []
      };

    }


    if (configuration) {

      const exactConfiguration =
        matches.find(vehicle => {

          const label =
            Vehicles.getConfigurationLabel(vehicle);

          return (
            normalize(label) ===
            normalize(configuration)
          );

        });


      if (exactConfiguration) {

        return {
          found: true,
          exact: true,
          manual: false,
          requiresConfiguration: false,

          vehicle: {
            ...exactConfiguration
          },

          tankLiters:
            exactConfiguration.tankLiters,

          tankGallons:
            exactConfiguration.tankGallons,

          batteryKWh:
            exactConfiguration.batteryKWh,

          matches: matches.map(vehicle => ({
            ...vehicle
          }))
        };

      }

    }


    if (matches.length === 1) {

      const vehicle = matches[0];


      return {
        found: true,
        exact: true,
        manual: false,
        requiresConfiguration: false,

        vehicle: {
          ...vehicle
        },

        tankLiters:
          vehicle.tankLiters,

        tankGallons:
          vehicle.tankGallons,

        batteryKWh:
          vehicle.batteryKWh,

        matches: [
          {
            ...vehicle
          }
        ]
      };

    }


    /* -----------------------------------------------------
       If all records have the SAME relevant capacity and
       powertrain, GasGo can safely use that specification
       without forcing the user to choose a configuration.
       ----------------------------------------------------- */

    const capacityKeys =
      unique(
        matches.map(vehicle => {

          return [
            vehicle.tankLiters ?? "",
            vehicle.batteryKWh ?? "",
            normalize(vehicle.powertrain)
          ].join("|");

        })
      );


    if (capacityKeys.length === 1) {

      const vehicle = matches[0];


      return {
        found: true,
        exact: true,
        manual: false,
        requiresConfiguration: false,

        vehicle: {
          ...vehicle
        },

        tankLiters:
          vehicle.tankLiters,

        tankGallons:
          vehicle.tankGallons,

        batteryKWh:
          vehicle.batteryKWh,

        matches: matches.map(item => ({
          ...item
        }))
      };

    }


    return {
      found: false,
      exact: false,
      manual: false,
      requiresConfiguration: true,

      vehicle: null,
      tankLiters: null,
      tankGallons: null,
      batteryKWh: null,

      matches: matches.map(vehicle => ({
        ...vehicle
      }))
    };

  };



  /* =======================================================
     CAPACITY HELPERS
     ======================================================= */

  Vehicles.getTankCapacity = function (
    year,
    make,
    model,
    configuration = ""
  ) {

    const result = Vehicles.lookup({
      year,
      make,
      model,
      configuration
    });


    if (
      result.exact &&
      Number.isFinite(Number(result.tankLiters))
    ) {

      return Number(result.tankLiters);

    }


    return null;

  };


  Vehicles.getTankLiters =
    Vehicles.getTankCapacity;


  Vehicles.getTankGallons = function (
    year,
    make,
    model,
    configuration = ""
  ) {

    const result = Vehicles.lookup({
      year,
      make,
      model,
      configuration
    });


    if (
      result.exact &&
      Number.isFinite(Number(result.tankGallons))
    ) {

      return Number(result.tankGallons);

    }


    if (
      result.exact &&
      Number.isFinite(Number(result.tankLiters))
    ) {

      return litersToGallons(
        result.tankLiters
      );

    }


    return null;

  };


  Vehicles.getBatteryCapacity = function (
    year,
    make,
    model,
    configuration = ""
  ) {

    const result = Vehicles.lookup({
      year,
      make,
      model,
      configuration
    });


    if (
      result.exact &&
      Number.isFinite(Number(result.batteryKWh))
    ) {

      return Number(result.batteryKWh);

    }


    return null;

  };


  Vehicles.getBatteryKWh =
    Vehicles.getBatteryCapacity;



  /* =======================================================
     POWERTRAIN
     ======================================================= */

  Vehicles.getPowertrain = function (
    year,
    make,
    model,
    configuration = ""
  ) {

    const result = Vehicles.lookup({
      year,
      make,
      model,
      configuration
    });


    if (
      result.exact &&
      result.vehicle
    ) {

      return result.vehicle.powertrain;

    }


    return null;

  };



  /* =======================================================
     CATALOG CHECK
     ======================================================= */

  Vehicles.hasCatalogModel = function (
    make,
    model
  ) {

    const models =
      Vehicles.getModels(null, make);


    return models.some(
      item =>
        normalize(item) ===
        normalize(model)
    );

  };



  /* =======================================================
     VERIFIED SPEC CHECK
     ======================================================= */

  Vehicles.hasVerifiedSpec = function (
    year,
    make,
    model
  ) {

    return Vehicles.find({
      year,
      make,
      model
    }).length > 0;

  };



  /* =======================================================
     MODEL INFO
     ======================================================= */

  Vehicles.getModelInfo = function (
    year,
    make,
    model
  ) {

    const inCatalog =
      Vehicles.hasCatalogModel(
        make,
        model
      );


    const verifiedRecords =
      Vehicles.find({
        year,
        make,
        model
      });


    return {
      year: Number(year) || null,
      make: make || "",
      model: model || "",

      inCatalog,

      verified:
        verifiedRecords.length > 0,

      configurations:
        verifiedRecords.map(vehicle => ({
          ...vehicle
        })),

      requiresManualCapacity:
        verifiedRecords.length === 0
    };

  };



  /* =======================================================
     SEARCH VERIFIED DATABASE
     ======================================================= */

  Vehicles.search = function (query = "") {

    const q = normalize(query);

    if (!q) {
      return Vehicles.getAll();
    }


    return Vehicles.DATABASE
      .filter(vehicle => {

        const text = normalize([
          vehicle.year,
          vehicle.make,
          vehicle.model,
          vehicle.trim,
          vehicle.engine,
          vehicle.drivetrain,
          vehicle.powertrain,
          vehicle.bodyStyle
        ].join(" "));


        return text.includes(q);

      })
      .map(vehicle => ({
        ...vehicle
      }));

  };



  /* =======================================================
     SEARCH CATALOG
     ======================================================= */

  Vehicles.searchCatalog = function (
    query = ""
  ) {

    const q = normalize(query);

    const results = [];


    Object.entries(Vehicles.CATALOG)
      .forEach(([make, models]) => {

        models.forEach(model => {

          if (
            !q ||
            normalize(
              make + " " + model
            ).includes(q)
          ) {

            results.push({
              make,
              model
            });

          }

        });

      });


    return results;

  };



  /* =======================================================
     DISPLAY NAME
     ======================================================= */

  Vehicles.getDisplayName = function (
    vehicle
  ) {

    if (!vehicle) {
      return "";
    }


    const base = [
      vehicle.year,
      vehicle.make,
      vehicle.model
    ]
      .filter(Boolean)
      .join(" ");


    const configuration =
      Vehicles.getConfigurationLabel(
        vehicle
      );


    if (
      configuration &&
      configuration !== "Standard"
    ) {

      return (
        base +
        " • " +
        configuration
      );

    }


    return base;

  };



  /* =======================================================
     FORMAT CAPACITY
     ======================================================= */

  Vehicles.formatCapacity = function (
    vehicle
  ) {

    if (!vehicle) {
      return "Capacity unavailable";
    }


    const powertrain =
      normalize(vehicle.powertrain);


    if (
      powertrain.includes("plug-in") ||
      powertrain.includes("phev")
    ) {

      const parts = [];


      if (
        Number.isFinite(
          Number(vehicle.tankLiters)
        )
      ) {

        parts.push(
          Number(
            vehicle.tankLiters
          ).toFixed(1) + " L"
        );

      }


      if (
        Number.isFinite(
          Number(vehicle.batteryKWh)
        )
      ) {

        parts.push(
          Number(
            vehicle.batteryKWh
          ).toFixed(1) + " kWh"
        );

      }


      return parts.length
        ? parts.join(" + ")
        : "Capacity unavailable";

    }


    if (
      powertrain === "electric" ||
      powertrain === "ev"
    ) {

      if (
        Number.isFinite(
          Number(vehicle.batteryKWh)
        )
      ) {

        return (
          Number(
            vehicle.batteryKWh
          ).toFixed(1) +
          " kWh"
        );

      }


      return "Battery capacity unavailable";

    }


    if (
      Number.isFinite(
        Number(vehicle.tankLiters)
      )
    ) {

      return (
        Number(
          vehicle.tankLiters
        ).toFixed(1) +
        " L"
      );

    }


    return "Tank capacity unavailable";

  };



  /* =======================================================
     DATABASE VALIDATION
     ======================================================= */

  Vehicles.validateDatabase = function () {

    const problems = [];

    const seen = new Set();


    Vehicles.DATABASE
      .forEach((vehicle, index) => {

        if (!vehicle.make) {

          problems.push(
            `Record ${index}: missing make`
          );

        }


        if (!vehicle.model) {

          problems.push(
            `Record ${index}: missing model`
          );

        }


        if (
          vehicle.year == null &&
          vehicle.startYear == null
        ) {

          problems.push(
            `Record ${index}: missing year`
          );

        }


        const key = [
          vehicle.year ?? "",
          vehicle.startYear ?? "",
          vehicle.endYear ?? "",
          normalize(vehicle.make),
          normalize(vehicle.model),
          normalize(
            Vehicles.getConfigurationLabel(
              vehicle
            )
          )
        ].join("|");


        if (seen.has(key)) {

          problems.push(
            `Possible duplicate: ${key}`
          );

        }


        seen.add(key);


        if (
          vehicle.tankLiters != null &&
          !Number.isFinite(
            Number(vehicle.tankLiters)
          )
        ) {

          problems.push(
            `Record ${index}: invalid tank liters`
          );

        }


        if (
          vehicle.batteryKWh != null &&
          !Number.isFinite(
            Number(vehicle.batteryKWh)
          )
        ) {

          problems.push(
            `Record ${index}: invalid battery capacity`
          );

        }

      });


    return {
      valid: problems.length === 0,
      problems
    };

  };



  /* =======================================================
     STATS
     ======================================================= */

  Vehicles.getStats = function () {

    const makes =
      Object.keys(Vehicles.CATALOG);


    const catalogModels =
      Object.values(Vehicles.CATALOG)
        .reduce(
          (total, models) =>
            total + models.length,
          0
        );


    return {
      version: Vehicles.VERSION,

      minYear:
        Vehicles.MIN_YEAR,

      maxYear:
        Vehicles.MAX_YEAR,

      catalogMakes:
        makes.length,

      catalogModels,

      verifiedRecords:
        Vehicles.DATABASE.length
    };

  };



  /* =======================================================
     DEBUG
     ======================================================= */

  Vehicles.debug = function () {

    const validation =
      Vehicles.validateDatabase();


    const stats =
      Vehicles.getStats();


    console.group(
      "GasGo Vehicle Database"
    );


    console.log(
      "Version:",
      Vehicles.VERSION
    );


    console.log(
      "Stats:",
      stats
    );


    console.log(
      "Validation:",
      validation
    );


    console.log(
      "2015 Chevrolet models:",
      Vehicles.getModels(
        2015,
        "Chevrolet"
      )
    );


    console.log(
      "2015 Chevrolet Sonic:",
      Vehicles.lookup({
        year: 2015,
        make: "Chevrolet",
        model: "Sonic"
      })
    );


    console.groupEnd();


    return {
      stats,
      validation
    };

  };



  /* =======================================================
     LOAD TEST

     This should print ALL Chevrolet models, not only Sonic.
     ======================================================= */

  const testChevrolet =
    Vehicles.getModels(
      2015,
      "Chevrolet"
    );


  console.log(
    "GasGo vehicles.js v4.1.0 loaded 🚗"
  );


  console.log(
    "2015 Chevrolet catalog:",
    testChevrolet
  );


  if (
    testChevrolet.length <= 1
  ) {

    console.error(
      "GasGo vehicle catalog error: Chevrolet model list did not load correctly."
    );

  }

})();
