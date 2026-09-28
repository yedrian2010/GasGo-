"use strict";

/* =========================================================
   GASGO VEHICLE DATABASE
   Version 3.0.0

   PURPOSE
   ---------------------------------------------------------
   - Store verified vehicle fuel-tank / battery information.
   - Support year ranges.
   - Support multiple configurations for the same model.
   - NEVER guess between configurations.
   - Allow GasGo to fall back to manual entry.

   IMPORTANT
   ---------------------------------------------------------
   A vehicle may have a different tank depending on:
   - model year
   - generation
   - engine
   - drivetrain
   - hybrid / PHEV configuration
   - market

   GasGo therefore only auto-fills capacity when the
   database can identify one unambiguous configuration.
   ========================================================= */

(function () {

  window.GasGoVehicles =
    window.GasGoVehicles || {};

  const Vehicles =
    window.GasGoVehicles;


  Vehicles.VERSION = "3.0.0";


  const GAL_TO_LITERS =
    3.785411784;


  /* =======================================================
     HELPERS
     ======================================================= */

  function normalize(value) {

    return String(
      value ?? ""
    )
      .trim()
      .toLowerCase();

  }


  function gallonsToLiters(
    gallons
  ) {

    const value =
      Number(gallons);

    if (
      !Number.isFinite(value)
    ) {
      return null;
    }

    return Number(
      (
        value *
        GAL_TO_LITERS
      ).toFixed(2)
    );

  }


  function litersToGallons(
    liters
  ) {

    const value =
      Number(liters);

    if (
      !Number.isFinite(value)
    ) {
      return null;
    }

    return Number(
      (
        value /
        GAL_TO_LITERS
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


  function alphabetical(
    values
  ) {

    return [
      ...values
    ].sort(
      (a, b) =>
        String(a).localeCompare(
          String(b)
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
      return false;
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
        vehicle.yearStart
      );

    const end =
      Number(
        vehicle.yearEnd
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
        vehicle.yearStart
      );

    const end =
      Number(
        vehicle.yearEnd
      );


    if (
      !Number.isFinite(start) ||
      !Number.isFinite(end)
    ) {

      return [];

    }


    const years = [];


    for (
      let year = start;
      year <= end;
      year++
    ) {

      years.push(year);

    }


    return years;

  }


  function createVehicle(
    data
  ) {

    const vehicle = {
      market: "US",
      verified: true,
      ...data
    };


    if (
      vehicle.tankGallonsUS != null &&
      vehicle.tankLiters == null
    ) {

      vehicle.tankLiters =
        gallonsToLiters(
          vehicle.tankGallonsUS
        );

    }


    if (
      vehicle.tankLiters != null &&
      vehicle.tankGallonsUS == null
    ) {

      vehicle.tankGallonsUS =
        litersToGallons(
          vehicle.tankLiters
        );

    }


    return vehicle;

  }


  /* =======================================================
     VERIFIED VEHICLE DATABASE
     =======================================================

     This database is intentionally conservative.

     GasGo does NOT assign a capacity to a vehicle unless
     the configuration represented here is known.

     More verified records can be added without changing
     app.js.
     ======================================================= */

  Vehicles.DATABASE = [


    /* =====================================================
       CHEVROLET
       ===================================================== */

    createVehicle({

      year: 2015,

      make:
        "Chevrolet",

      model:
        "Sonic",

      configuration:
        "Gasoline • 1.4L Turbo / 1.8L",

      trim:
        "Gasoline",

      engine:
        "1.4L Turbo / 1.8L",

      drivetrain:
        "FWD",

      powertrain:
        "Gasoline",

      tankLiters:
        46.0,

      body:
        "Sedan / Hatchback",

      sourceName:
        "2015 Chevrolet Sonic Owner Manual",

      sourceType:
        "manufacturer-manual"

    }),


    createVehicle({

      year: 2020,

      make:
        "Chevrolet",

      model:
        "Sonic",

      configuration:
        "Gasoline • 1.4L Turbo",

      trim:
        "Gasoline",

      engine:
        "1.4L Turbo",

      drivetrain:
        "FWD",

      powertrain:
        "Gasoline",

      tankGallonsUS:
        12.1,

      body:
        "Sedan / Hatchback",

      sourceName:
        "Chevrolet Sonic specifications",

      sourceType:
        "manufacturer-specification"

    }),



    /* =====================================================
       TOYOTA
       ===================================================== */

    createVehicle({

      year: 2023,

      make:
        "Toyota",

      model:
        "Corolla",

      configuration:
        "Gasoline • FWD",

      trim:
        "LE / SE / XSE",

      engine:
        "Gasoline",

      drivetrain:
        "FWD",

      powertrain:
        "Gasoline",

      tankGallonsUS:
        13.2,

      body:
        "Sedan",

      sourceName:
        "2023 Toyota Corolla eBrochure",

      sourceType:
        "manufacturer-brochure"

    }),


    createVehicle({

      year: 2023,

      make:
        "Toyota",

      model:
        "Corolla",

      configuration:
        "Hybrid",

      trim:
        "Hybrid",

      engine:
        "Hybrid",

      drivetrain:
        "FWD / AWD",

      powertrain:
        "Hybrid",

      tankGallonsUS:
        11.3,

      body:
        "Sedan",

      sourceName:
        "2023 Toyota Corolla eBrochure",

      sourceType:
        "manufacturer-brochure"

    }),


    createVehicle({

      year: 2025,

      make:
        "Toyota",

      model:
        "Corolla",

      configuration:
        "Gasoline • FWD",

      trim:
        "Gasoline",

      engine:
        "2.0L",

      drivetrain:
        "FWD",

      powertrain:
        "Gasoline",

      tankGallonsUS:
        13.2,

      body:
        "Sedan",

      sourceName:
        "2025 Toyota Corolla specifications",

      sourceType:
        "manufacturer-specification"

    }),


    createVehicle({

      year: 2025,

      make:
        "Toyota",

      model:
        "Corolla Cross",

      configuration:
        "Gasoline • 2WD",

      trim:
        "Gasoline",

      engine:
        "2.0L",

      drivetrain:
        "2WD",

      powertrain:
        "Gasoline",

      tankLiters:
        47.0,

      tankGallonsUS:
        12.4,

      body:
        "SUV",

      sourceName:
        "2025 Toyota Corolla Cross Owner Manual",

      sourceType:
        "manufacturer-manual"

    }),


    createVehicle({

      year: 2025,

      make:
        "Toyota",

      model:
        "Corolla Cross",

      configuration:
        "Gasoline • AWD",

      trim:
        "Gasoline",

      engine:
        "2.0L",

      drivetrain:
        "AWD",

      powertrain:
        "Gasoline",

      tankLiters:
        50.0,

      tankGallonsUS:
        13.2,

      body:
        "SUV",

      sourceName:
        "2025 Toyota Corolla Cross Owner Manual",

      sourceType:
        "manufacturer-manual"

    }),



    /* =====================================================
       HYUNDAI
       ===================================================== */

    createVehicle({

      year: 2025,

      make:
        "Hyundai",

      model:
        "Elantra",

      configuration:
        "Gasoline • 2.0L",

      trim:
        "SE / SEL / SEL Convenience / Limited",

      engine:
        "2.0L",

      drivetrain:
        "FWD",

      powertrain:
        "Gasoline",

      tankGallonsUS:
        12.4,

      body:
        "Sedan",

      sourceName:
        "2025 Hyundai Elantra specifications",

      sourceType:
        "manufacturer-specification"

    }),


    createVehicle({

      year: 2025,

      make:
        "Hyundai",

      model:
        "Elantra",

      configuration:
        "N Line • 1.6L Turbo",

      trim:
        "N Line",

      engine:
        "1.6L Turbo",

      drivetrain:
        "FWD",

      powertrain:
        "Gasoline",

      tankGallonsUS:
        12.4,

      body:
        "Sedan",

      sourceName:
        "2025 Hyundai Elantra specifications",

      sourceType:
        "manufacturer-specification"

    }),


    createVehicle({

      year: 2025,

      make:
        "Hyundai",

      model:
        "Elantra",

      configuration:
        "Hybrid",

      trim:
        "Blue / SEL Sport / Limited",

      engine:
        "1.6L Hybrid",

      drivetrain:
        "FWD",

      powertrain:
        "Hybrid",

      tankGallonsUS:
        11.0,

      body:
        "Sedan",

      sourceName:
        "2025 Hyundai Elantra Hybrid specifications",

      sourceType:
        "manufacturer-specification"

    }),



    /* =====================================================
       FORD
       ===================================================== */

    createVehicle({

      year: 2025,

      make:
        "Ford",

      model:
        "Escape",

      configuration:
        "1.5L EcoBoost • FWD",

      trim:
        "Gasoline",

      engine:
        "1.5L EcoBoost",

      drivetrain:
        "FWD",

      powertrain:
        "Gasoline",

      tankGallonsUS:
        14.8,

      body:
        "SUV",

      sourceName:
        "2025 Ford Escape Technical Specifications",

      sourceType:
        "manufacturer-specification"

    }),


    createVehicle({

      year: 2025,

      make:
        "Ford",

      model:
        "Escape",

      configuration:
        "1.5L EcoBoost • AWD",

      trim:
        "Gasoline",

      engine:
        "1.5L EcoBoost",

      drivetrain:
        "AWD",

      powertrain:
        "Gasoline",

      tankGallonsUS:
        15.7,

      body:
        "SUV",

      sourceName:
        "2025 Ford Escape Technical Specifications",

      sourceType:
        "manufacturer-specification"

    }),


    createVehicle({

      year: 2025,

      make:
        "Ford",

      model:
        "Escape",

      configuration:
        "2.0L EcoBoost • AWD",

      trim:
        "Gasoline",

      engine:
        "2.0L EcoBoost",

      drivetrain:
        "AWD",

      powertrain:
        "Gasoline",

      tankGallonsUS:
        15.7,

      body:
        "SUV",

      sourceName:
        "2025 Ford Escape Technical Specifications",

      sourceType:
        "manufacturer-specification"

    }),


    createVehicle({

      year: 2025,

      make:
        "Ford",

      model:
        "Escape",

      configuration:
        "Hybrid",

      trim:
        "Hybrid",

      engine:
        "2.5L Hybrid",

      drivetrain:
        "FWD / AWD",

      powertrain:
        "Hybrid",

      tankGallonsUS:
        14.3,

      body:
        "SUV",

      sourceName:
        "2025 Ford Escape Technical Specifications",

      sourceType:
        "manufacturer-specification"

    }),


    createVehicle({

      year: 2025,

      make:
        "Ford",

      model:
        "Escape",

      configuration:
        "Plug-in Hybrid",

      trim:
        "PHEV",

      engine:
        "2.5L Plug-in Hybrid",

      drivetrain:
        "FWD",

      powertrain:
        "Plug-in Hybrid",

      tankGallonsUS:
        11.1,

      body:
        "SUV",

      sourceName:
        "2025 Ford Escape Technical Specifications",

      sourceType:
        "manufacturer-specification"

    }),



    /* =====================================================
       HONDA
       ===================================================== */

    createVehicle({

      year: 2024,

      make:
        "Honda",

      model:
        "Civic",

      configuration:
        "Sedan • Gasoline • CVT",

      trim:
        "Gasoline",

      engine:
        "Gasoline",

      drivetrain:
        "FWD",

      powertrain:
        "Gasoline",

      tankGallonsUS:
        12.39,

      body:
        "Sedan",

      sourceName:
        "Honda Civic specifications",

      sourceType:
        "manufacturer-specification"

    }),


    createVehicle({

      year: 2025,

      make:
        "Honda",

      model:
        "Civic",

      configuration:
        "Hatchback • Gasoline • CVT",

      trim:
        "Gasoline",

      engine:
        "Gasoline",

      drivetrain:
        "FWD",

      powertrain:
        "Gasoline",

      tankGallonsUS:
        12.39,

      body:
        "Hatchback",

      sourceName:
        "2025 Honda Civic Hatchback Owner Manual",

      sourceType:
        "manufacturer-manual"

    }),


    createVehicle({

      year: 2025,

      make:
        "Honda",

      model:
        "Civic",

      configuration:
        "Hatchback • Gasoline • Manual",

      trim:
        "Gasoline",

      engine:
        "Gasoline",

      drivetrain:
        "FWD",

      powertrain:
        "Gasoline",

      tankGallonsUS:
        12.4,

      body:
        "Hatchback",

      sourceName:
        "2025 Honda Civic Hatchback Owner Manual",

      sourceType:
        "manufacturer-manual"

    }),


    createVehicle({

      year: 2025,

      make:
        "Honda",

      model:
        "Civic",

      configuration:
        "Sedan • Hybrid",

      trim:
        "Hybrid",

      engine:
        "Hybrid",

      drivetrain:
        "FWD",

      powertrain:
        "Hybrid",

      tankGallonsUS:
        10.6,

      body:
        "Sedan",

      sourceName:
        "2025 Honda Civic specifications",

      sourceType:
        "manufacturer-specification"

    }),



    /* =====================================================
       NISSAN
       ===================================================== */

    createVehicle({

      year: 2025,

      make:
        "Nissan",

      model:
        "Sentra",

      configuration:
        "Gasoline • S / SV / SR",

      trim:
        "S / SV / SR",

      engine:
        "2.0L",

      drivetrain:
        "FWD",

      powertrain:
        "Gasoline",

      tankGallonsUS:
        12.4,

      body:
        "Sedan",

      sourceName:
        "2025 Nissan Sentra specifications",

      sourceType:
        "manufacturer-specification"

    }),



    /* =====================================================
       MAZDA
       ===================================================== */

    createVehicle({

      year: 2025,

      make:
        "Mazda",

      model:
        "Mazda3",

      configuration:
        "2.5L • FWD",

      trim:
        "FWD",

      engine:
        "2.5L",

      drivetrain:
        "FWD",

      powertrain:
        "Gasoline",

      tankLiters:
        50.0,

      tankGallonsUS:
        13.2,

      body:
        "Sedan / Hatchback",

      sourceName:
        "2025 Mazda3 Owner Manual",

      sourceType:
        "manufacturer-manual"

    }),


    createVehicle({

      year: 2025,

      make:
        "Mazda",

      model:
        "Mazda3",

      configuration:
        "2.5L / Turbo • AWD",

      trim:
        "AWD",

      engine:
        "2.5L / 2.5L Turbo",

      drivetrain:
        "AWD",

      powertrain:
        "Gasoline",

      tankLiters:
        48.0,

      tankGallonsUS:
        12.7,

      body:
        "Sedan / Hatchback",

      sourceName:
        "2025 Mazda3 Owner Manual",

      sourceType:
        "manufacturer-manual"

    }),



    /* =====================================================
       SUBARU
       ===================================================== */

    createVehicle({

      year: 2025,

      make:
        "Subaru",

      model:
        "Crosstrek",

      configuration:
        "Gasoline • AWD",

      trim:
        "Base / Premium / Sport / Limited / Wilderness",

      engine:
        "2.0L / 2.5L",

      drivetrain:
        "AWD",

      powertrain:
        "Gasoline",

      tankGallonsUS:
        16.6,

      body:
        "SUV",

      sourceName:
        "2025 Subaru Crosstrek Brochure",

      sourceType:
        "manufacturer-brochure"

    })

  ];


  /* =======================================================
     FALLBACK CATALOG

     These are NOT capacity specifications.

     They allow GasGo's UI to continue offering popular
     makes/models even when an exact tank specification
     hasn't been verified in the database yet.
     ======================================================= */

  Vehicles.CATALOG = {

    Toyota: [
      "Corolla",
      "Camry",
      "RAV4",
      "Corolla Cross",
      "Highlander",
      "Tacoma",
      "4Runner",
      "Prius",
      "Tundra"
    ],

    Honda: [
      "Civic",
      "Accord",
      "CR-V",
      "HR-V",
      "Pilot",
      "Ridgeline",
      "Odyssey"
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
      "Suburban"
    ],

    Hyundai: [
      "Accent",
      "Elantra",
      "Sonata",
      "Venue",
      "Kona",
      "Tucson",
      "Santa Fe",
      "Ioniq 5"
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
      "EV6"
    ],

    Nissan: [
      "Versa",
      "Sentra",
      "Altima",
      "Kicks",
      "Rogue",
      "Pathfinder",
      "Frontier",
      "Leaf"
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
      "Mustang Mach-E"
    ],

    Jeep: [
      "Wrangler",
      "Compass",
      "Renegade",
      "Cherokee",
      "Grand Cherokee",
      "Gladiator"
    ],

    Mitsubishi: [
      "Mirage",
      "Outlander",
      "Outlander Sport",
      "Eclipse Cross",
      "Outlander PHEV"
    ],

    Mazda: [
      "Mazda3",
      "CX-30",
      "CX-5",
      "CX-50",
      "CX-90",
      "MX-5 Miata"
    ],

    Subaru: [
      "Impreza",
      "Legacy",
      "Crosstrek",
      "Forester",
      "Outback",
      "WRX"
    ],

    Volkswagen: [
      "Jetta",
      "Golf",
      "Taos",
      "Tiguan",
      "Atlas",
      "ID.4"
    ],

    BMW: [
      "3 Series",
      "4 Series",
      "5 Series",
      "X1",
      "X3",
      "X5",
      "i4",
      "iX"
    ],

    "Mercedes-Benz": [
      "A-Class",
      "C-Class",
      "E-Class",
      "CLA",
      "GLA",
      "GLC",
      "GLE",
      "EQS"
    ],

    Audi: [
      "A3",
      "A4",
      "A5",
      "Q3",
      "Q5",
      "Q7",
      "e-tron"
    ],

    Lexus: [
      "IS",
      "ES",
      "UX",
      "NX",
      "RX",
      "GX"
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
      "RDX",
      "MDX"
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
      "Charger",
      "Challenger",
      "Durango",
      "Hornet"
    ],

    Ram: [
      "1500",
      "2500",
      "3500",
      "ProMaster"
    ]

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


  Vehicles.getAll =
  function () {

    return [
      ...Vehicles.DATABASE
    ];

  };


  /* =======================================================
     YEARS
     ======================================================= */

  Vehicles.getYears =
  function () {

    const years = [];


    Vehicles.DATABASE
      .forEach(vehicle => {

        years.push(
          ...vehicleYears(
            vehicle
          )
        );

      });


    /*
      GasGo supports manual vehicle setup from
      1996 onward even when the exact vehicle isn't
      in the verified specification database.
    */

    const currentYear =
      Math.max(
        new Date().getFullYear() + 1,
        2027
      );


    for (
      let year = 1996;
      year <= currentYear;
      year++
    ) {

      years.push(year);

    }


    return unique(years)
      .sort(
        (a, b) =>
          b - a
      );

  };


  /* =======================================================
     MAKES
     ======================================================= */

  Vehicles.getMakes =
  function (
    year = null
  ) {

    const catalogMakes =
      Object.keys(
        Vehicles.CATALOG
      );


    if (!year) {

      return alphabetical(
        unique([
          ...catalogMakes,
          ...Vehicles.DATABASE.map(
            vehicle =>
              vehicle.make
          )
        ])
      );

    }


    /*
      We intentionally keep catalog makes visible even if
      GasGo doesn't yet have an exact specification for the
      selected year. This allows manual fallback.
    */

    return alphabetical(
      unique([
        ...catalogMakes,
        ...Vehicles.DATABASE
          .filter(
            vehicle =>
              yearMatches(
                vehicle,
                year
              )
          )
          .map(
            vehicle =>
              vehicle.make
          )
      ])
    );

  };


  /* =======================================================
     MODELS
     ======================================================= */

  Vehicles.getModels =
  function (
    year,
    make
  ) {

    const targetMake =
      normalize(make);


    const catalogMake =
      Object.keys(
        Vehicles.CATALOG
      ).find(
        item =>
          normalize(item) ===
          targetMake
      );


    const catalogModels =
      catalogMake
        ? Vehicles.CATALOG[
            catalogMake
          ]
        : [];


    const verifiedModels =
      Vehicles.DATABASE
        .filter(
          vehicle =>
            normalize(
              vehicle.make
            ) ===
              targetMake &&
            (
              !year ||
              yearMatches(
                vehicle,
                year
              )
            )
        )
        .map(
          vehicle =>
            vehicle.model
        );


    return alphabetical(
      unique([
        ...catalogModels,
        ...verifiedModels,
        "Other"
      ])
    );

  };


  /* =======================================================
     CONFIGURATIONS
     ======================================================= */

  Vehicles.getConfigurations =
  function (
    year,
    make,
    model
  ) {

    return Vehicles.DATABASE
      .filter(
        vehicle =>

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

  };


  Vehicles.getConfigurationLabel =
  function (
    vehicle
  ) {

    if (!vehicle) {
      return "";
    }


    if (
      vehicle.configuration
    ) {

      return String(
        vehicle.configuration
      );

    }


    return unique([

      vehicle.trim,

      vehicle.engine,

      vehicle.drivetrain

    ]).join(" • ");

  };


  /* =======================================================
     FIND EXACT VEHICLE
     ======================================================= */

  Vehicles.find =
  function ({
    year,
    make,
    model,
    configuration = "",
    trim = "",
    engine = "",
    drivetrain = ""
  } = {}) {


    const candidates =
      Vehicles.getConfigurations(
        year,
        make,
        model
      );


    if (
      !candidates.length
    ) {
      return null;
    }


    /*
      If only one configuration exists for that exact
      year/make/model, it is safe to use automatically.
    */

    if (
      candidates.length === 1
    ) {

      return candidates[0];

    }


    const targetConfiguration =
      normalize(
        configuration
      );


    if (
      targetConfiguration
    ) {

      const exact =
        candidates.find(
          vehicle =>

            normalize(
              Vehicles.getConfigurationLabel(
                vehicle
              )
            ) ===
            targetConfiguration

        );


      if (exact) {
        return exact;
      }

    }


    /*
      Optional secondary matching.
    */

    const filters = {

      trim:
        normalize(trim),

      engine:
        normalize(engine),

      drivetrain:
        normalize(
          drivetrain
        )

    };


    const filtered =
      candidates.filter(
        vehicle => {


          if (
            filters.trim &&
            normalize(
              vehicle.trim
            ) !==
            filters.trim
          ) {
            return false;
          }


          if (
            filters.engine &&
            normalize(
              vehicle.engine
            ) !==
            filters.engine
          ) {
            return false;
          }


          if (
            filters.drivetrain &&
            normalize(
              vehicle.drivetrain
            ) !==
            filters.drivetrain
          ) {
            return false;
          }


          return true;

        }
      );


    /*
      Never guess when more than one configuration remains.
    */

    if (
      filtered.length === 1
    ) {

      return filtered[0];

    }


    return null;

  };


  /* =======================================================
     LOOKUP
     ======================================================= */

  Vehicles.lookup =
  function (
    options = {}
  ) {

    const configurations =
      Vehicles.getConfigurations(

        options.year,

        options.make,

        options.model

      );


    if (
      !configurations.length
    ) {

      return {

        found: false,

        exact: false,

        requiresConfiguration:
          false,

        vehicle:
          null,

        configurations:
          [],

        tankLiters:
          null,

        tankGallonsUS:
          null,

        batteryKWh:
          null,

        message:
          "Exact vehicle specification is not available. Enter capacity manually."

      };

    }


    const vehicle =
      Vehicles.find(
        options
      );


    if (!vehicle) {

      return {

        found: true,

        exact: false,

        requiresConfiguration:
          configurations.length > 1,

        vehicle:
          null,

        configurations,

        tankLiters:
          null,

        tankGallonsUS:
          null,

        batteryKWh:
          null,

        message:
          "Select the vehicle configuration to load the correct capacity."

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

      message:
        vehicle.powertrain ===
          "Electric"
          ? "Vehicle specification detected."
          : "Fuel tank specification detected."

    };

  };


  /* =======================================================
     TANK CAPACITY
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


    return (
      Number.isFinite(
        Number(
          result.tankLiters
        )
      )
        ? Number(
            result.tankLiters
          )
        : null
    );

  };


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


    return (
      Number.isFinite(
        Number(
          result.tankGallonsUS
        )
      )
        ? Number(
            result.tankGallonsUS
          )
        : null
    );

  };


  /* =======================================================
     POWERTRAIN
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
        ? (
            result.vehicle
              ?.powertrain ||
            null
          )
        : null
    );

  };


  /* =======================================================
     BATTERY
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


    const value =
      Number(
        result.batteryKWh
      );


    return (
      Number.isFinite(value)
        ? value
        : null
    );

  };


  /* =======================================================
     SEARCH
     ======================================================= */

  Vehicles.search =
  function (
    query
  ) {

    const text =
      normalize(query);


    if (!text) {

      return Vehicles.getAll();

    }


    return Vehicles.DATABASE
      .filter(
        vehicle => {

          const searchable = [

            vehicle.year,

            vehicle.yearStart,

            vehicle.yearEnd,

            vehicle.make,

            vehicle.model,

            vehicle.configuration,

            vehicle.trim,

            vehicle.engine,

            vehicle.drivetrain,

            vehicle.powertrain,

            vehicle.body

          ]
            .filter(
              value =>
                value != null
            )
            .join(" ")
            .toLowerCase();


          return searchable.includes(
            text
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


    const yearText =
      vehicle.year
        ? vehicle.year
        : (
            vehicle.yearStart ===
            vehicle.yearEnd
              ? vehicle.yearStart
              : vehicle.yearStart +
                "–" +
                vehicle.yearEnd
          );


    return [
      yearText,
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
      return "—";
    }


    if (
      vehicle.powertrain ===
      "Electric"
    ) {

      if (
        Number.isFinite(
          Number(
            vehicle.batteryKWh
          )
        )
      ) {

        return (
          Number(
            vehicle.batteryKWh
          ).toFixed(1) +
          " kWh"
        );

      }


      return "Battery";

    }


    if (
      Number.isFinite(
        Number(
          vehicle.tankLiters
        )
      )
    ) {

      return (
        Number(
          vehicle.tankLiters
        ).toFixed(1) +
        " L"
      );

    }


    return "—";

  };


  /* =======================================================
     VALIDATION
     ======================================================= */

  Vehicles.validateDatabase =
  function () {

    const issues = [];


    Vehicles.DATABASE
      .forEach(
        (
          vehicle,
          index
        ) => {


          if (
            !vehicle.make
          ) {

            issues.push(
              "Record " +
              index +
              ": missing make"
            );

          }


          if (
            !vehicle.model
          ) {

            issues.push(
              "Record " +
              index +
              ": missing model"
            );

          }


          if (
            !vehicle.year &&
            (
              !vehicle.yearStart ||
              !vehicle.yearEnd
            )
          ) {

            issues.push(
              "Record " +
              index +
              ": missing year"
            );

          }


          if (
            !vehicle.powertrain
          ) {

            issues.push(
              "Record " +
              index +
              ": missing powertrain"
            );

          }


          if (
            vehicle.powertrain !==
              "Electric" &&
            !Number.isFinite(
              Number(
                vehicle.tankLiters
              )
            )
          ) {

            issues.push(
              "Record " +
              index +
              ": invalid tank capacity"
            );

          }


          if (
            vehicle.powertrain ===
              "Electric" &&
            vehicle.batteryKWh != null &&
            !Number.isFinite(
              Number(
                vehicle.batteryKWh
              )
            )
          ) {

            issues.push(
              "Record " +
              index +
              ": invalid battery capacity"
            );

          }

        }
      );


    return {

      valid:
        issues.length === 0,

      records:
        Vehicles.DATABASE.length,

      issues

    };

  };


  /* =======================================================
     DATABASE STATS
     ======================================================= */

  Vehicles.getStats =
  function () {

    const makes =
      unique(
        Vehicles.DATABASE.map(
          vehicle =>
            vehicle.make
        )
      );


    const models =
      unique(
        Vehicles.DATABASE.map(
          vehicle =>
            vehicle.make +
            "::" +
            vehicle.model
        )
      );


    const years =
      unique(
        Vehicles.DATABASE.flatMap(
          vehicle =>
            vehicleYears(
              vehicle
            )
        )
      );


    return {

      version:
        Vehicles.VERSION,

      verifiedRecords:
        Vehicles.DATABASE.length,

      verifiedMakes:
        makes.length,

      verifiedModels:
        models.length,

      verifiedYears:
        years.length,

      catalogMakes:
        Object.keys(
          Vehicles.CATALOG
        ).length

    };

  };


  /* =======================================================
     DEBUG
     ======================================================= */

  Vehicles.debug =
  function () {

    console.table(
      Vehicles.DATABASE.map(
        vehicle => ({

          year:
            vehicle.year ||
            (
              vehicle.yearStart +
              "-" +
              vehicle.yearEnd
            ),

          make:
            vehicle.make,

          model:
            vehicle.model,

          configuration:
            Vehicles.getConfigurationLabel(
              vehicle
            ),

          powertrain:
            vehicle.powertrain,

          tankLiters:
            vehicle.tankLiters,

          tankGallons:
            vehicle.tankGallonsUS,

          verified:
            vehicle.verified

        })
      )
    );


    console.log(
      "GasGo vehicle database validation:",
      Vehicles.validateDatabase()
    );


    console.log(
      "GasGo vehicle database stats:",
      Vehicles.getStats()
    );

  };


  /* =======================================================
     READY
     ======================================================= */

  console.log(
    "GasGo vehicles.js v" +
    Vehicles.VERSION +
    " loaded 🚗⛽"
  );

})();
