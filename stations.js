/* =========================================================
   GASGO — STATIONS.JS
   Version 5.3
   Fuel + EV Charging + Fast Cache + Overpass Fallback
   ========================================================= */

"use strict";


/* =========================================================
   GLOBAL DATA OBJECT
   ========================================================= */

window.GasGoData =
  window.GasGoData || {};

const GasGoData =
  window.GasGoData;


GasGoData.VERSION =
  "5.3.0";


/* =========================================================
   PUERTO RICO
   ========================================================= */

GasGoData.PR_CENTER = {

  lat: 18.2208,

  lon: -66.5901,

  zoom: 9

};


/*
  Approximate bounding box covering Puerto Rico.

  South, West, North, East
*/

GasGoData.PR_BBOX = {

  south: 17.82,

  west: -67.35,

  north: 18.55,

  east: -65.18

};


/* =========================================================
   CACHE
   ========================================================= */

GasGoData.CACHE = {

  key: "gasgoEnergyStopsV53",

  timestampKey:
    "gasgoEnergyStopsV53Timestamp",

  /*
    Cached locations can be used immediately for 24 hours.

    GasGo can still refresh them in the background later.
  */

  maxAge:
    24 * 60 * 60 * 1000

};


/* =========================================================
   PR DEMO FUEL PRICE REFERENCES
   ========================================================= */

GasGoData.BRAND_PRICES = {

  "76": {

    regular: 1.15,
    premium: 1.29,
    diesel: 1.44

  },


  "American": {

    regular: 1.17,
    premium: 1.28,
    diesel: 1.43

  },


  "Bita's": {

    regular: 1.16,
    premium: 1.30,
    diesel: 1.44

  },


  "EcoMaxx": {

    regular: 1.16,
    premium: 1.30,
    diesel: 1.45

  },


  "Gulf": {

    regular: 1.16,
    premium: 1.30,
    diesel: 1.45

  },


  "Mobil": {

    regular: 1.17,
    premium: 1.34,
    diesel: 1.45

  },


  "Phillips 66": {

    regular: 1.15,
    premium: 1.29,
    diesel: 1.44

  },


  "Puma": {

    regular: 1.17,
    premium: 1.34,
    diesel: 1.44

  },


  "Shell": {

    regular: 1.17,
    premium: 1.34,
    diesel: 1.45

  },


  "Sunoco": {

    regular: 1.17,
    premium: 1.36,
    diesel: 1.45

  },


  "Texaco": {

    regular: 1.17,
    premium: 1.34,
    diesel: 1.44

  },


  "T-Express": {

    regular: 1.15,
    premium: 1.30,
    diesel: 1.41

  },


  "Total": {

    regular: 1.18,
    premium: 1.34,
    diesel: 1.44

  },


  "Ultra Top Fuel": {

    regular: 1.14,
    premium: 1.29,
    diesel: 1.43

  },


  "Independent": {

    regular: 1.16,
    premium: 1.31,
    diesel: 1.44

  }

};


/* =========================================================
   OVERPASS SERVERS
   ========================================================= */

/*
  GasGo does not depend on only one public Overpass server.

  If one is busy or unavailable, the next one is tried.
*/

GasGoData.OVERPASS_ENDPOINTS = [

  "https://overpass.kumi.systems/api/interpreter",

  "https://overpass-api.de/api/interpreter"

];


/*
  Browser timeout.

  We intentionally keep this lower than before so an
  unavailable server cannot leave GasGo looking frozen.
*/

GasGoData.OVERPASS_TIMEOUT =
  7000;


/* =========================================================
   FALLBACK FUEL LOCATIONS
   ========================================================= */

/*
  These are DEMO locations.

  They exist only so the prototype remains usable when
  OpenStreetMap / Overpass is temporarily unavailable.

  They must never be presented as verified real stations.
*/

