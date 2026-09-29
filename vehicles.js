"use strict";

/* =========================================================
   GASGO VEHICLE DATABASE
   Version 4.0.0

   Purpose:
   - Vehicle year / make / model catalog
   - Configuration-aware tank lookup
   - Automatic tank capacity when verified
   - Manual fallback when exact data is unavailable
   - EV / PHEV architecture ready

   IMPORTANT:
   A model appearing in CATALOG does NOT mean GasGo knows
   its exact tank capacity.

   Tank capacity is only returned automatically when a
   matching verified DATABASE record exists.
   ========================================================= */

(function () {

  window.GasGoVehicles =
    window.GasGoVehicles || {};

  const Vehicles =
    window.GasGoVehicles;

  Vehicles.VERSION = "4.0.0";


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

    const number =
      Number(gallons);

    if (
      !Number.isFinite(number) ||
      number <= 0
    ) {
      return null;
    }

    return Number(
      (
        number *
        3.785411784
      ).toFixed(2)
    );

  }


  function litersToGallons(liters) {

    const number =
      Number(liters);

    if (
      !Number.isFinite(number) ||
      number <= 0
    ) {
      return null;
    }

    return Number(
      (
        number /
        3.785411784
      ).toFixed(2)
    );

  }


  function unique(values) {

    return [
      ...new Set(
        values.filter(Boolean)
      )
    ];

  }


  function alphabetical(values) {

    return [...values].sort(
      (a, b) =>
        String(a).localeCompare(
          String(b),
          undefined,
          {
            sensitivity: "base"
          }
        )
    );

  }


  function yearMatches(
    vehicle,
    year
  ) {

    const target =
      Number(year);

    if (
      !Number.isFinite(target)
    ) {
      return true;
    }


    if (
      Number.isFinite(
        Number(vehicle.year)
      )
    ) {

      return (
        Number(vehicle.year) ===
        target
      );

    }


    const start =
      Number(
        vehicle.startYear
      );


    const end =
      Number(
        vehicle.endYear
      );


    if (
      Number.isFinite(start) &&
      Number.isFinite(end)
    ) {

      return (
        target >= start &&
        target <= end
      );

    }


    if (
      Number.isFinite(start)
    ) {

      return target >= start;

    }


    return false;

  }


  function vehicleYears(
    vehicle
  ) {

    if (
      Number.isFinite(
        Number(vehicle.year)
      )
    ) {

      return [
        Number(vehicle.year)
      ];

    }


    const start =
      Number(
        vehicle.startYear
      );


    const end =
      Number(
        vehicle.endYear
      );


    if (
      !Number.isFinite(start)
    ) {
      return [];
    }


    const finalYear =
      Number.isFinite(end)
        ? end
        : start;


    const years = [];


    for (
      let year = start;
      year <= finalYear;
      year++
    ) {

      years.push(year);

    }


    return years;

  }


  function createVehicle(data) {

    const vehicle = {
      market: "US",
      verified: true,
      ...data
    };


    if (
      vehicle.tankLiters == null &&
      vehicle.tankGallonsUS != null
    ) {

      vehicle.tankLiters =
        gallonsToLiters(
          vehicle.tankGallonsUS
        );

    }


    if (
      vehicle.tankGallonsUS == null &&
      vehicle.tankLiters != null
    ) {

      vehicle.tankGallonsUS =
        litersToGallons(
          vehicle.tankLiters
        );

    }


    return vehicle;

  }


  /* =======================================================
     VERIFIED SPECIFICATION DATABASE

     NOTE:
     Records are configuration-specific whenever capacity
     differs between variants.
     ======================================================= */

  Vehicles.DATABASE = [

    /* =====================================================
       CHEVROLET
       ===================================================== */

    createVehicle({
      year: 2015,
      make: "Chevrolet",
      model: "Sonic",
      body: "Sedan / Hatchback",
      trim: "Gasoline",
      engine: "1.4L Turbo / 1.8L",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankLiters: 46.0,
      sourceName:
        "Chevrolet Sonic Owner Manual",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2020,
      make: "Chevrolet",
      model: "Sonic",
      body: "Sedan / Hatchback",
      trim: "Gasoline",
      engine: "1.4L Turbo",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallonsUS: 12.1,
      sourceName:
        "Chevrolet Sonic specifications",
      sourceType:
        "manufacturer"
    }),


    /* =====================================================
       TOYOTA COROLLA
       ===================================================== */

    createVehicle({
      year: 2000,
      make: "Toyota",
      model: "Corolla",
      body: "Sedan",
      trim: "Gasoline",
      powertrain: "Gasoline",
      tankLiters: 50.0,
      sourceName:
        "Toyota 2000 Corolla Owner's Manual",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2001,
      make: "Toyota",
      model: "Corolla",
      body: "Sedan",
      trim: "Gasoline",
      powertrain: "Gasoline",
      tankLiters: 50.0,
      sourceName:
        "Toyota 2001 Corolla Owner's Manual",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2023,
      make: "Toyota",
      model: "Corolla",
      body: "Sedan",
      trim: "LE / SE / XSE",
      engine: "2.0L",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallonsUS: 13.2,
      sourceName:
        "Toyota Corolla specifications",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2023,
      make: "Toyota",
      model: "Corolla",
      body: "Sedan",
      trim: "Hybrid",
      drivetrain: "FWD / AWD",
      powertrain: "Hybrid",
      tankGallonsUS: 11.3,
      sourceName:
        "Toyota Corolla Hybrid specifications",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2025,
      make: "Toyota",
      model: "Corolla",
      body: "Sedan",
      trim: "Gasoline",
      engine: "2.0L",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallonsUS: 13.2,
      sourceName:
        "Toyota Corolla specifications",
      sourceType:
        "manufacturer"
    }),


    /* =====================================================
       TOYOTA COROLLA CROSS
       ===================================================== */

    createVehicle({
      year: 2025,
      make: "Toyota",
      model: "Corolla Cross",
      body: "SUV",
      trim: "Gasoline",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankLiters: 47.0,
      sourceName:
        "Toyota Corolla Cross specifications",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2025,
      make: "Toyota",
      model: "Corolla Cross",
      body: "SUV",
      trim: "Gasoline",
      drivetrain: "AWD",
      powertrain: "Gasoline",
      tankLiters: 50.0,
      sourceName:
        "Toyota Corolla Cross specifications",
      sourceType:
        "manufacturer"
    }),


    /* =====================================================
       HONDA CIVIC
       ===================================================== */

    createVehicle({
      year: 2015,
      make: "Honda",
      model: "Civic",
      body: "Coupe",
      trim: "Si",
      engine: "2.4L",
      drivetrain: "FWD",
      transmission: "Manual",
      powertrain: "Gasoline",
      tankLiters: 50.0,
      tankGallonsUS: 13.2,
      sourceName:
        "Honda 2015 Civic Coupe Si specifications",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2025,
      make: "Honda",
      model: "Civic",
      body: "Hatchback",
      trim: "Gasoline",
      engine: "2.0L",
      drivetrain: "FWD",
      transmission: "CVT",
      powertrain: "Gasoline",
      tankLiters: 46.9,
      tankGallonsUS: 12.39,
      sourceName:
        "Honda Civic Hatchback 2025 Owner's Manual",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2025,
      make: "Honda",
      model: "Civic",
      body: "Hatchback",
      trim: "Gasoline",
      engine: "2.0L",
      drivetrain: "FWD",
      transmission: "Manual",
      powertrain: "Gasoline",
      tankLiters: 47.0,
      tankGallonsUS: 12.4,
      sourceName:
        "Honda Civic Hatchback 2025 Owner's Manual",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2025,
      make: "Honda",
      model: "Civic",
      body: "Sedan",
      trim: "Hybrid",
      engine: "2.0L Hybrid",
      drivetrain: "FWD",
      powertrain: "Hybrid",
      tankLiters: 40.36,
      tankGallonsUS: 10.6,
      sourceName:
        "Honda Civic Sedan Hybrid 2025 Owner's Manual",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2026,
      make: "Honda",
      model: "Civic",
      body: "Hatchback",
      trim: "Hybrid",
      engine: "2.0L Hybrid",
      drivetrain: "FWD",
      powertrain: "Hybrid",
      tankLiters: 40.36,
      tankGallonsUS: 10.6,
      sourceName:
        "Honda Civic Hatchback Hybrid 2026 Owner's Manual",
      sourceType:
        "manufacturer"
    }),


    /* =====================================================
       HYUNDAI ELANTRA
       ===================================================== */

    createVehicle({
      year: 2025,
      make: "Hyundai",
      model: "Elantra",
      body: "Sedan",
      trim: "Gasoline",
      engine: "2.0L",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallonsUS: 12.4,
      sourceName:
        "Hyundai Elantra specifications",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2025,
      make: "Hyundai",
      model: "Elantra",
      body: "Sedan",
      trim: "N Line",
      engine: "1.6L Turbo",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallonsUS: 12.4,
      sourceName:
        "Hyundai Elantra specifications",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2025,
      make: "Hyundai",
      model: "Elantra",
      body: "Sedan",
      trim: "Hybrid",
      engine: "1.6L",
      drivetrain: "FWD",
      powertrain: "Hybrid",
      tankGallonsUS: 11.0,
      sourceName:
        "Hyundai Elantra Hybrid specifications",
      sourceType:
        "manufacturer"
    }),


    /* =====================================================
       FORD ESCAPE 2021
       ===================================================== */

    createVehicle({
      year: 2021,
      make: "Ford",
      model: "Escape",
      body: "SUV",
      engine: "1.5L EcoBoost",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallonsUS: 14.8,
      sourceName:
        "Ford 2021 Escape Technical Specifications",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2021,
      make: "Ford",
      model: "Escape",
      body: "SUV",
      engine: "1.5L EcoBoost",
      drivetrain: "AWD",
      powertrain: "Gasoline",
      tankGallonsUS: 15.7,
      sourceName:
        "Ford 2021 Escape Technical Specifications",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2021,
      make: "Ford",
      model: "Escape",
      body: "SUV",
      engine: "2.0L EcoBoost",
      drivetrain: "AWD",
      powertrain: "Gasoline",
      tankGallonsUS: 15.7,
      sourceName:
        "Ford 2021 Escape Technical Specifications",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2021,
      make: "Ford",
      model: "Escape",
      body: "SUV",
      trim: "Hybrid",
      engine: "2.5L",
      drivetrain: "FWD / AWD",
      powertrain: "Hybrid",
      tankGallonsUS: 14.2,
      sourceName:
        "Ford 2021 Escape Technical Specifications",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2021,
      make: "Ford",
      model: "Escape",
      body: "SUV",
      trim: "Plug-in Hybrid",
      engine: "2.5L",
      drivetrain: "FWD",
      powertrain: "Plug-in Hybrid",
      tankGallonsUS: 11.2,
      sourceName:
        "Ford 2021 Escape Technical Specifications",
      sourceType:
        "manufacturer"
    }),


    /* =====================================================
       FORD ESCAPE 2025
       ===================================================== */

    createVehicle({
      year: 2025,
      make: "Ford",
      model: "Escape",
      body: "SUV",
      engine: "1.5L EcoBoost",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallonsUS: 14.8,
      sourceName:
        "Ford 2025 Escape Technical Specifications",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2025,
      make: "Ford",
      model: "Escape",
      body: "SUV",
      engine: "1.5L EcoBoost",
      drivetrain: "AWD",
      powertrain: "Gasoline",
      tankGallonsUS: 15.7,
      sourceName:
        "Ford 2025 Escape Technical Specifications",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2025,
      make: "Ford",
      model: "Escape",
      body: "SUV",
      engine: "2.0L EcoBoost",
      drivetrain: "AWD",
      powertrain: "Gasoline",
      tankGallonsUS: 15.7,
      sourceName:
        "Ford 2025 Escape Technical Specifications",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2025,
      make: "Ford",
      model: "Escape",
      body: "SUV",
      trim: "Hybrid",
      engine: "2.5L",
      drivetrain: "FWD / AWD",
      powertrain: "Hybrid",
      tankGallonsUS: 14.3,
      sourceName:
        "Ford 2025 Escape Technical Specifications",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2025,
      make: "Ford",
      model: "Escape",
      body: "SUV",
      trim: "Plug-in Hybrid",
      engine: "2.5L",
      drivetrain: "FWD",
      powertrain: "Plug-in Hybrid",
      tankGallonsUS: 11.1,
      sourceName:
        "Ford 2025 Escape Technical Specifications",
      sourceType:
        "manufacturer"
    }),


    /* =====================================================
       NISSAN SENTRA
       ===================================================== */

    createVehicle({
      year: 2025,
      make: "Nissan",
      model: "Sentra",
      body: "Sedan",
      trim: "S / SV / SR",
      engine: "2.0L",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankGallonsUS: 12.4,
      sourceName:
        "Nissan Sentra specifications",
      sourceType:
        "manufacturer"
    }),


    /* =====================================================
       MAZDA3
       ===================================================== */

    createVehicle({
      year: 2025,
      make: "Mazda",
      model: "Mazda3",
      body: "Sedan / Hatchback",
      engine: "2.5L",
      drivetrain: "FWD",
      powertrain: "Gasoline",
      tankLiters: 50.0,
      sourceName:
        "Mazda3 specifications",
      sourceType:
        "manufacturer"
    }),


    createVehicle({
      year: 2025,
      make: "Mazda",
      model: "Mazda3",
      body: "Sedan / Hatchback",
      engine: "2.5L / Turbo",
      drivetrain: "AWD",
      powertrain: "Gasoline",
      tankLiters: 48.0,
      sourceName:
        "Mazda3 specifications",
      sourceType:
        "manufacturer"
    }),


    /* =====================================================
       SUBARU CROSSTREK
       ===================================================== */

    createVehicle({
      year: 2025,
      make: "Subaru",
      model: "Crosstrek",
      body: "SUV",
      engine: "2.0L / 2.5L",
      drivetrain: "AWD",
      powertrain: "Gasoline",
      tankGallonsUS: 16.6,
      sourceName:
        "Subaru Crosstrek specifications",
      sourceType:
        "manufacturer"
    })

  ];


  /* =======================================================
     COMPLETE DISPLAY CATALOG

     These are models GasGo can display in the selector.

     This is intentionally separate from DATABASE.

     A model can therefore appear even when an exact
     capacity has not yet been verified.
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
      "4Runner",
      "Prius",
      "Tundra",
      "Sienna",
      "Crown",
      "Crown Signia",
      "GR Corolla",
      "GR86",
      "GR Supra",
      "bZ4X",
      "Land Cruiser",
      "Sequoia"
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
      "Insight",
      "Fit",
      "CR-Z"
    ],

    Chevrolet: [
      "Sonic",
      "Spark",
      "Cruze",
      "Malibu",
      "Impala",
      "Trax",
      "Trailblazer",
      "Equinox",
      "Traverse",
      "Blazer",
      "Tahoe",
      "Suburban",
      "Silverado",
      "Colorado",
      "Camaro",
      "Corvette",
      "Bolt EV",
      "Bolt EUV",
      "Equinox EV",
      "Blazer EV"
    ],

    Hyundai: [
      "Accent",
      "Elantra",
      "Elantra N",
      "Sonata",
      "Venue",
      "Kona",
      "Kona Electric",
      "Tucson",
      "Santa Fe",
      "Palisade",
      "Santa Cruz",
      "Ioniq",
      "Ioniq 5",
      "Ioniq 6"
    ],

    Kia: [
      "Rio",
      "Forte",
      "K4",
      "K5",
      "Soul",
      "Seltos",
      "Sportage",
      "Sorento",
      "Telluride",
      "Carnival",
      "Niro",
      "EV6",
      "EV9",
      "Stinger"
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
      "Ariya"
    ],

    Ford: [
      "Fiesta",
      "Focus",
      "Fusion",
      "Mustang",
      "EcoSport",
      "Escape",
      "Edge",
      "Explorer",
      "Expedition",
      "Bronco",
      "Bronco Sport",
      "Maverick",
      "Ranger",
      "F-150",
      "F-250",
      "F-350",
      "Mustang Mach-E",
      "F-150 Lightning"
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
      "Avenger"
    ],

    Mitsubishi: [
      "Mirage",
      "Mirage G4",
      "Lancer",
      "Outlander",
      "Outlander Sport",
      "Eclipse Cross",
      "Outlander PHEV"
    ],

    Mazda: [
      "Mazda2",
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
      "MX-30"
    ],

    Subaru: [
      "Impreza",
      "Legacy",
      "Crosstrek",
      "Forester",
      "Outback",
      "WRX",
      "BRZ",
      "Ascent",
      "Solterra"
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
      "ID. Buzz"
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
      "iX"
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
      "EQS"
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
      "e-tron GT"
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
      "TX",
      "RZ"
    ],

    Tesla: [
      "Model 3",
      "Model Y",
      "Model S",
      "Model X",
      "Cybertruck"
    ],

    Acura: [
      "Integra",
      "TLX",
      "ILX",
      "RDX",
      "MDX",
      "ZDX",
      "NSX"
    ],

    GMC: [
      "Terrain",
      "Acadia",
      "Canyon",
      "Sierra",
      "Yukon",
      "Hummer EV"
    ],

    Dodge: [
      "Dart",
      "Charger",
      "Challenger",
      "Journey",
      "Durango",
      "Hornet",
      "Viper"
    ],

    Ram: [
      "1500",
      "2500",
      "3500",
      "ProMaster",
      "ProMaster City"
    ],

    Buick: [
      "Verano",
      "Regal",
      "LaCrosse",
      "Encore",
      "Encore GX",
      "Envision",
      "Enclave",
      "Envista"
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
      "Lyriq"
    ],

    Chrysler: [
      "200",
      "300",
      "Pacifica",
      "Voyager",
      "Town & Country"
    ],

    Infiniti: [
      "Q50",
      "Q60",
      "QX30",
      "QX50",
      "QX55",
      "QX60",
      "QX80"
    ],

    Lincoln: [
      "MKZ",
      "Continental",
      "Corsair",
      "Nautilus",
      "Aviator",
      "Navigator"
    ],

    Mini: [
      "Cooper",
      "Clubman",
      "Countryman"
    ],

    Volvo: [
      "S60",
      "S90",
      "V60",
      "V90",
      "XC40",
      "XC60",
      "XC90",
      "C40",
      "EX30",
      "EX90"
    ],

    Porsche: [
      "718",
      "911",
      "Macan",
      "Cayenne",
      "Panamera",
      "Taycan"
    ],

    LandRover: [
      "Range Rover",
      "Range Rover Sport",
      "Range Rover Velar",
      "Range Rover Evoque",
      "Discovery",
      "Discovery Sport",
      "Defender"
    ]

  };


  /* =======================================================
     MODEL YEAR AVAILABILITY

     IMPORTANT:
     This table controls which catalog models appear for a
     selected year.

     If a model is not listed here, GasGo can still display
     it through the broad catalog fallback.
     ======================================================= */

  Vehicles.MODEL_YEARS = {

    Chevrolet: {

      Sonic: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],

      Spark: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],

      Cruze: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],

      Malibu: [
        1997, 1998, 1999, 2000, 2001, 2002, 2003,
        2004, 2005, 2006, 2007, 2008, 2009, 2010,
        2011, 2012, 2013, 2014, 2015, 2016, 2017,
        2018, 2019, 2020, 2021, 2022, 2023, 2024,
        2025
      ],

      Trax: [
        2015, 2016, 2017, 2018, 2019,
        2020, 2021, 2022, 2024, 2025,
        2026
      ],

      Equinox: [
        2005, 2006, 2007, 2008, 2009, 2010,
        2011, 2012, 2013, 2014, 2015, 2016,
        2017, 2018, 2019, 2020, 2021, 2022,
        2023, 2024, 2025, 2026
      ],

      Traverse: [
        2009, 2010, 2011, 2012, 2013, 2014,
        2015, 2016, 2017, 2018, 2019, 2020,
        2021, 2022, 2023, 2024, 2025, 2026
      ],

      Tahoe: [
        1996, 1997, 1998, 1999, 2000, 2001,
        2002, 2003, 2004, 2005, 2006, 2007,
        2008, 2009, 2010, 2011, 2012, 2013,
        2014, 2015, 2016, 2017, 2018, 2019,
        2020, 2021, 2022, 2023, 2024, 2025,
        2026
      ],

      Silverado: [
        1999, 2000, 2001, 2002, 2003, 2004,
        2005, 2006, 2007, 2008, 2009, 2010,
        2011, 2012, 2013, 2014, 2015, 2016,
        2017, 2018, 2019, 2020, 2021, 2022,
        2023, 2024, 2025, 2026
      ]

    },


    Toyota: {

      Corolla: [
        1996, 1997, 1998, 1999, 2000, 2001,
        2002, 2003, 2004, 2005, 2006, 2007,
        2008, 2009, 2010, 2011, 2012, 2013,
        2014, 2015, 2016, 2017, 2018, 2019,
        2020, 2021, 2022, 2023, 2024, 2025,
        2026
      ],

      Camry: [
        1996, 1997, 1998, 1999, 2000, 2001,
        2002, 2003, 2004, 2005, 2006, 2007,
        2008, 2009, 2010, 2011, 2012, 2013,
        2014, 2015, 2016, 2017, 2018, 2019,
        2020, 2021, 2022, 2023, 2024, 2025,
        2026
      ],

      RAV4: [
        1996, 1997, 1998, 1999, 2000, 2001,
        2002, 2003, 2004, 2005, 2006, 2007,
        2008, 2009, 2010, 2011, 2012, 2013,
        2014, 2015, 2016, 2017, 2018, 2019,
        2020, 2021, 2022, 2023, 2024, 2025,
        2026
      ],

      Prius: [
        2001, 2002, 2003, 2004, 2005, 2006,
        2007, 2008, 2009, 2010, 2011, 2012,
        2013, 2014, 2015, 2016, 2017, 2018,
        2019, 2020, 2021, 2022, 2023, 2024,
        2025, 2026
      ],

      Tacoma: [
        1996, 1997, 1998, 1999, 2000, 2001,
        2002, 2003, 2004, 2005, 2006, 2007,
        2008, 2009, 2010, 2011, 2012, 2013,
        2014, 2015, 2016, 2017, 2018, 2019,
        2020, 2021, 2022, 2023, 2024, 2025,
        2026
      ]

    },


    Honda: {

      Civic: [
        1996, 1997, 1998, 1999, 2000, 2001,
        2002, 2003, 2004, 2005, 2006, 2007,
        2008, 2009, 2010, 2011, 2012, 2013,
        2014, 2015, 2016, 2017, 2018, 2019,
        2020, 2021, 2022, 2023, 2024, 2025,
        2026
      ],

      Accord: [
        1996, 1997, 1998, 1999, 2000, 2001,
        2002, 2003, 2004, 2005, 2006, 2007,
        2008, 2009, 2010, 2011, 2012, 2013,
        2014, 2015, 2016, 2017, 2018, 2019,
        2020, 2021, 2022, 2023, 2024, 2025,
        2026
      ],

      "CR-V": [
        1997, 1998, 1999, 2000, 2001, 2002,
        2003, 2004, 2005, 2006, 2007, 2008,
        2009, 2010, 2011, 2012, 2013, 2014,
        2015, 2016, 2017, 2018, 2019, 2020,
        2021, 2022, 2023, 2024, 2025, 2026
      ],

      Pilot: [
        2003, 2004, 2005, 2006, 2007, 2008,
        2009, 2010, 2011, 2012, 2013, 2014,
        2015, 2016, 2017, 2018, 2019, 2020,
        2021, 2022, 2023, 2024, 2025, 2026
      ]

    },


    Ford: {

      Escape: [
        2001, 2002, 2003, 2004, 2005, 2006,
        2007, 2008, 2009, 2010, 2011, 2012,
        2013, 2014, 2015, 2016, 2017, 2018,
        2019, 2020, 2021, 2022, 2023, 2024,
        2025
      ],

      Mustang: [
        1996, 1997, 1998, 1999, 2000, 2001,
        2002, 2003, 2004, 2005, 2006, 2007,
        2008, 2009, 2010, 2011, 2012, 2013,
        2014, 2015, 2016, 2017, 2018, 2019,
        2020, 2021, 2022, 2023, 2024, 2025,
        2026
      ],

      Explorer: [
        1996, 1997, 1998, 1999, 2000, 2001,
        2002, 2003, 2004, 2005, 2006, 2007,
        2008, 2009, 2010, 2011, 2012, 2013,
        2014, 2015, 2016, 2017, 2018, 2019,
        2020, 2021, 2022, 2023, 2024, 2025,
        2026
      ],

      "F-150": [
        1996, 1997, 1998, 1999, 2000, 2001,
        2002, 2003, 2004, 2005, 2006, 2007,
        2008, 2009, 2010, 2011, 2012, 2013,
        2014, 2015, 2016, 2017, 2018, 2019,
        2020, 2021, 2022, 2023, 2024, 2025,
        2026
      ]

    }

  };


  /* =======================================================
     PUBLIC HELPERS
     ======================================================= */

  Vehicles.normalize =
    normalize;


  Vehicles.gallonsToLiters =
    gallonsToLiters;


  Vehicles.litersToGallons =
    litersToGallons;


  Vehicles.getAll = function () {

    return [
      ...Vehicles.DATABASE
    ];

  };


  Vehicles.getYears = function () {

    const years = [];


    /*
      GasGo Link targets OBD-II-era vehicles.

      Include 1996 through next model year in the UI,
      even if the specification database does not yet
      contain every single vehicle.
    */

    const currentYear =
      new Date().getFullYear();


    const maximumYear =
      Math.max(
        currentYear + 1,
        2027
      );


    for (
      let year = 1996;
      year <= maximumYear;
      year++
    ) {

      years.push(year);

    }


    return years.sort(
      (a, b) => b - a
    );

  };


  Vehicles.getMakes = function (
    year = null
  ) {

    /*
      V4 FIX:
      Do NOT restrict the make selector only to verified
      specification records.

      All catalog makes remain available.
    */

    return alphabetical(
      Object.keys(
        Vehicles.CATALOG
      )
    );

  };


  Vehicles.modelAvailableInYear =
  function (
    year,
    make,
    model
  ) {

    const makeTable =
      Vehicles.MODEL_YEARS[
        make
      ];


    if (
      !makeTable ||
      !makeTable[model]
    ) {

      /*
        Unknown year mapping.

        We return true so the user can still select
        the model and manually enter capacity.
      */

      return true;

    }


    return makeTable[
      model
    ].includes(
      Number(year)
    );

  };


  Vehicles.getModels = function (
    year,
    make
  ) {

    const catalogModels =
      Vehicles.CATALOG[
        make
      ] || [];


    /*
      First use year-specific availability where we
      actually have it.
    */

    const mappedModels =
      catalogModels.filter(
        model =>
          Vehicles.modelAvailableInYear(
            year,
            make,
            model
          )
      );


    /*
      Also include any verified database models for this
      year/make in case they are not yet in CATALOG.
    */

    const verifiedModels =
      Vehicles.DATABASE
        .filter(
          vehicle =>
            normalize(
              vehicle.make
            ) ===
              normalize(make) &&
            yearMatches(
              vehicle,
              year
            )
        )
        .map(
          vehicle =>
            vehicle.model
        );


    const result =
      unique([
        ...mappedModels,
        ...verifiedModels
      ]);


    /*
      Never let the selector collapse to a single verified
      model just because DATABASE is incomplete.
    */

    if (!result.length) {

      return alphabetical(
        unique([
          ...catalogModels,
          "Other"
        ])
      );

    }


    if (
      !result.includes(
        "Other"
      )
    ) {

      result.push(
        "Other"
      );

    }


    return alphabetical(
      result
    );

  };


  Vehicles.getConfigurations =
  function (
    year,
    make,
    model
  ) {

    return Vehicles.DATABASE
      .filter(
        vehicle => {

          return (
            yearMatches(
              vehicle,
              year
            ) &&

            normalize(
              vehicle.make
            ) ===
              normalize(make) &&

            normalize(
              vehicle.model
            ) ===
              normalize(model)
          );

        }
      );

  };


  Vehicles.getConfigurationLabel =
  function (
    vehicle
  ) {

    if (!vehicle) {
      return "";
    }


    const parts = [];


    if (
      vehicle.body
    ) {
      parts.push(
        vehicle.body
      );
    }


    if (
      vehicle.trim
    ) {
      parts.push(
        vehicle.trim
      );
    }


    if (
      vehicle.engine
    ) {
      parts.push(
        vehicle.engine
      );
    }


    if (
      vehicle.transmission
    ) {
      parts.push(
        vehicle.transmission
      );
    }


    if (
      vehicle.drivetrain
    ) {
      parts.push(
        vehicle.drivetrain
      );
    }


    return unique(
      parts
    ).join(" • ");

  };


  /* =======================================================
     END PART 1/2

     PART 2 starts with:

     Vehicles.find = function (options = {}) {
     ======================================================= */

   /* =======================================================
     FIND EXACT VEHICLE
     ======================================================= */

  Vehicles.find = function (
    options = {}
  ) {

    const year =
      Number(options.year);

    const make =
      normalize(
        options.make
      );

    const model =
      normalize(
        options.model
      );

    const configuration =
      normalize(
        options.configuration
      );

    const trim =
      normalize(
        options.trim
      );

    const engine =
      normalize(
        options.engine
      );

    const drivetrain =
      normalize(
        options.drivetrain
      );

    const transmission =
      normalize(
        options.transmission
      );


    if (
      !Number.isFinite(year) ||
      !make ||
      !model ||
      model === "other"
    ) {

      return null;

    }


    let candidates =
      Vehicles.DATABASE.filter(
        vehicle => {

          return (
            yearMatches(
              vehicle,
              year
            ) &&

            normalize(
              vehicle.make
            ) === make &&

            normalize(
              vehicle.model
            ) === model
          );

        }
      );


    if (
      candidates.length === 0
    ) {

      return null;

    }


    /*
      If only one verified configuration exists,
      GasGo can safely use it automatically.
    */

    if (
      candidates.length === 1
    ) {

      return candidates[0];

    }


    /*
      Exact configuration label.
    */

    if (configuration) {

      const exactConfiguration =
        candidates.find(
          vehicle => {

            return (
              normalize(
                Vehicles.getConfigurationLabel(
                  vehicle
                )
              ) ===
              configuration
            );

          }
        );


      if (
        exactConfiguration
      ) {

        return exactConfiguration;

      }

    }


    /*
      Optional field-by-field matching.
    */

    if (trim) {

      const filtered =
        candidates.filter(
          vehicle =>
            normalize(
              vehicle.trim
            ) === trim
        );


      if (
        filtered.length === 1
      ) {

        return filtered[0];

      }


      if (
        filtered.length > 1
      ) {

        candidates =
          filtered;

      }

    }


    if (engine) {

      const filtered =
        candidates.filter(
          vehicle =>
            normalize(
              vehicle.engine
            ) === engine
        );


      if (
        filtered.length === 1
      ) {

        return filtered[0];

      }


      if (
        filtered.length > 1
      ) {

        candidates =
          filtered;

      }

    }


    if (drivetrain) {

      const filtered =
        candidates.filter(
          vehicle =>
            normalize(
              vehicle.drivetrain
            ) === drivetrain
        );


      if (
        filtered.length === 1
      ) {

        return filtered[0];

      }


      if (
        filtered.length > 1
      ) {

        candidates =
          filtered;

      }

    }


    if (transmission) {

      const filtered =
        candidates.filter(
          vehicle =>
            normalize(
              vehicle.transmission
            ) === transmission
        );


      if (
        filtered.length === 1
      ) {

        return filtered[0];

      }


      if (
        filtered.length > 1
      ) {

        candidates =
          filtered;

      }

    }


    /*
      IMPORTANT:

      If multiple verified configurations remain,
      DO NOT guess.

      app.js will ask the user to choose the correct
      configuration.
    */

    return null;

  };


  /* =======================================================
     LOOKUP

     This is the main function used by app.js.
     ======================================================= */

  Vehicles.lookup = function (
    options = {}
  ) {

    const year =
      Number(options.year);

    const make =
      String(
        options.make || ""
      ).trim();

    const model =
      String(
        options.model || ""
      ).trim();

    const configuration =
      String(
        options.configuration || ""
      ).trim();


    if (
      !Number.isFinite(year) ||
      !make ||
      !model
    ) {

      return {

        found: false,

        exact: false,

        requiresConfiguration:
          false,

        vehicle: null,

        configurations: [],

        tankLiters: null,

        tankGallonsUS: null,

        batteryKWh: null,

        powertrain: null,

        verified: false,

        sourceName: "",

        message:
          "Select a year, make and model."

      };

    }


    if (
      normalize(model) ===
      "other"
    ) {

      return {

        found: false,

        exact: false,

        requiresConfiguration:
          false,

        vehicle: null,

        configurations: [],

        tankLiters: null,

        tankGallonsUS: null,

        batteryKWh: null,

        powertrain: null,

        verified: false,

        sourceName: "",

        message:
          "Exact specification unavailable. Enter capacity manually."

      };

    }


    const configurations =
      Vehicles.getConfigurations(
        year,
        make,
        model
      );


    /*
      Vehicle is in catalog, but GasGo does not yet
      have a verified capacity record for it.
    */

    if (
      configurations.length === 0
    ) {

      return {

        found: false,

        exact: false,

        requiresConfiguration:
          false,

        vehicle: null,

        configurations: [],

        tankLiters: null,

        tankGallonsUS: null,

        batteryKWh: null,

        powertrain: null,

        verified: false,

        sourceName: "",

        message:
          "Specification unavailable — enter capacity manually."

      };

    }


    /*
      If several records exist and the driver has not
      selected one, GasGo must not guess.
    */

    if (
      configurations.length > 1 &&
      !configuration
    ) {

      return {

        found: true,

        exact: false,

        requiresConfiguration:
          true,

        vehicle: null,

        configurations,

        tankLiters: null,

        tankGallonsUS: null,

        batteryKWh: null,

        powertrain: null,

        verified: false,

        sourceName: "",

        message:
          "Select the correct vehicle configuration."

      };

    }


    const vehicle =
      Vehicles.find({
        year,
        make,
        model,
        configuration,
        trim:
          options.trim,
        engine:
          options.engine,
        drivetrain:
          options.drivetrain,
        transmission:
          options.transmission
      });


    if (!vehicle) {

      return {

        found: true,

        exact: false,

        requiresConfiguration:
          configurations.length > 1,

        vehicle: null,

        configurations,

        tankLiters: null,

        tankGallonsUS: null,

        batteryKWh: null,

        powertrain: null,

        verified: false,

        sourceName: "",

        message:
          configurations.length > 1
            ? "Select the correct vehicle configuration."
            : "Exact specification unavailable — enter capacity manually."

      };

    }


    return {

      found: true,

      exact: true,

      requiresConfiguration:
        false,

      vehicle,

      configurations,

      tankLiters:
        vehicle.tankLiters ??
        null,

      tankGallonsUS:
        vehicle.tankGallonsUS ??
        null,

      batteryKWh:
        vehicle.batteryKWh ??
        null,

      powertrain:
        vehicle.powertrain ||
        null,

      verified:
        vehicle.verified ===
        true,

      sourceName:
        vehicle.sourceName ||
        "",

      sourceType:
        vehicle.sourceType ||
        "",

      message:
        vehicle.tankLiters != null
          ? "Tank capacity detected."
          : vehicle.batteryKWh != null
            ? "Battery capacity detected."
            : "Vehicle specification detected."

    };

  };


  /* =======================================================
     GET TANK CAPACITY
     ======================================================= */

  Vehicles.getTankCapacity =
  function (
    options = {}
  ) {

    const result =
      Vehicles.lookup(
        options
      );


    if (
      !result.exact
    ) {

      return null;

    }


    const liters =
      Number(
        result.tankLiters
      );


    return (
      Number.isFinite(liters) &&
      liters > 0
    )
      ? liters
      : null;

  };


  /* =======================================================
     GET TANK GALLONS
     ======================================================= */

  Vehicles.getTankGallons =
  function (
    options = {}
  ) {

    const result =
      Vehicles.lookup(
        options
      );


    if (
      !result.exact
    ) {

      return null;

    }


    const gallons =
      Number(
        result.tankGallonsUS
      );


    if (
      Number.isFinite(gallons) &&
      gallons > 0
    ) {

      return gallons;

    }


    const liters =
      Number(
        result.tankLiters
      );


    if (
      Number.isFinite(liters) &&
      liters > 0
    ) {

      return litersToGallons(
        liters
      );

    }


    return null;

  };


  /* =======================================================
     GET POWERTRAIN
     ======================================================= */

  Vehicles.getPowertrain =
  function (
    options = {}
  ) {

    const result =
      Vehicles.lookup(
        options
      );


    return (
      result.exact
        ? result.powertrain
        : null
    );

  };


  /* =======================================================
     GET BATTERY CAPACITY
     ======================================================= */

  Vehicles.getBatteryCapacity =
  function (
    options = {}
  ) {

    const result =
      Vehicles.lookup(
        options
      );


    if (
      !result.exact
    ) {

      return null;

    }


    const battery =
      Number(
        result.batteryKWh
      );


    return (
      Number.isFinite(battery) &&
      battery > 0
    )
      ? battery
      : null;

  };


  /* =======================================================
     SEARCH
     ======================================================= */

  Vehicles.search = function (
    query = ""
  ) {

    const value =
      normalize(query);


    if (!value) {

      return [
        ...Vehicles.DATABASE
      ];

    }


    return Vehicles.DATABASE
      .filter(
        vehicle => {

          const text = [

            vehicle.year,

            vehicle.make,

            vehicle.model,

            vehicle.body,

            vehicle.trim,

            vehicle.engine,

            vehicle.transmission,

            vehicle.drivetrain,

            vehicle.powertrain

          ]
            .filter(Boolean)
            .join(" ");


          return normalize(
            text
          ).includes(
            value
          );

        }
      );

  };


  /* =======================================================
     DISPLAY NAME
     ======================================================= */

  Vehicles.getDisplayName =
  function (
    vehicle
  ) {

    if (!vehicle) {
      return "";
    }


    const year =
      vehicle.year ??
      vehicle.startYear ??
      "";


    return [
      year,
      vehicle.make,
      vehicle.model
    ]
      .filter(Boolean)
      .join(" ");

  };


  /* =======================================================
     FORMAT CAPACITY
     ======================================================= */

  Vehicles.formatCapacity =
  function (
    vehicle
  ) {

    if (!vehicle) {
      return "Not available";
    }


    if (
      vehicle.powertrain ===
        "Electric" &&
      vehicle.batteryKWh != null
    ) {

      return (
        Number(
          vehicle.batteryKWh
        ).toFixed(1) +
        " kWh"
      );

    }


    if (
      vehicle.tankLiters != null
    ) {

      return (
        Number(
          vehicle.tankLiters
        ).toFixed(1) +
        " L"
      );

    }


    return "Not available";

  };


  /* =======================================================
     CATALOG SEARCH

     Searches every model that GasGo can display,
     not only verified capacity records.
     ======================================================= */

  Vehicles.searchCatalog =
  function (
    query = ""
  ) {

    const value =
      normalize(query);


    const results = [];


    Object.entries(
      Vehicles.CATALOG
    ).forEach(
      ([make, models]) => {

        models.forEach(
          model => {

            const text =
              normalize(
                make +
                " " +
                model
              );


            if (
              !value ||
              text.includes(value)
            ) {

              results.push({
                make,
                model
              });

            }

          }
        );

      }
    );


    return results;

  };


  /* =======================================================
     CATALOG STATUS
     ======================================================= */

  Vehicles.hasCatalogModel =
  function (
    make,
    model
  ) {

    const models =
      Vehicles.CATALOG[
        make
      ];


    if (
      !Array.isArray(models)
    ) {
      return false;
    }


    return models.some(
      item =>
        normalize(item) ===
        normalize(model)
    );

  };


  /* =======================================================
     HAS VERIFIED SPECIFICATION
     ======================================================= */

  Vehicles.hasVerifiedSpec =
  function (
    year,
    make,
    model
  ) {

    return (
      Vehicles.getConfigurations(
        year,
        make,
        model
      ).length > 0
    );

  };


  /* =======================================================
     GET MODEL INFO
     ======================================================= */

  Vehicles.getModelInfo =
  function (
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

      year:
        Number(year),

      make,

      model,

      catalog:
        Vehicles.hasCatalogModel(
          make,
          model
        ),

      availableInYear:
        Vehicles.modelAvailableInYear(
          year,
          make,
          model
        ),

      verified:
        configurations.length >
        0,

      configurations,

      requiresConfiguration:
        configurations.length >
        1

    };

  };


  /* =======================================================
     VALIDATE DATABASE
     ======================================================= */

  Vehicles.validateDatabase =
  function () {

    const errors = [];

    const warnings = [];


    Vehicles.DATABASE
      .forEach(
        (vehicle, index) => {

          if (
            !vehicle.make
          ) {

            errors.push(
              "Record " +
              index +
              ": missing make"
            );

          }


          if (
            !vehicle.model
          ) {

            errors.push(
              "Record " +
              index +
              ": missing model"
            );

          }


          if (
            !vehicle.year &&
            !vehicle.startYear
          ) {

            errors.push(
              "Record " +
              index +
              ": missing year"
            );

          }


          if (
            vehicle.tankLiters != null
          ) {

            const liters =
              Number(
                vehicle.tankLiters
              );


            if (
              !Number.isFinite(liters) ||
              liters <= 0
            ) {

              errors.push(
                "Record " +
                index +
                ": invalid tankLiters"
              );

            }

          }


          if (
            vehicle.tankGallonsUS != null
          ) {

            const gallons =
              Number(
                vehicle.tankGallonsUS
              );


            if (
              !Number.isFinite(gallons) ||
              gallons <= 0
            ) {

              errors.push(
                "Record " +
                index +
                ": invalid tankGallonsUS"
              );

            }

          }


          if (
            vehicle.batteryKWh != null
          ) {

            const battery =
              Number(
                vehicle.batteryKWh
              );


            if (
              !Number.isFinite(battery) ||
              battery <= 0
            ) {

              errors.push(
                "Record " +
                index +
                ": invalid batteryKWh"
              );

            }

          }


          if (
            !vehicle.sourceName
          ) {

            warnings.push(
              "Record " +
              index +
              ": sourceName missing"
            );

          }

        }
      );


    /*
      Duplicate configuration detection.
    */

    const seen =
      new Map();


    Vehicles.DATABASE
      .forEach(
        (vehicle, index) => {

          const key =
            normalize(
              [
                vehicle.year,
                vehicle.make,
                vehicle.model,
                Vehicles.getConfigurationLabel(
                  vehicle
                )
              ].join("|")
            );


          if (
            seen.has(key)
          ) {

            warnings.push(
              "Possible duplicate records: " +
              seen.get(key) +
              " and " +
              index
            );

          } else {

            seen.set(
              key,
              index
            );

          }

        }
      );


    return {

      valid:
        errors.length === 0,

      errors,

      warnings,

      records:
        Vehicles.DATABASE.length

    };

  };


  /* =======================================================
     STATISTICS
     ======================================================= */

  Vehicles.getStats =
  function () {

    const catalogMakes =
      Object.keys(
        Vehicles.CATALOG
      );


    const catalogModels =
      Object.values(
        Vehicles.CATALOG
      ).reduce(
        (total, models) =>
          total +
          models.length,
        0
      );


    const verifiedMakes =
      unique(
        Vehicles.DATABASE.map(
          vehicle =>
            vehicle.make
        )
      );


    const verifiedModels =
      unique(
        Vehicles.DATABASE.map(
          vehicle =>
            vehicle.make +
            "|" +
            vehicle.model
        )
      );


    const verifiedYears =
      unique(
        Vehicles.DATABASE.flatMap(
          vehicle =>
            vehicleYears(
              vehicle
            )
        )
      );


    const fuelRecords =
      Vehicles.DATABASE.filter(
        vehicle =>
          vehicle.tankLiters !=
          null
      ).length;


    const electricRecords =
      Vehicles.DATABASE.filter(
        vehicle =>
          vehicle.batteryKWh !=
          null
      ).length;


    return {

      version:
        Vehicles.VERSION,

      catalogMakes:
        catalogMakes.length,

      catalogModels,

      verifiedRecords:
        Vehicles.DATABASE.length,

      verifiedMakes:
        verifiedMakes.length,

      verifiedModels:
        verifiedModels.length,

      verifiedYears:
        verifiedYears.length,

      fuelRecords,

      electricRecords

    };

  };


  /* =======================================================
     DEBUG
     ======================================================= */

  Vehicles.debug =
  function () {

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
      "Example 2015 Chevrolet models:",
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


    console.log(
      "2025 Toyota Corolla configurations:",
      Vehicles.getConfigurations(
        2025,
        "Toyota",
        "Corolla"
      )
    );


    console.log(
      "2025 Ford Escape configurations:",
      Vehicles.getConfigurations(
        2025,
        "Ford",
        "Escape"
      )
    );


    console.groupEnd();


    return {
      stats,
      validation
    };

  };


  /* =======================================================
     COMPATIBILITY ALIASES
     ======================================================= */

  Vehicles.getTankLiters =
  function (
    options = {}
  ) {

    return Vehicles.getTankCapacity(
      options
    );

  };


  Vehicles.getBatteryKWh =
  function (
    options = {}
  ) {

    return Vehicles.getBatteryCapacity(
      options
    );

  };


  /* =======================================================
     FREEZE NOTHING

     The database remains extensible so additional verified
     records can be added later without rebuilding the
     entire GasGo architecture.
     ======================================================= */


  /* =======================================================
     READY
     ======================================================= */

  const validation =
    Vehicles.validateDatabase();


  if (
    !validation.valid
  ) {

    console.error(
      "GasGo vehicles.js database validation failed:",
      validation.errors
    );

  }


  console.log(
    "GasGo vehicles.js v" +
    Vehicles.VERSION +
    " loaded 🚗⛽"
  );


})();