GasGoData.FALLBACK_STATIONS = [

  {
    name: "GasGo Demo • San Juan",
    brand: "Puma",
    municipality: "San Juan",
    lat: 18.4037,
    lon: -66.0636
  },

  {
    name: "GasGo Demo • Bayamón",
    brand: "Shell",
    municipality: "Bayamón",
    lat: 18.3986,
    lon: -66.1557
  },

  {
    name: "GasGo Demo • Guaynabo",
    brand: "Total",
    municipality: "Guaynabo",
    lat: 18.3575,
    lon: -66.1110
  },

  {
    name: "GasGo Demo • Carolina",
    brand: "Puma",
    municipality: "Carolina",
    lat: 18.3808,
    lon: -65.9574
  },

  {
    name: "GasGo Demo • Caguas",
    brand: "Gulf",
    municipality: "Caguas",
    lat: 18.2341,
    lon: -66.0485
  },

  {
    name: "GasGo Demo • Trujillo Alto",
    brand: "Texaco",
    municipality: "Trujillo Alto",
    lat: 18.3547,
    lon: -66.0074
  },

  {
    name: "GasGo Demo • Toa Baja",
    brand: "Puma",
    municipality: "Toa Baja",
    lat: 18.4438,
    lon: -66.2596
  },

  {
    name: "GasGo Demo • Dorado",
    brand: "Shell",
    municipality: "Dorado",
    lat: 18.4588,
    lon: -66.2677
  },

  {
    name: "GasGo Demo • Vega Baja",
    brand: "Total",
    municipality: "Vega Baja",
    lat: 18.4444,
    lon: -66.3877
  },

  {
    name: "GasGo Demo • Manatí",
    brand: "Puma",
    municipality: "Manatí",
    lat: 18.4274,
    lon: -66.4921
  },

  {
    name: "GasGo Demo • Arecibo",
    brand: "Gulf",
    municipality: "Arecibo",
    lat: 18.4724,
    lon: -66.7157
  },

  {
    name: "GasGo Demo • Aguadilla",
    brand: "Shell",
    municipality: "Aguadilla",
    lat: 18.4274,
    lon: -67.1541
  },

  {
    name: "GasGo Demo • Mayagüez",
    brand: "Puma",
    municipality: "Mayagüez",
    lat: 18.2013,
    lon: -67.1396
  },

  {
    name: "GasGo Demo • San Germán",
    brand: "Total",
    municipality: "San Germán",
    lat: 18.0816,
    lon: -67.0449
  },

  {
    name: "GasGo Demo • Ponce",
    brand: "Shell",
    municipality: "Ponce",
    lat: 18.0111,
    lon: -66.6141
  },

  {
    name: "GasGo Demo • Juana Díaz",
    brand: "Puma",
    municipality: "Juana Díaz",
    lat: 18.0525,
    lon: -66.5066
  },

  {
    name: "GasGo Demo • Coamo",
    brand: "Gulf",
    municipality: "Coamo",
    lat: 18.0799,
    lon: -66.3579
  },

  {
    name: "GasGo Demo • Cayey",
    brand: "Total",
    municipality: "Cayey",
    lat: 18.1119,
    lon: -66.1660
  },

  {
    name: "GasGo Demo • Humacao",
    brand: "Puma",
    municipality: "Humacao",
    lat: 18.1497,
    lon: -65.8274
  },

  {
    name: "GasGo Demo • Fajardo",
    brand: "Shell",
    municipality: "Fajardo",
    lat: 18.3258,
    lon: -65.6524
  },

  {
    name: "GasGo Demo • Río Grande",
    brand: "Total",
    municipality: "Río Grande",
    lat: 18.3790,
    lon: -65.8382
  },

  {
    name: "GasGo Demo • Yabucoa",
    brand: "Puma",
    municipality: "Yabucoa",
    lat: 18.0505,
    lon: -65.8793
  },

  {
    name: "GasGo Demo • Guayama",
    brand: "Gulf",
    municipality: "Guayama",
    lat: 17.9841,
    lon: -66.1138
  },

  {
    name: "GasGo Demo • Barceloneta",
    brand: "Puma",
    municipality: "Barceloneta",
    lat: 18.4505,
    lon: -66.5385
  }

];


/* =========================================================
   FALLBACK EV LOCATIONS
   ========================================================= */

/*
  These are also DEMO locations.

  Real EV charging locations are requested from OSM using
  amenity=charging_station.
*/

GasGoData.FALLBACK_EV = [

  {
    name: "GasGo EV Demo • San Juan",
    brand: "EV Charging",
    municipality: "San Juan",
    lat: 18.4060,
    lon: -66.0640
  },

  {
    name: "GasGo EV Demo • Bayamón",
    brand: "EV Charging",
    municipality: "Bayamón",
    lat: 18.3998,
    lon: -66.1582
  },

  {
    name: "GasGo EV Demo • Carolina",
    brand: "EV Charging",
    municipality: "Carolina",
    lat: 18.3818,
    lon: -65.9600
  },

  {
    name: "GasGo EV Demo • Caguas",
    brand: "EV Charging",
    municipality: "Caguas",
    lat: 18.2360,
    lon: -66.0497
  },

  {
    name: "GasGo EV Demo • Ponce",
    brand: "EV Charging",
    municipality: "Ponce",
    lat: 18.0128,
    lon: -66.6162
  },

  {
    name: "GasGo EV Demo • Mayagüez",
    brand: "EV Charging",
    municipality: "Mayagüez",
    lat: 18.2030,
    lon: -67.1410
  }

];


/* =========================================================
   HTML ESCAPE
   ========================================================= */

GasGoData.escapeHTML = function (
  value
) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

};


/* =========================================================
   BASIC HELPERS
   ========================================================= */

GasGoData.clamp = function (
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


GasGoData.roundPrice = function (
  value
) {

  return Math.round(
    Number(value) * 100
  ) / 100;

};


GasGoData.hashString = function (
  value
) {

  const string =
    String(value || "");


  let hash = 0;


  for (
    let index = 0;
    index < string.length;
    index++
  ) {

    hash =
      (
        (
          hash << 5
        ) -
        hash
      ) +
      string.charCodeAt(index);


    hash |= 0;

  }


  return Math.abs(hash);

};


/* =========================================================
   BRAND DETECTION
   ========================================================= */

GasGoData.detectBrand = function (
  tags = {}
) {

  const combined =
    [
      tags.brand,
      tags.operator,
      tags.name
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();


  if (
    combined.includes("puma")
  ) {

    return "Puma";

  }


  if (
    combined.includes("shell")
  ) {

    return "Shell";

  }


  if (
    combined.includes("total")
  ) {

    return "Total";

  }


  if (
    combined.includes("gulf")
  ) {

    return "Gulf";

  }


  if (
    combined.includes("texaco")
  ) {

    return "Texaco";

  }


  if (
    combined.includes("mobil") ||
    combined.includes("exxon")
  ) {

    return "Mobil";

  }


  if (
    combined.includes("sunoco")
  ) {

    return "Sunoco";

  }


  if (
    combined.includes(
      "phillips 66"
    ) ||
    combined.includes(
      "phillips66"
    )
  ) {

    return "Phillips 66";

  }


  if (
    combined.includes("ecomaxx")
  ) {

    return "EcoMaxx";

  }


  if (
    combined.includes("american")
  ) {

    return "American";

  }


  if (
    combined.includes("t-express") ||
    combined.includes("t express")
  ) {

    return "T-Express";

  }


  if (
    combined.includes(
      "ultra top"
    )
  ) {

    return "Ultra Top Fuel";

  }


  if (
    combined.includes("bita")
  ) {

    return "Bita's";

  }


  if (
    combined === "76" ||
    combined.includes(
      "76 gas"
    )
  ) {

    return "76";

  }


  if (tags.brand) {

    return String(
      tags.brand
    );

  }


  if (tags.operator) {

    return String(
      tags.operator
    );

  }


  return "Independent";

};


/* =========================================================
   MUNICIPALITY
   ========================================================= */

GasGoData.detectMunicipality = function (
  tags = {}
) {

  return (
    tags["addr:city"] ||
    tags["addr:municipality"] ||
    tags.municipality ||
    tags.place ||
    tags["is_in:city"] ||
    tags["is_in"] ||
    ""
  );

};


/* =========================================================
   LOCATION NAME
   ========================================================= */

GasGoData.getStationName = function (
  tags = {},
  type = "fuel"
) {

  if (tags.name) {

    return String(tags.name);

  }


  if (tags.operator) {

    return String(tags.operator);

  }


  if (tags.brand) {

    return String(tags.brand);

  }


  return type === "ev"
    ?
    "EV Charging Station"
    :
    "Fuel Station";

};


/* =========================================================
   COORDINATES
   ========================================================= */

GasGoData.getElementCoordinates =
function (
  element
) {

  if (
    Number.isFinite(
      Number(element.lat)
    ) &&
    Number.isFinite(
      Number(element.lon)
    )
  ) {

    return {

      lat:
        Number(element.lat),

      lon:
        Number(element.lon)

    };

  }


  if (
    element.center &&
    Number.isFinite(
      Number(
        element.center.lat
      )
    ) &&
    Number.isFinite(
      Number(
        element.center.lon
      )
    )
  ) {

    return {

      lat:
        Number(
          element.center.lat
        ),

      lon:
        Number(
          element.center.lon
        )

    };

  }


  return null;

};


/* =========================================================
   DEMO FUEL PRICES
   ========================================================= */

GasGoData.getStationPrices = function (
  station
) {

  /*
    EV chargers do not have gasoline prices.
  */

  if (
    station &&
    station.type === "ev"
  ) {

    return {

      regular: null,

      premium: null,

      diesel: null

    };

  }


  const brand =
    station?.brand ||
    "Independent";


  const base =
    GasGoData.BRAND_PRICES[
      brand
    ] ||
    GasGoData.BRAND_PRICES
      .Independent;


  const hash =
    GasGoData.hashString(
      station?.id ||
      station?.name ||
      brand
    );


  const variations =
    [
      -0.02,
      -0.01,
      0,
      0.01
    ];


  const variation =
    variations[
      hash %
      variations.length
    ];


  return {

    regular:
      GasGoData.roundPrice(
        GasGoData.clamp(
          base.regular +
          variation,
          1.13,
          1.20
        )
      ),

    premium:
      GasGoData.roundPrice(
        GasGoData.clamp(
          base.premium +
          variation,
          1.27,
          1.37
        )
      ),

    diesel:
      GasGoData.roundPrice(
        GasGoData.clamp(
          base.diesel +
          variation,
          1.40,
          1.46
        )
      )

  };

};


/* =========================================================
   EV INFORMATION
   ========================================================= */

GasGoData.getEVInfo = function (
  tags = {}
) {

  const sockets = [];


  const socketLabels = {

    "socket:type1":
      "J1772",

    "socket:type1_combo":
      "CCS1",

    "socket:type2":
      "Type 2",

    "socket:type2_combo":
      "CCS2",

    "socket:chademo":
      "CHAdeMO",

    "socket:tesla_supercharger":
      "Tesla Supercharger",

    "socket:tesla_destination":
      "Tesla Destination",

    "socket:nacs":
      "NACS"

  };


  Object.entries(
    socketLabels
  )
    .forEach(
      ([key, label]) => {

        const value =
          tags[key];


        if (
          value &&
          value !== "no" &&
          value !== "0"
        ) {

          sockets.push(label);

        }

      }
    );


  /*
    OSM can store power in different fields depending on
    how the charger was mapped.
  */

  const power =
    tags["charging_station:output"] ||
    tags.output ||
    tags["socket:type1:output"] ||
    tags["socket:type1_combo:output"] ||
    tags["socket:type2:output"] ||
    tags["socket:type2_combo:output"] ||
    tags["socket:chademo:output"] ||
    tags["socket:tesla_supercharger:output"] ||
    tags["socket:nacs:output"] ||
    "";


  return {

    operator:
      tags.operator ||
      tags.brand ||
      "",

    network:
      tags.network ||
      "",

    capacity:
      tags.capacity ||
      "",

    sockets,

    power,

    access:
      tags.access ||
      "",

    fee:
      tags.fee ||
      "",

    openingHours:
      tags.opening_hours ||
      ""

  };

};


/* =========================================================
   NORMALIZE OSM ELEMENT
   ========================================================= */

GasGoData.normalizeElement =
function (
  element
) {

  const coordinates =
    GasGoData
      .getElementCoordinates(
        element
      );


  if (!coordinates) {

    return null;

  }


  const tags =
    element.tags || {};


  const type =
    tags.amenity ===
      "charging_station"
      ?
      "ev"
      :
      "fuel";


  const brand =
    type === "ev"
      ?
      (
        tags.operator ||
        tags.brand ||
        tags.network ||
        "EV Charging"
      )
      :
      GasGoData.detectBrand(
        tags
      );


  const station = {

    id:
      "osm-" +
      element.type +
      "-" +
      element.id,

    osmType:
      element.type,

    osmId:
      element.id,

    type,

    name:
      GasGoData
        .getStationName(
          tags,
          type
        ),

    brand,

    municipality:
      GasGoData
        .detectMunicipality(
          tags
        ),

    lat:
      coordinates.lat,

    lon:
      coordinates.lon,

    source:
      "OpenStreetMap",

    demo:
      false,

    tags

  };


  if (
    type === "fuel"
  ) {

    station.prices =
      GasGoData
        .getStationPrices(
          station
        );

  }

  else {

    station.ev =
      GasGoData.getEVInfo(
        tags
      );

  }


  return station;

};


/* =========================================================
   NORMALIZE FALLBACK
   ========================================================= */

GasGoData.normalizeFallback =
function (
  station,
  index,
  type = "fuel"
) {

  const normalized = {

    id:
      "demo-" +
      type +
      "-" +
      index,

    type,

    name:
      station.name,

    brand:
      station.brand,

    municipality:
      station.municipality,

    lat:
      Number(
        station.lat
      ),

    lon:
      Number(
        station.lon
      ),

    source:
      "GasGo demo location",

    demo:
      true,

    tags: {}

  };


  if (
    type === "fuel"
  ) {

    normalized.prices =
      GasGoData.getStationPrices(
        normalized
      );

  }

  else {

    normalized.ev = {

      operator:
        "Demo EV Network",

      network:
        "",

      capacity:
        "",

      sockets:
        [],

      power:
        "",

      access:
        "",

      fee:
        "",

      openingHours:
        ""

    };

  }


  return normalized;

};


/* =========================================================
   FALLBACK LIST
   ========================================================= */

GasGoData.getFallbackStations =
function () {

  const fuel =
    GasGoData
      .FALLBACK_STATIONS
      .map(
        (station, index) =>
          GasGoData
            .normalizeFallback(
              station,
              index,
              "fuel"
            )
      );


  const ev =
    GasGoData
      .FALLBACK_EV
      .map(
        (station, index) =>
          GasGoData
            .normalizeFallback(
              station,
              index,
              "ev"
            )
      );


  return [
    ...fuel,
    ...ev
  ];

};


/* =========================================================
   OVERPASS QUERY
   ========================================================= */

GasGoData.buildOverpassQuery =
function () {

  const box =
    GasGoData.PR_BBOX;


  /*
    nwr = nodes + ways + relations.

    qt asks Overpass for a faster geographic ordering.

    Both fuel and EV charging locations are returned in one
    request.
  */

  return `

[out:json][timeout:20];

(

  nwr
    ["amenity"="fuel"]
    (${box.south},${box.west},${box.north},${box.east});

  nwr
    ["amenity"="charging_station"]
    (${box.south},${box.west},${box.north},${box.east});

);

out center tags qt;

  `.trim();

};


/* =========================================================
   FETCH WITH TIMEOUT
   ========================================================= */

GasGoData.fetchWithTimeout =
async function (
  endpoint,
  query,
  timeout =
    GasGoData
      .OVERPASS_TIMEOUT
) {

  const controller =
    new AbortController();


  const timer =
    setTimeout(
      () => {

        controller.abort();

      },
      timeout
    );


  try {

    const body =
      new URLSearchParams();

    body.set(
      "data",
      query
    );


    const response =
      await fetch(
        endpoint,
        {

          method:
            "POST",

          headers: {

            "Content-Type":
              "application/x-www-form-urlencoded;charset=UTF-8"

          },

          body:
            body.toString(),

          signal:
            controller.signal

        }
      );


    if (!response.ok) {

      throw new Error(
        "Overpass HTTP " +
        response.status
      );

    }


    return await response.json();

  }

  finally {

    clearTimeout(
      timer
    );

  }

};


/* =========================================================
   REMOVE DUPLICATES
   ========================================================= */

GasGoData.removeDuplicates =
function (
  stations
) {

  const seen =
    new Set();


  return stations.filter(
    station => {

      const key =
        [
          station.type,
          String(
            station.name || ""
          )
            .trim()
            .toLowerCase(),
          Number(
            station.lat
          ).toFixed(5),
          Number(
            station.lon
          ).toFixed(5)
        ]
          .join("|");


      if (
        seen.has(key)
      ) {

        return false;

      }


      seen.add(key);

      return true;

    }
  );

};


/* =========================================================
   CACHE SAVE
   ========================================================= */

GasGoData.saveCache =
function (
  stations
) {

  try {

    if (
      !Array.isArray(stations) ||
      stations.length === 0
    ) {

      return false;

    }


    localStorage.setItem(
      GasGoData.CACHE.key,
      JSON.stringify(
        stations
      )
    );


    localStorage.setItem(
      GasGoData
        .CACHE
        .timestampKey,
      String(Date.now())
    );


    return true;

  }

  catch (error) {

    console.warn(
      "GasGo cache save failed:",
      error
    );

    return false;

  }

};


/* =========================================================
   CACHE LOAD
   ========================================================= */

GasGoData.loadCache =
function () {

  try {

    const raw =
      localStorage.getItem(
        GasGoData.CACHE.key
      );


    const timestamp =
      Number(
        localStorage.getItem(
          GasGoData
            .CACHE
            .timestampKey
        )
      );


    if (
      !raw ||
      !Number.isFinite(
        timestamp
      )
    ) {

      return null;

    }


    const stations =
      JSON.parse(raw);


    if (
      !Array.isArray(
        stations
      ) ||
      stations.length === 0
    ) {

      return null;

    }


    const age =
      Date.now() -
      timestamp;


    return {

      stations,

      timestamp,

      age,

      fresh:
        age <=
        GasGoData
          .CACHE
          .maxAge

    };

  }

  catch (error) {

    console.warn(
      "GasGo cache read failed:",
      error
    );

    return null;

  }

};


/* =========================================================
   NETWORK FETCH
   ========================================================= */

GasGoData.fetchLiveStations =
async function () {

  const query =
    GasGoData
      .buildOverpassQuery();


  let lastError =
    null;


  for (
    const endpoint of
    GasGoData
      .OVERPASS_ENDPOINTS
  ) {

    try {

      console.log(
        "GasGo trying:",
        endpoint
      );


      const data =
        await GasGoData
          .fetchWithTimeout(
            endpoint,
            query
          );


      const elements =
        Array.isArray(
          data?.elements
        )
          ?
          data.elements
          :
          [];


      const stations =
        GasGoData
          .removeDuplicates(

            elements
              .map(
                element =>
                  GasGoData
                    .normalizeElement(
                      element
                    )
              )
              .filter(Boolean)

          );


      /*
        A tiny response probably means the public server
        returned incomplete data. Try the next endpoint.
      */

      if (
        stations.length <
        25
      ) {

        lastError =
          new Error(
            "Overpass returned only " +
            stations.length +
            " locations."
          );

        continue;

      }


      GasGoData.saveCache(
        stations
      );


      return {

        stations,

        source:
          "OpenStreetMap",

        endpoint,

        fallback:
          false,

        cached:
          false,

        partial:
          stations.length < 100,

        count:
          stations.length,

        fuelCount:
          stations.filter(
            station =>
              station.type ===
              "fuel"
          ).length,

        evCount:
          stations.filter(
            station =>
              station.type ===
              "ev"
          ).length

      };

    }

    catch (error) {

      lastError =
        error;


      console.warn(
        "GasGo Overpass failed:",
        endpoint,
        error
      );

    }

  }


  throw (
    lastError ||
    new Error(
      "No Overpass service responded."
    )
  );

};


/* =========================================================
   MAIN FETCH
   ========================================================= */

GasGoData.fetchStations =
async function () {

  /*
    FAST PATH:

    If there is a recent cache, use it immediately.

    This makes later visits dramatically faster because the
    app doesn't need to wait for Overpass before showing
    locations.
  */

  const cache =
    GasGoData.loadCache();


  if (
    cache &&
    cache.fresh
  ) {

    const stations =
      cache.stations;


    /*
      Refresh in the background.

      We intentionally do not await this.
    */

    GasGoData
      .fetchLiveStations()
      .catch(
        error => {

          console.warn(
            "GasGo background refresh skipped:",
            error
          );

        }
      );


    return {

      stations,

      source:
        "OpenStreetMap cache",

      endpoint:
        "cache",

      fallback:
        false,

      cached:
        true,

      partial:
        false,

      count:
        stations.length,

      fuelCount:
        stations.filter(
          station =>
            station.type ===
            "fuel"
        ).length,

      evCount:
        stations.filter(
          station =>
            station.type ===
            "ev"
        ).length

    };

  }


  /*
    No fresh cache: attempt live data.
  */

  try {

    return await GasGoData
      .fetchLiveStations();

  }

  catch (error) {

    console.warn(
      "GasGo live locations unavailable:",
      error
    );


    /*
      An expired cache is still much better than throwing
      away hundreds of mapped locations because Overpass is
      temporarily busy.
    */

    if (cache) {

      const stations =
        cache.stations;


      return {

        stations,

        source:
          "OpenStreetMap cached data",

        endpoint:
          "cache",

        fallback:
          false,

        cached:
          true,

        stale:
          true,

        partial:
          true,

        count:
          stations.length,

        fuelCount:
          stations.filter(
            station =>
              station.type ===
              "fuel"
          ).length,

        evCount:
          stations.filter(
            station =>
              station.type ===
              "ev"
          ).length

      };

    }


    /*
      Last resort: clearly labeled GasGo demo locations.
    */

    const fallback =
      GasGoData
        .getFallbackStations();


    return {

      stations:
        fallback,

      source:
        "GasGo demo",

      endpoint:
        null,

      fallback:
        true,

      cached:
        false,

      partial:
        true,

      count:
        fallback.length,

      fuelCount:
        fallback.filter(
          station =>
            station.type ===
            "fuel"
        ).length,

      evCount:
        fallback.filter(
          station =>
            station.type ===
            "ev"
        ).length

    };

  }

};


/* =========================================================
   DISTANCE — HAVERSINE
   ========================================================= */

GasGoData.distanceMiles =
function (
  lat1,
  lon1,
  lat2,
  lon2
) {

  const values =
    [
      lat1,
      lon1,
      lat2,
      lon2
    ]
      .map(Number);


  if (
    values.some(
      value =>
        !Number.isFinite(
          value
        )
    )
  ) {

    return Infinity;

  }


  const [
    aLat,
    aLon,
    bLat,
    bLon
  ] = values;


  const earthRadiusMiles =
    3958.8;


  const radians =
    degrees =>
      degrees *
      Math.PI /
      180;


  const dLat =
    radians(
      bLat -
      aLat
    );


  const dLon =
    radians(
      bLon -
      aLon
    );


  const first =
    radians(
      aLat
    );


  const second =
    radians(
      bLat
    );


  const haversine =
    Math.sin(
      dLat / 2
    ) ** 2 +
    Math.cos(first) *
    Math.cos(second) *
    Math.sin(
      dLon / 2
    ) ** 2;


  const angle =
    2 *
    Math.atan2(
      Math.sqrt(
        haversine
      ),
      Math.sqrt(
        1 -
        haversine
      )
    );


  return (
    earthRadiusMiles *
    angle
  );

};


/* =========================================================
   DISTANCE FORMAT
   ========================================================= */

GasGoData.formatDistance =
function (
  miles
) {

  const distance =
    Number(miles);


  if (
    !Number.isFinite(
      distance
    )
  ) {

    return "—";

  }


  if (
    distance <
    0.1
  ) {

    return "<0.1 mi";

  }


  if (
    distance <
    10
  ) {

    return (
      distance.toFixed(1) +
      " mi"
    );

  }


  return (
    Math.round(distance) +
    " mi"
  );

};


/* =========================================================
   VEHICLE TYPE HELPERS
   ========================================================= */

GasGoData.getVehicleEnergyMode =
function (
  vehicle
) {

  const powertrain =
    String(
      vehicle?.powertrain ||
      ""
    )
      .toLowerCase();


  if (
    powertrain ===
    "electric"
  ) {

    return "ev";

  }


  if (
    powertrain.includes(
      "plug-in"
    ) ||
    powertrain.includes(
      "phev"
    )
  ) {

    return "both";

  }


  return "fuel";

};


/* =========================================================
   FILTER BY ENERGY TYPE
   ========================================================= */

GasGoData.filterByEnergyType =
function (
  stations,
  type = "all"
) {

  if (
    !Array.isArray(
      stations
    )
  ) {

    return [];

  }


  if (
    type === "all" ||
    type === "both"
  ) {

    return [
      ...stations
    ];

  }


  return stations.filter(
    station =>
      station.type ===
      type
  );

};


/* =========================================================
   VEHICLE RANGE
   ========================================================= */

GasGoData.getEstimatedVehicleRange =
function (
  vehicle
) {

  if (!vehicle) {

    return 0;

  }


  const fullRange =
    Number(
      vehicle.fullRange
    );


  const level =
    Number(
      vehicle.level
    );


  if (
    !Number.isFinite(
      fullRange
    ) ||
    !Number.isFinite(
      level
    )
  ) {

    return 0;

  }


  return (
    fullRange *
    GasGoData.clamp(
      level,
      0,
      100
    ) /
    100
  );

};


/* =========================================================
   CAN I MAKE IT?
   ========================================================= */

GasGoData.canIMakeIt =
function (
  station,
  userLocation,
  vehicle
) {

  const range =
    GasGoData
      .getEstimatedVehicleRange(
        vehicle
      );


  if (!station) {

    return {

      status:
        "unknown",

      message:
        "Choose a station or charger first.",

      distance:
        null,

      range,

      remaining:
        null

    };

  }


  if (!userLocation) {

    return {

      status:
        "unknown",

      message:
        "Share your location to compare estimated range with this destination.",

      distance:
        null,

      range,

      remaining:
        null

    };

  }


  const distance =
    GasGoData.distanceMiles(
      userLocation.lat,
      userLocation.lon,
      station.lat,
      station.lon
    );


  if (
    !Number.isFinite(
      distance
    ) ||
    !Number.isFinite(
      range
    ) ||
    range <= 0
  ) {

    return {

      status:
        "unknown",

      message:
        "GasGo does not have enough information to estimate this trip.",

      distance,

      range,

      remaining:
        null

    };

  }


  const remaining =
    range -
    distance;


  /*
    25% safety margin.
  */

  if (
    range >=
    distance * 1.25
  ) {

    return {

      status:
        "safe",

      message:
        "This destination appears to be within your estimated range.",

      distance,

      range,

      remaining

    };

  }


  if (
    range >=
    distance
  ) {

    return {

      status:
        "warning",

      message:
        "You may be within estimated range, but the safety margin is low.",

      distance,

      range,

      remaining

    };

  }


  return {

    status:
      "danger",

    message:
      "This destination is beyond the current estimated range. Choose a closer option.",

    distance,

    range,

    remaining

  };

};


/* =========================================================
   SEARCH
   ========================================================= */

GasGoData.searchStations =
function (
  stations,
  query
) {

  if (
    !Array.isArray(
      stations
    )
  ) {

    return [];

  }


  const search =
    String(
      query || ""
    )
      .trim()
      .toLowerCase();


  if (!search) {

    return [
      ...stations
    ];

  }


  return stations.filter(
    station => {

      const evSockets =
        station.ev?.sockets
          ?.join(" ") ||
        "";


      const text =
        [
          station.name,
          station.brand,
          station.municipality,
          station.type,
          station.ev?.operator,
          station.ev?.network,
          evSockets
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();


      return text.includes(
        search
      );

    }
  );

};


/* =========================================================
   BRAND FILTER
   ========================================================= */

GasGoData.filterByBrand =
function (
  stations,
  brand
) {

  if (
    !Array.isArray(
      stations
    )
  ) {

    return [];

  }


  if (
    !brand ||
    String(brand)
      .toLowerCase() ===
      "all"
  ) {

    return [
      ...stations
    ];

  }


  const target =
    String(brand)
      .toLowerCase();


  return stations.filter(
    station =>
      String(
        station.brand || ""
      )
        .toLowerCase() ===
      target
  );

};


/* =========================================================
   PRICE HELPERS
   ========================================================= */

GasGoData.getPriceForFuel =
function (
  station,
  fuel =
    "regular"
) {

  if (
    !station ||
    station.type === "ev"
  ) {

    return Infinity;

  }


  const prices =
    station.prices ||
    GasGoData
      .getStationPrices(
        station
      );


  const price =
    Number(
      prices?.[fuel]
    );


  return Number.isFinite(
    price
  )
    ?
    price
    :
    Infinity;

};


/* =========================================================
   SORT CHEAPEST
   ========================================================= */

GasGoData.sortCheapest =
function (
  stations,
  fuel =
    "regular"
) {

  return [
    ...(stations || [])
  ]
    .sort(
      (a, b) => {

        /*
          EV chargers do not have GasGo's simulated
          gasoline price, so keep EV entries after priced
          fuel stations when using Cheapest.
        */

        const priceA =
          GasGoData
            .getPriceForFuel(
              a,
              fuel
            );


        const priceB =
          GasGoData
            .getPriceForFuel(
              b,
              fuel
            );


        return (
          priceA -
          priceB
        );

      }
    );

};


/* =========================================================
   SORT CLOSEST
   ========================================================= */

GasGoData.sortClosest =
function (
  stations,
  location
) {

  if (!location) {

    return [
      ...(stations || [])
    ];

  }


  return [
    ...(stations || [])
  ]
    .sort(
      (a, b) => {

        const distanceA =
          GasGoData
            .distanceMiles(
              location.lat,
              location.lon,
              a.lat,
              a.lon
            );


        const distanceB =
          GasGoData
            .distanceMiles(
              location.lat,
              location.lon,
              b.lat,
              b.lon
            );


        return (
          distanceA -
          distanceB
        );

      }
    );

};


/* =========================================================
   BEST VALUE SCORE
   ========================================================= */

GasGoData.getBestValueScore =
function (
  station,
  location,
  fuel =
    "regular"
) {

  /*
    EV does not have comparable $/L pricing.

    When evaluating EV chargers, distance becomes the
    primary score until charger pricing data is available.
  */

  if (
    station.type === "ev"
  ) {

    if (!location) {

      return 1000;

    }


    return GasGoData
      .distanceMiles(
        location.lat,
        location.lon,
        station.lat,
        station.lon
      ) *
      1.6;

  }


  const price =
    GasGoData
      .getPriceForFuel(
        station,
        fuel
      );


  const safePrice =
    Number.isFinite(
      price
    )
      ?
      price
      :
      99;


  let distance =
    0;


  if (location) {

    distance =
      GasGoData
        .distanceMiles(
          location.lat,
          location.lon,
          station.lat,
          station.lon
        );

  }


  return (
    safePrice *
    100 +
    distance *
    1.6
  );

};


/* =========================================================
   SORT BEST VALUE
   ========================================================= */

GasGoData.sortBestValue =
function (
  stations,
  location,
  fuel =
    "regular"
) {

  return [
    ...(stations || [])
  ]
    .sort(
      (a, b) =>

        GasGoData
          .getBestValueScore(
            a,
            location,
            fuel
          ) -

        GasGoData
          .getBestValueScore(
            b,
            location,
            fuel
          )

    );

};


/* =========================================================
   AVERAGE FUEL PRICE
   ========================================================= */

GasGoData.averagePrice =
function (
  stations,
  fuel =
    "regular"
) {

  const values =
    (stations || [])
      .filter(
        station =>
          station.type !== "ev"
      )
      .map(
        station =>
          GasGoData
            .getPriceForFuel(
              station,
              fuel
            )
      )
      .filter(
        price =>
          Number.isFinite(
            price
          )
      );


  if (
    values.length === 0
  ) {

    return null;

  }


  return (
    values.reduce(
      (sum, price) =>
        sum + price,
      0
    ) /
    values.length
  );

};


/* =========================================================
   ESTIMATED SAVINGS
   ========================================================= */

GasGoData.estimateSavings =
function (
  stationPrice,
  comparisonPrice,
  liters
) {

  const station =
    Number(
      stationPrice
    );


  const comparison =
    Number(
      comparisonPrice
    );


  const amount =
    Number(
      liters
    );


  if (
    !Number.isFinite(
      station
    ) ||
    !Number.isFinite(
      comparison
    ) ||
    !Number.isFinite(
      amount
    )
  ) {

    return 0;

  }


  return Math.max(
    0,
    (
      comparison -
      station
    ) *
    amount
  );

};


/* =========================================================
   PRICE LEVEL
   ========================================================= */

GasGoData.getPriceLevel =
function (
  price
) {

  const value =
    Number(price);


  if (
    !Number.isFinite(
      value
    )
  ) {

    return "medium";

  }


  if (
    value <=
    1.15
  ) {

    return "low";

  }


  if (
    value <=
    1.17
  ) {

    return "medium";

  }


  return "high";

};


/* =========================================================
   SMART STOP
   ========================================================= */

GasGoData.getSmartStop =
function (
  stations,
  location,
  vehicle,
  fuel =
    "regular"
) {

  if (
    !Array.isArray(
      stations
    ) ||
    stations.length === 0
  ) {

    return null;

  }


  const mode =
    GasGoData
      .getVehicleEnergyMode(
        vehicle
      );


  let candidates =
    GasGoData
      .filterByEnergyType(
        stations,
        mode
      );


  if (
    candidates.length === 0
  ) {

    candidates =
      [...stations];

  }


  /*
    If location is available, favor practical options within
    30 miles. If none exist, use all candidates.
  */

  if (location) {

    const nearby =
      candidates.filter(
        station => {

          const distance =
            GasGoData
              .distanceMiles(
                location.lat,
                location.lon,
                station.lat,
                station.lon
              );


          return (
            Number.isFinite(
              distance
            ) &&
            distance <= 30
          );

        }
      );


    if (
      nearby.length > 0
    ) {

      candidates =
        nearby;

    }

  }


  candidates =
    GasGoData
      .sortBestValue(
        candidates,
        location,
        fuel
      );


  const station =
    candidates[0];


  if (!station) {

    return null;

  }


  let distance =
    null;


  if (location) {

    distance =
      GasGoData
        .distanceMiles(
          location.lat,
          location.lon,
          station.lat,
          station.lon
        );

  }


  const range =
    GasGoData.canIMakeIt(
      station,
      location,
      vehicle
    );


  return {

    station,

    distance,

    safety:
      range.status,

    range

  };

};


/* =========================================================
   SAFER LOCATION
   ========================================================= */

GasGoData.findSaferStation =
function (
  stations,
  location,
  vehicle,
  fuel =
    "regular"
) {

  if (
    !location ||
    !vehicle
  ) {

    return null;

  }


  const range =
    GasGoData
      .getEstimatedVehicleRange(
        vehicle
      );


  if (
    !Number.isFinite(
      range
    ) ||
    range <= 0
  ) {

    return null;

  }


  const mode =
    GasGoData
      .getVehicleEnergyMode(
        vehicle
      );


  let candidates =
    GasGoData
      .filterByEnergyType(
        stations,
        mode
      );


  candidates =
    candidates
      .map(
        station => {

          const distance =
            GasGoData
              .distanceMiles(
                location.lat,
                location.lon,
                station.lat,
                station.lon
              );


          return {

            station,

            distance,

            price:
              GasGoData
                .getPriceForFuel(
                  station,
                  fuel
                )

          };

        }
      )
      .filter(
        item =>
          Number.isFinite(
            item.distance
          ) &&
          item.distance <=
            range * 0.80
      );


  if (
    candidates.length === 0
  ) {

    return null;

  }


  candidates.sort(
    (a, b) => {

      const distanceDifference =
        a.distance -
        b.distance;


      if (
        Math.abs(
          distanceDifference
        ) >
        0.5
      ) {

        return distanceDifference;

      }


      return (
        a.price -
        b.price
      );

    }
  );


  return (
    candidates[0]
      ?.station ||
    null
  );

};


/* =========================================================
   MAP DIRECTIONS
   ========================================================= */

GasGoData.getGoogleMapsURL =
function (
  station
) {

  const lat =
    Number(
      station?.lat
    );


  const lon =
    Number(
      station?.lon
    );


  return (
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(
      lat + "," + lon
    )
  );

};


GasGoData.getAppleMapsURL =
function (
  station
) {

  const lat =
    Number(
      station?.lat
    );


  const lon =
    Number(
      station?.lon
    );


  const name =
    String(
      station?.name ||
      "GasGo destination"
    );


  return (
    "https://maps.apple.com/?daddr=" +
    encodeURIComponent(
      lat + "," + lon
    ) +
    "&q=" +
    encodeURIComponent(
      name
    )
  );

};


/* =========================================================
   DEBUG INFORMATION
   ========================================================= */

GasGoData.debug =
function () {

  const cache =
    GasGoData.loadCache();


  return {

    version:
      GasGoData.VERSION,

    cache:
      cache
        ?
        {

          count:
            cache.stations.length,

          ageMinutes:
            Math.round(
              cache.age /
              60000
            ),

          fresh:
            cache.fresh

        }
        :
        null,

    endpoints:
      [
        ...GasGoData
          .OVERPASS_ENDPOINTS
      ],

    fallbackFuel:
      GasGoData
        .FALLBACK_STATIONS
        .length,

    fallbackEV:
      GasGoData
        .FALLBACK_EV
        .length

  };

};


/* =========================================================
   READY
   ========================================================= */

console.log(
  "GasGo stations.js v5.3 loaded ⚡⛽"
);
