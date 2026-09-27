/* =========================================================
   GASGO — STATIONS.JS
   Station data, fuel prices, search and recommendation logic
   ========================================================= */

"use strict";

/*
  IMPORTANT:
  - Brand prices are reference/demo values for the prototype.
  - Individual station prices are simulated.
  - They are NOT advertised as live station-specific prices.
*/


/* =========================================================
   GLOBAL GASGO DATA OBJECT
   ========================================================= */

window.GasGoData = window.GasGoData || {};


/* =========================================================
   PUERTO RICO MAP SETTINGS
   ========================================================= */

GasGoData.PR_CENTER = {
  lat: 18.2208,
  lon: -66.5901,
  zoom: 9
};

GasGoData.PR_BOUNDS = {
  south: 17.80,
  west: -67.40,
  north: 18.60,
  east: -65.20
};


/* =========================================================
   CURRENT PROTOTYPE MARKET RANGES

   Prices are dollars per liter.

   These ranges are used to keep simulated station prices
   believable and consistent across the app.
   ========================================================= */

GasGoData.MARKET_RANGES = {
  regular: {
    min: 1.14,
    max: 1.18
  },

  premium: {
    min: 1.28,
    max: 1.36
  },

  diesel: {
    min: 1.41,
    max: 1.45
  }
};


/* =========================================================
   BRAND BASE PRICES
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
    premium: 1.32,
    diesel: 1.43
  }

};


/* =========================================================
   BRAND ALIASES

   OpenStreetMap may spell brands differently.
   These aliases help GasGo normalize them.
   ========================================================= */

GasGoData.BRAND_ALIASES = {

  "puma": "Puma",
  "puma energy": "Puma",

  "shell": "Shell",

  "total": "Total",
  "totalenergies": "Total",
  "total energies": "Total",

  "gulf": "Gulf",

  "texaco": "Texaco",

  "mobil": "Mobil",
  "exxonmobil": "Mobil",

  "sunoco": "Sunoco",

  "phillips": "Phillips 66",
  "phillips 66": "Phillips 66",

  "ecomaxx": "EcoMaxx",
  "eco maxx": "EcoMaxx",

  "american": "American",

  "t-express": "T-Express",
  "t express": "T-Express",

  "ultra": "Ultra Top Fuel",
  "ultra top fuel": "Ultra Top Fuel",

  "bita": "Bita's",
  "bita's": "Bita's",

  "76": "76"

};


/* =========================================================
   MUNICIPALITY CENTERS

   Used only as useful geographic references for demo
   fallback stations and search.
   ========================================================= */

GasGoData.MUNICIPALITIES = {

  "San Juan": {
    lat: 18.4655,
    lon: -66.1057
  },

  "Bayamón": {
    lat: 18.3986,
    lon: -66.1557
  },

  "Carolina": {
    lat: 18.3808,
    lon: -65.9574
  },

  "Guaynabo": {
    lat: 18.3575,
    lon: -66.1110
  },

  "Caguas": {
    lat: 18.2341,
    lon: -66.0485
  },

  "Ponce": {
    lat: 18.0111,
    lon: -66.6141
  },

  "Mayagüez": {
    lat: 18.2013,
    lon: -67.1396
  },

  "Arecibo": {
    lat: 18.4724,
    lon: -66.7157
  },

  "Aguadilla": {
    lat: 18.4274,
    lon: -67.1541
  },

  "Fajardo": {
    lat: 18.3258,
    lon: -65.6524
  },

  "Humacao": {
    lat: 18.1497,
    lon: -65.8274
  },

  "Dorado": {
    lat: 18.4588,
    lon: -66.2677
  },

  "Manatí": {
    lat: 18.4274,
    lon: -66.4921
  },

  "Vega Baja": {
    lat: 18.4444,
    lon: -66.3877
  },

  "Cayey": {
    lat: 18.1119,
    lon: -66.1660
  },

  "Coamo": {
    lat: 18.0799,
    lon: -66.3579
  },

  "Cabo Rojo": {
    lat: 18.0866,
    lon: -67.1457
  },

  "San Germán": {
    lat: 18.0807,
    lon: -67.0410
  },

  "Yabucoa": {
    lat: 18.0505,
    lon: -65.8793
  },

  "Toa Baja": {
    lat: 18.4438,
    lon: -66.2596
  },

  "Cataño": {
    lat: 18.4413,
    lon: -66.1182
  },

  "Trujillo Alto": {
    lat: 18.3547,
    lon: -66.0074
  },

  "Juana Díaz": {
    lat: 18.0525,
    lon: -66.5066
  }

};


/* =========================================================
   FALLBACK DEMO STATIONS

   IMPORTANT:
   These are intentionally labeled DEMO.

   They appear only if live OpenStreetMap station data
   cannot be downloaded.

   They should NOT be represented as verified physical
   gas-station addresses.
   ========================================================= */

GasGoData.FALLBACK_STATIONS = [

  {
    id: "demo-san-juan-puma",
    name: "GasGo Demo • San Juan",
    brand: "Puma",
    municipality: "San Juan",
    lat: 18.4470,
    lon: -66.0730,
    source: "GasGo Demo"
  },

  {
    id: "demo-hato-rey-shell",
    name: "GasGo Demo • Hato Rey",
    brand: "Shell",
    municipality: "San Juan",
    lat: 18.4210,
    lon: -66.0580,
    source: "GasGo Demo"
  },

  {
    id: "demo-carolina-total",
    name: "GasGo Demo • Carolina",
    brand: "Total",
    municipality: "Carolina",
    lat: 18.4010,
    lon: -65.9570,
    source: "GasGo Demo"
  },

  {
    id: "demo-trujillo-gulf",
    name: "GasGo Demo • Trujillo Alto",
    brand: "Gulf",
    municipality: "Trujillo Alto",
    lat: 18.3570,
    lon: -66.0070,
    source: "GasGo Demo"
  },

  {
    id: "demo-bayamon-puma",
    name: "GasGo Demo • Bayamón",
    brand: "Puma",
    municipality: "Bayamón",
    lat: 18.3980,
    lon: -66.1550,
    source: "GasGo Demo"
  },

  {
    id: "demo-guaynabo-texaco",
    name: "GasGo Demo • Guaynabo",
    brand: "Texaco",
    municipality: "Guaynabo",
    lat: 18.3660,
    lon: -66.1110,
    source: "GasGo Demo"
  },

  {
    id: "demo-catano-total",
    name: "GasGo Demo • Cataño",
    brand: "Total",
    municipality: "Cataño",
    lat: 18.4400,
    lon: -66.1180,
    source: "GasGo Demo"
  },

  {
    id: "demo-toa-baja-shell",
    name: "GasGo Demo • Toa Baja",
    brand: "Shell",
    municipality: "Toa Baja",
    lat: 18.4430,
    lon: -66.2590,
    source: "GasGo Demo"
  },

  {
    id: "demo-dorado-mobil",
    name: "GasGo Demo • Dorado",
    brand: "Mobil",
    municipality: "Dorado",
    lat: 18.4590,
    lon: -66.2670,
    source: "GasGo Demo"
  },

  {
    id: "demo-vega-baja-gulf",
    name: "GasGo Demo • Vega Baja",
    brand: "Gulf",
    municipality: "Vega Baja",
    lat: 18.4460,
    lon: -66.3870,
    source: "GasGo Demo"
  },

  {
    id: "demo-manati-puma",
    name: "GasGo Demo • Manatí",
    brand: "Puma",
    municipality: "Manatí",
    lat: 18.4270,
    lon: -66.4930,
    source: "GasGo Demo"
  },

  {
    id: "demo-arecibo-shell",
    name: "GasGo Demo • Arecibo",
    brand: "Shell",
    municipality: "Arecibo",
    lat: 18.4720,
    lon: -66.7160,
    source: "GasGo Demo"
  },

  {
    id: "demo-aguadilla-total",
    name: "GasGo Demo • Aguadilla",
    brand: "Total",
    municipality: "Aguadilla",
    lat: 18.4280,
    lon: -67.1540,
    source: "GasGo Demo"
  },

  {
    id: "demo-mayaguez-puma",
    name: "GasGo Demo • Mayagüez",
    brand: "Puma",
    municipality: "Mayagüez",
    lat: 18.2020,
    lon: -67.1390,
    source: "GasGo Demo"
  },

  {
    id: "demo-san-german-gulf",
    name: "GasGo Demo • San Germán",
    brand: "Gulf",
    municipality: "San Germán",
    lat: 18.0820,
    lon: -67.0450,
    source: "GasGo Demo"
  },

  {
    id: "demo-cabo-rojo-texaco",
    name: "GasGo Demo • Cabo Rojo",
    brand: "Texaco",
    municipality: "Cabo Rojo",
    lat: 18.0860,
    lon: -67.1450,
    source: "GasGo Demo"
  },

  {
    id: "demo-ponce-shell",
    name: "GasGo Demo • Ponce",
    brand: "Shell",
    municipality: "Ponce",
    lat: 18.0120,
    lon: -66.6140,
    source: "GasGo Demo"
  },

  {
    id: "demo-juana-diaz-puma",
    name: "GasGo Demo • Juana Díaz",
    brand: "Puma",
    municipality: "Juana Díaz",
    lat: 18.0530,
    lon: -66.5070,
    source: "GasGo Demo"
  },

  {
    id: "demo-coamo-total",
    name: "GasGo Demo • Coamo",
    brand: "Total",
    municipality: "Coamo",
    lat: 18.0800,
    lon: -66.3580,
    source: "GasGo Demo"
  },

  {
    id: "demo-cayey-gulf",
    name: "GasGo Demo • Cayey",
    brand: "Gulf",
    municipality: "Cayey",
    lat: 18.1120,
    lon: -66.1660,
    source: "GasGo Demo"
  },

  {
    id: "demo-caguas-puma",
    name: "GasGo Demo • Caguas",
    brand: "Puma",
    municipality: "Caguas",
    lat: 18.2340,
    lon: -66.0480,
    source: "GasGo Demo"
  },

  {
    id: "demo-humacao-shell",
    name: "GasGo Demo • Humacao",
    brand: "Shell",
    municipality: "Humacao",
    lat: 18.1500,
    lon: -65.8270,
    source: "GasGo Demo"
  },

  {
    id: "demo-fajardo-total",
    name: "GasGo Demo • Fajardo",
    brand: "Total",
    municipality: "Fajardo",
    lat: 18.3250,
    lon: -65.6520,
    source: "GasGo Demo"
  },

  {
    id: "demo-yabucoa-texaco",
    name: "GasGo Demo • Yabucoa",
    brand: "Texaco",
    municipality: "Yabucoa",
    lat: 18.0500,
    lon: -65.8790,
    source: "GasGo Demo"
  }

];


/* =========================================================
   OVERPASS ENDPOINTS

   GasGo can try a second server if the first is temporarily
   unavailable.
   ========================================================= */

GasGoData.OVERPASS_ENDPOINTS = [

  "https://overpass-api.de/api/interpreter",

  "https://overpass.kumi.systems/api/interpreter"

];


/* =========================================================
   OVERPASS QUERY
   ========================================================= */

GasGoData.createOverpassQuery = function () {

  const bounds = GasGoData.PR_BOUNDS;

  return `
[out:json][timeout:25];

(
  node["amenity"="fuel"]
  (${bounds.south},${bounds.west},${bounds.north},${bounds.east});

  way["amenity"="fuel"]
  (${bounds.south},${bounds.west},${bounds.north},${bounds.east});

  relation["amenity"="fuel"]
  (${bounds.south},${bounds.west},${bounds.north},${bounds.east});
);

out center tags;
  `.trim();

};


/* =========================================================
   BASIC UTILITIES
   ========================================================= */

GasGoData.clamp = function (
  value,
  min,
  max
) {

  return Math.max(
    min,
    Math.min(max, value)
  );

};


GasGoData.roundPrice = function (value) {

  return Math.round(
    Number(value) * 100
  ) / 100;

};


GasGoData.formatPrice = function (value) {

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return "$" + number.toFixed(2);

};


GasGoData.escapeHTML = function (value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

};


/* =========================================================
   NORMALIZE TEXT

   Makes searches like:

   "Bayamon" -> match "Bayamón"
   "Mayaguez" -> match "Mayagüez"
   ========================================================= */

GasGoData.normalizeText = function (value) {

  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

};


/* =========================================================
   HASH

   This lets GasGo create a consistent demo price.

   A station receives the SAME demo price every time instead
   of changing randomly whenever the page reloads.
   ========================================================= */

GasGoData.hashString = function (text) {

  let hash = 2166136261;

  const value = String(text);

  for (
    let i = 0;
    i < value.length;
    i++
  ) {

    hash ^= value.charCodeAt(i);

    hash = Math.imul(
      hash,
      16777619
    );

  }

  return hash >>> 0;

};


/* =========================================================
   SEEDED NUMBER
   ========================================================= */

GasGoData.seededUnit = function (
  seed,
  offset = 0
) {

  let value =
    (seed + Math.imul(offset + 1, 2654435761))
    >>> 0;

  value ^= value >>> 16;

  value = Math.imul(
    value,
    2246822507
  );

  value ^= value >>> 13;

  value = Math.imul(
    value,
    3266489909
  );

  value ^= value >>> 16;

  return (
    value >>> 0
  ) / 4294967295;

};


/* =========================================================
   DETECT / NORMALIZE BRAND
   ========================================================= */

GasGoData.detectBrand = function (tags = {}) {

  const text = GasGoData.normalizeText(
    [
      tags.brand,
      tags.name,
      tags.operator,
      tags.network
    ]
      .filter(Boolean)
      .join(" ")
  );


  /*
    Longer / more specific aliases are checked first.
  */

  const aliases = Object.entries(
    GasGoData.BRAND_ALIASES
  )
    .sort(
      (a, b) =>
        b[0].length -
        a[0].length
    );


  for (
    const [alias, brand]
    of aliases
  ) {

    const normalizedAlias =
      GasGoData.normalizeText(alias);

    if (
      text.includes(
        normalizedAlias
      )
    ) {

      return brand;

    }

  }


  return "Independent";

};


/* =========================================================
   CREATE STATION ID
   ========================================================= */

GasGoData.createStationId = function (
  station
) {

  if (
    station.id !== undefined &&
    station.id !== null
  ) {

    return String(station.id);

  }


  const raw = [
    station.name,
    station.brand,
    station.lat,
    station.lon
  ].join("|");


  return (
    "station-" +
    GasGoData.hashString(raw)
  );

};


/* =========================================================
   CREATE STATION NAME
   ========================================================= */

GasGoData.createStationName = function (
  tags,
  brand
) {

  if (
    tags &&
    typeof tags.name === "string" &&
    tags.name.trim()
  ) {

    return tags.name.trim();

  }


  if (
    tags &&
    typeof tags.operator === "string" &&
    tags.operator.trim()
  ) {

    return tags.operator.trim();

  }


  if (
    brand &&
    brand !== "Independent"
  ) {

    return brand + " Station";

  }


  return "Fuel Station";

};


/* =========================================================
   PARSE ADDRESS
   ========================================================= */

GasGoData.createAddress = function (
  tags = {}
) {

  const parts = [];


  const street = [
    tags["addr:housenumber"],
    tags["addr:street"]
  ]
    .filter(Boolean)
    .join(" ")
    .trim();


  if (street) {
    parts.push(street);
  }


  const city =
    tags["addr:city"] ||
    tags["addr:municipality"] ||
    tags["addr:place"];


  if (city) {
    parts.push(city);
  }


  return parts.join(", ");

};


/* =========================================================
   MUNICIPALITY GUESS

   First uses OSM address data if available.

   Otherwise it finds the nearest municipality center.
   This is an approximation used for search/display only.
   ========================================================= */

GasGoData.guessMunicipality = function (
  lat,
  lon,
  tags = {}
) {

  const direct =
    tags["addr:city"] ||
    tags["addr:municipality"] ||
    tags["addr:place"];


  if (
    typeof direct === "string" &&
    direct.trim()
  ) {

    return direct.trim();

  }


  let nearestName = "";
  let nearestDistance = Infinity;


  Object.entries(
    GasGoData.MUNICIPALITIES
  )
    .forEach(
      ([name, location]) => {

        const distance =
          GasGoData.distanceMiles(
            lat,
            lon,
            location.lat,
            location.lon
          );


        if (
          distance <
          nearestDistance
        ) {

          nearestDistance =
            distance;

          nearestName =
            name;

        }

      }
    );


  /*
    Don't claim a municipality if the point is too far
    from one of our reference centers.
  */

  if (
    nearestDistance <= 18
  ) {

    return nearestName;

  }


  return "";

};


/* =========================================================
   HAVERSINE DISTANCE
   ========================================================= */

GasGoData.distanceMiles = function (
  lat1,
  lon1,
  lat2,
  lon2
) {

  const numbers = [
    lat1,
    lon1,
    lat2,
    lon2
  ].map(Number);


  if (
    numbers.some(
      value =>
        !Number.isFinite(value)
    )
  ) {

    return Infinity;

  }


  const [
    aLat,
    aLon,
    bLat,
    bLon
  ] = numbers;


  const earthRadiusMiles =
    3958.8;


  const toRadians =
    degrees =>
      degrees *
      Math.PI /
      180;


  const deltaLat =
    toRadians(
      bLat - aLat
    );


  const deltaLon =
    toRadians(
      bLon - aLon
    );


  const formula =

    Math.sin(
      deltaLat / 2
    ) ** 2

    +

    Math.cos(
      toRadians(aLat)
    )

    *

    Math.cos(
      toRadians(bLat)
    )

    *

    Math.sin(
      deltaLon / 2
    ) ** 2;


  const centralAngle =
    2 *
    Math.atan2(
      Math.sqrt(formula),
      Math.sqrt(1 - formula)
    );


  return (
    earthRadiusMiles *
    centralAngle
  );

};


/* =========================================================
   DISTANCE LABEL
   ========================================================= */

GasGoData.formatDistance = function (
  miles
) {

  const value =
    Number(miles);


  if (
    !Number.isFinite(value)
  ) {

    return "—";

  }


  if (
    value < 0.1
  ) {

    return "<0.1 mi";

  }


  if (
    value < 10
  ) {

    return (
      value.toFixed(1) +
      " mi"
    );

  }


  return (
    Math.round(value) +
    " mi"
  );

};


/* =========================================================
   GET BRAND BASE PRICE
   ========================================================= */

GasGoData.getBrandBasePrice = function (
  brand
) {

  return (
    GasGoData.BRAND_PRICES[brand]
    ||
    GasGoData.BRAND_PRICES.Independent
  );

};


/* =========================================================
   GENERATE CONSISTENT DEMO PRICES

   Variation is intentionally small.

   Example:
   Puma A -> $1.15
   Puma B -> $1.17
   Puma C -> $1.16

   Same station keeps same values after refresh.
   ========================================================= */

GasGoData.getStationPrices = function (
  station
) {

  const base =
    GasGoData.getBrandBasePrice(
      station.brand
    );


  const stationKey = [
    station.id,
    station.name,
    Number(station.lat).toFixed(5),
    Number(station.lon).toFixed(5)
  ].join("|");


  const seed =
    GasGoData.hashString(
      stationKey
    );


  function createPrice(
    fuel,
    offset
  ) {

    const range =
      GasGoData.MARKET_RANGES[fuel];


    /*
      +/- 2 cents around the brand reference.
    */

    const unit =
      GasGoData.seededUnit(
        seed,
        offset
      );


    const variation =
      (
        Math.round(
          unit * 4
        ) - 2
      ) / 100;


    const value =
      base[fuel] +
      variation;


    return GasGoData.roundPrice(
      GasGoData.clamp(
        value,
        range.min,
        range.max
      )
    );

  }


  return {

    regular:
      createPrice(
        "regular",
        1
      ),

    premium:
      createPrice(
        "premium",
        2
      ),

    diesel:
      createPrice(
        "diesel",
        3
      )

  };

};


/* =========================================================
   PRICE LEVEL
   ========================================================= */

GasGoData.getPriceLevel = function (
  regularPrice
) {

  const value =
    Number(
      regularPrice
    );


  if (
    !Number.isFinite(value)
  ) {

    return "average";

  }


  if (
    value <= 1.15
  ) {

    return "best";

  }


  if (
    value >= 1.18
  ) {

    return "high";

  }


  return "average";

};


/* =========================================================
   PARSE OPENSTREETMAP STATION
   ========================================================= */

GasGoData.parseOSMStation = function (
  item
) {

  if (!item) {
    return null;
  }


  const lat =
    Number(
      item.lat ??
      item.center?.lat
    );


  const lon =
    Number(
      item.lon ??
      item.center?.lon
    );


  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon)
  ) {

    return null;

  }


  const tags =
    item.tags || {};


  const brand =
    GasGoData.detectBrand(
      tags
    );


  const name =
    GasGoData.createStationName(
      tags,
      brand
    );


  const station = {

    id:
      "osm-" +
      String(
        item.type || "item"
      ) +
      "-" +
      String(
        item.id
      ),

    osmType:
      item.type || "",

    osmId:
      item.id,

    name:
      name,

    brand:
      brand,

    lat:
      lat,

    lon:
      lon,

    municipality:
      GasGoData.guessMunicipality(
        lat,
        lon,
        tags
      ),

    address:
      GasGoData.createAddress(
        tags
      ),

    source:
      "OpenStreetMap",

    openingHours:
      tags.opening_hours || "",

    phone:
      tags.phone ||
      tags["contact:phone"] ||
      "",

    website:
      tags.website ||
      tags["contact:website"] ||
      "",

    wheelchair:
      tags.wheelchair || "",

    selfService:
      tags.self_service || "",

    tags:
      tags

  };


  station.prices =
    GasGoData.getStationPrices(
      station
    );


  return station;

};


/* =========================================================
   PREPARE FALLBACK STATION
   ========================================================= */

GasGoData.prepareFallbackStation = function (
  station
) {

  const prepared = {
    ...station
  };


  prepared.id =
    GasGoData.createStationId(
      prepared
    );


  prepared.address =
    prepared.address || "";


  prepared.prices =
    GasGoData.getStationPrices(
      prepared
    );


  return prepared;

};


/* =========================================================
   PREPARED FALLBACK ARRAY
   ========================================================= */

GasGoData.getFallbackStations = function () {

  return GasGoData
    .FALLBACK_STATIONS
    .map(
      GasGoData.prepareFallbackStation
    );

};


/* =========================================================
   REMOVE DUPLICATE STATIONS

   Sometimes map data can contain duplicate nodes/ways.
   ========================================================= */

GasGoData.removeDuplicates = function (
  stations
) {

  const unique = [];

  const seen =
    new Set();


  for (
    const station
    of stations
  ) {

    if (!station) {
      continue;
    }


    const key = [

      GasGoData.normalizeText(
        station.name
      ),

      Number(
        station.lat
      ).toFixed(4),

      Number(
        station.lon
      ).toFixed(4)

    ].join("|");


    if (
      seen.has(key)
    ) {

      continue;

    }


    seen.add(key);

    unique.push(
      station
    );

  }


  return unique;

};


/* =========================================================
   DOWNLOAD OSM STATIONS

   Returns an object instead of throwing an error so app.js
   can safely fall back to demo stations.
   ========================================================= */

GasGoData.fetchStations = async function () {

  const query =
    GasGoData.createOverpassQuery();


  let lastError = null;


  for (
    const endpoint
    of GasGoData.OVERPASS_ENDPOINTS
  ) {

    let timeoutId = null;


    try {

      const controller =
        new AbortController();


      timeoutId =
        setTimeout(
          () => controller.abort(),
          12000
        );


      const url =
        endpoint +
        "?data=" +
        encodeURIComponent(
          query
        );


      const response =
        await fetch(
          url,
          {
            signal:
              controller.signal,

            headers: {
              "Accept":
                "application/json"
            }
          }
        );


      clearTimeout(
        timeoutId
      );


      if (
        !response.ok
      ) {

        throw new Error(
          "Station service returned " +
          response.status
        );

      }


      const data =
        await response.json();


      if (
        !data ||
        !Array.isArray(
          data.elements
        )
      ) {

        throw new Error(
          "Invalid station data"
        );

      }


      let stations =
        data.elements
          .map(
            GasGoData.parseOSMStation
          )
          .filter(Boolean);


      stations =
        GasGoData.removeDuplicates(
          stations
        );


      if (
        stations.length === 0
      ) {

        throw new Error(
          "No mapped stations returned"
        );

      }


      return {

        success: true,

        source:
          "OpenStreetMap",

        fallback: false,

        stations:
          stations,

        count:
          stations.length

      };

    }

    catch (error) {

      if (timeoutId) {

        clearTimeout(
          timeoutId
        );

      }


      lastError =
        error;

    }

  }


  const fallback =
    GasGoData.getFallbackStations();


  return {

    success: false,

    source:
      "GasGo Demo",

    fallback: true,

    stations:
      fallback,

    count:
      fallback.length,

    error:
      lastError
      ?
      String(
        lastError.message ||
        lastError
      )
      :
      "Station service unavailable"

  };

};


/* =========================================================
   ATTACH DISTANCE TO STATIONS
   ========================================================= */

GasGoData.withDistances = function (
  stations,
  location
) {

  if (
    !Array.isArray(stations)
  ) {

    return [];
  }


  if (
    !location ||
    !Number.isFinite(
      Number(location.lat)
    ) ||
    !Number.isFinite(
      Number(location.lon)
    )
  ) {

    return stations.map(
      station => ({
        ...station,
        distance: Infinity
      })
    );

  }


  return stations.map(
    station => ({

      ...station,

      distance:
        GasGoData.distanceMiles(
          location.lat,
          location.lon,
          station.lat,
          station.lon
        )

    })
  );

};


/* =========================================================
   SEARCH STATIONS
   ========================================================= */

GasGoData.searchStations = function (
  stations,
  query
) {

  if (
    !Array.isArray(stations)
  ) {

    return [];
  }


  const search =
    GasGoData.normalizeText(
      query
    );


  if (!search) {

    return [
      ...stations
    ];

  }


  return stations.filter(
    station => {

      const haystack =
        GasGoData.normalizeText(
          [
            station.name,
            station.brand,
            station.municipality,
            station.address
          ]
            .filter(Boolean)
            .join(" ")
        );


      return haystack.includes(
        search
      );

    }
  );

};


/* =========================================================
   FILTER BY BRAND
   ========================================================= */

GasGoData.filterByBrand = function (
  stations,
  brand
) {

  if (
    !Array.isArray(stations)
  ) {

    return [];
  }


  if (
    !brand ||
    brand === "all"
  ) {

    return [
      ...stations
    ];

  }


  const normalizedBrand =
    GasGoData.normalizeText(
      brand
    );


  return stations.filter(
    station =>
      GasGoData.normalizeText(
        station.brand
      ) ===
      normalizedBrand
  );

};


/* =========================================================
   CHEAPEST SORT
   ========================================================= */

GasGoData.sortCheapest = function (
  stations,
  fuel = "regular"
) {

  return [
    ...stations
  ]
    .sort(
      (a, b) => {

        const aPrice =
          a.prices?.[fuel] ??
          GasGoData
            .getStationPrices(a)
            [fuel];


        const bPrice =
          b.prices?.[fuel] ??
          GasGoData
            .getStationPrices(b)
            [fuel];


        return (
          aPrice -
          bPrice
        );

      }
    );

};


/* =========================================================
   CLOSEST SORT
   ========================================================= */

GasGoData.sortClosest = function (
  stations,
  location
) {

  const withDistance =
    GasGoData.withDistances(
      stations,
      location
    );


  return withDistance.sort(
    (a, b) =>
      a.distance -
      b.distance
  );

};


/* =========================================================
   PRICE NORMALIZATION

   Returns a value between 0 and 1.

   0 = cheaper
   1 = more expensive
   ========================================================= */

GasGoData.normalizeFuelPrice = function (
  price,
  fuel = "regular"
) {

  const range =
    GasGoData.MARKET_RANGES[fuel]
    ||
    GasGoData.MARKET_RANGES.regular;


  const difference =
    range.max -
    range.min;


  if (
    difference <= 0
  ) {

    return 0;

  }


  return GasGoData.clamp(
    (
      Number(price) -
      range.min
    ) /
    difference,
    0,
    1
  );

};


/* =========================================================
   DISTANCE NORMALIZATION

   Stations within ~15 miles receive useful scores.

   This is only for prototype recommendation logic.
   ========================================================= */

GasGoData.normalizeDistance = function (
  distance
) {

  if (
    !Number.isFinite(
      Number(distance)
    )
  ) {

    return 1;

  }


  return GasGoData.clamp(
    Number(distance) /
    15,
    0,
    1
  );

};


/* =========================================================
   BEST VALUE SCORE

   Lower score = better.

   Current weighting:

   60% fuel price
   40% distance

   This prevents GasGo from recommending a very distant
   station just because fuel is one cent cheaper.
   ========================================================= */

GasGoData.bestValueScore = function (
  station,
  location,
  fuel = "regular"
) {

  const prices =
    station.prices ||
    GasGoData.getStationPrices(
      station
    );


  const price =
    prices[fuel];


  const distance =
    location
    ?
    GasGoData.distanceMiles(
      location.lat,
      location.lon,
      station.lat,
      station.lon
    )
    :
    Infinity;


  const priceScore =
    GasGoData.normalizeFuelPrice(
      price,
      fuel
    );


  /*
    Without user location we cannot honestly rank distance.

    In that case Best Value behaves primarily like
    price comparison.
  */

  const distanceScore =
    Number.isFinite(distance)
    ?
    GasGoData.normalizeDistance(
      distance
    )
    :
    0;


  const score =
    (
      priceScore * 0.60
    )
    +
    (
      distanceScore * 0.40
    );


  return {

    score:
      score,

    price:
      price,

    distance:
      distance,

    priceScore:
      priceScore,

    distanceScore:
      distanceScore

  };

};


/* =========================================================
   SORT BEST VALUE
   ========================================================= */

GasGoData.sortBestValue = function (
  stations,
  location,
  fuel = "regular"
) {

  return [
    ...stations
  ]
    .map(
      station => {

        const value =
          GasGoData.bestValueScore(
            station,
            location,
            fuel
          );


        return {

          ...station,

          distance:
            value.distance,

          bestValueScore:
            value.score

        };

      }
    )
    .sort(
      (a, b) =>
        a.bestValueScore -
        b.bestValueScore
    );

};


/* =========================================================
   GET SMART STOP

   Smart Stop uses:

   - Price
   - Distance
   - Vehicle estimated range
   - Safety buffer

   It never claims the driver can definitely reach a
   station.
   ========================================================= */

GasGoData.getSmartStop = function (
  stations,
  location,
  vehicle,
  fuel = "regular"
) {

  if (
    !Array.isArray(stations) ||
    stations.length === 0
  ) {

    return null;

  }


  const ranked =
    GasGoData.sortBestValue(
      stations,
      location,
      fuel
    );


  /*
    No location:
    We can suggest based on demo price,
    but NOT claim distance from the user.
  */

  if (
    !location ||
    !Number.isFinite(
      Number(location.lat)
    ) ||
    !Number.isFinite(
      Number(location.lon)
    )
  ) {

    const station =
      ranked[0];


    if (!station) {
      return null;
    }


    return {

      station:
        station,

      distance:
        Infinity,

      estimatedRange:
        null,

      safety:
        "unknown",

      reason:
        "price",

      canLikelyMakeIt:
        null

    };

  }


  let estimatedRange =
    null;


  if (
    vehicle &&
    Number.isFinite(
      Number(
        vehicle.fullRange
      )
    ) &&
    Number.isFinite(
      Number(
        vehicle.level
      )
    )
  ) {

    estimatedRange =
      Number(
        vehicle.fullRange
      )
      *
      (
        Number(
          vehicle.level
        ) /
        100
      );

  }


  /*
    Prefer nearby candidates.

    This keeps a cheap station 50 miles away from winning.
  */

  let candidates =
    ranked.filter(
      station =>
        Number.isFinite(
          station.distance
        ) &&
        station.distance <= 25
    );


  if (
    candidates.length === 0
  ) {

    candidates =
      ranked.slice(
        0,
        20
      );

  }


  /*
    If we know vehicle range, remove stations that are
    clearly beyond the estimated range.

    We keep a 15% safety reserve.
  */

  if (
    Number.isFinite(
      estimatedRange
    )
  ) {

    const safeRange =
      estimatedRange *
      0.85;


    const reachable =
      candidates.filter(
        station =>
          station.distance <=
          safeRange
      );


    if (
      reachable.length > 0
    ) {

      candidates =
        reachable;

    }

  }


  const station =
    candidates[0] ||
    ranked[0];


  if (!station) {
    return null;
  }


  const distance =
    station.distance;


  let safety =
    "unknown";


  let canLikelyMakeIt =
    null;


  if (
    Number.isFinite(
      estimatedRange
    ) &&
    Number.isFinite(
      distance
    )
  ) {

    const remaining =
      estimatedRange -
      distance;


    const ratio =
      estimatedRange > 0
      ?
      distance /
      estimatedRange
      :
      Infinity;


    if (
      distance >
      estimatedRange
    ) {

      safety =
        "danger";

      canLikelyMakeIt =
        false;

    }

    else if (
      ratio >= 0.75 ||
      remaining < 15
    ) {

      safety =
        "warning";

      canLikelyMakeIt =
        true;

    }

    else {

      safety =
        "safe";

      canLikelyMakeIt =
        true;

    }

  }


  return {

    station:
      station,

    distance:
      distance,

    estimatedRange:
      estimatedRange,

    safety:
      safety,

    reason:
      "best-value",

    canLikelyMakeIt:
      canLikelyMakeIt

  };

};


/* =========================================================
   ESTIMATE RANGE
   ========================================================= */

GasGoData.getEstimatedVehicleRange = function (
  vehicle
) {

  if (!vehicle) {
    return null;
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

    return null;

  }


  return Math.max(
    0,
    fullRange *
    (
      GasGoData.clamp(
        level,
        0,
        100
      ) /
      100
    )
  );

};


/* =========================================================
   CAN I MAKE IT?
   ========================================================= */

GasGoData.canIMakeIt = function (
  station,
  location,
  vehicle
) {

  if (!station) {

    return {
      status: "unknown",
      message: "Choose a station first."
    };

  }


  if (!vehicle) {

    return {
      status: "unknown",
      message:
        "Add your vehicle to calculate estimated range."
    };

  }


  const range =
    GasGoData.getEstimatedVehicleRange(
      vehicle
    );


  if (
    !Number.isFinite(range)
  ) {

    return {
      status: "unknown",
      message:
        "Vehicle range information is unavailable."
    };

  }


  if (!location) {

    return {
      status: "unknown",

      range:
        range,

      message:
        "Share your location to compare your estimated range with this station."
    };

  }


  const distance =
    GasGoData.distanceMiles(
      location.lat,
      location.lon,
      station.lat,
      station.lon
    );


  if (
    !Number.isFinite(distance)
  ) {

    return {
      status: "unknown",
      message:
        "Distance could not be calculated."
    };

  }


  const remaining =
    range -
    distance;


  const reserve =
    range *
    0.15;


  if (
    distance >
    range
  ) {

    return {

      status:
        "danger",

      canLikelyMakeIt:
        false,

      distance:
        distance,

      range:
        range,

      remaining:
        remaining,

      message:
        "Estimated range may not be enough. GasGo recommends a closer station."

    };

  }


  if (
    remaining <= reserve ||
    remaining < 15
  ) {

    return {

      status:
        "warning",

      canLikelyMakeIt:
        true,

      distance:
        distance,

      range:
        range,

      remaining:
        remaining,

      message:
        "The station appears reachable, but your estimated safety margin is low."

    };

  }


  return {

    status:
      "safe",

    canLikelyMakeIt:
      true,

    distance:
      distance,

    range:
      range,

    remaining:
      remaining,

    message:
      "This station appears to be within your estimated vehicle range."

  };

};


/* =========================================================
   FIND SAFER STATION
   ========================================================= */

GasGoData.findSaferStation = function (
  stations,
  location,
  vehicle,
  fuel = "regular"
) {

  if (
    !location ||
    !vehicle
  ) {

    return null;

  }


  const range =
    GasGoData.getEstimatedVehicleRange(
      vehicle
    );


  if (
    !Number.isFinite(range)
  ) {

    return null;

  }


  const safeRange =
    range *
    0.85;


  const candidates =
    GasGoData
      .sortClosest(
        stations,
        location
      )
      .filter(
        station =>
          station.distance <=
          safeRange
      );


  if (
    candidates.length === 0
  ) {

    return null;

  }


  /*
    Among the closest safe stations,
    consider price as well.
  */

  const nearby =
    candidates.slice(
      0,
      10
    );


  return GasGoData
    .sortBestValue(
      nearby,
      location,
      fuel
    )[0] || null;

};


/* =========================================================
   ESTIMATED SAVINGS

   This is intentionally labeled an estimate.

   Inputs:
   - selected station price
   - comparison price
   - liters expected to purchase
   ========================================================= */

GasGoData.estimateSavings = function (
  selectedPrice,
  comparisonPrice,
  liters
) {

  const selected =
    Number(
      selectedPrice
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
    !Number.isFinite(selected) ||
    !Number.isFinite(comparison) ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {

    return 0;

  }


  return Math.max(
    0,
    (
      comparison -
      selected
    ) *
    amount
  );

};


/* =========================================================
   AVERAGE PRICE
   ========================================================= */

GasGoData.averagePrice = function (
  stations,
  fuel = "regular"
) {

  if (
    !Array.isArray(stations) ||
    stations.length === 0
  ) {

    return null;

  }


  const values =
    stations
      .map(
        station => {

          const prices =
            station.prices ||
            GasGoData.getStationPrices(
              station
            );


          return Number(
            prices[fuel]
          );

        }
      )
      .filter(
        Number.isFinite
      );


  if (
    values.length === 0
  ) {

    return null;

  }


  const total =
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    );


  return (
    total /
    values.length
  );

};


/* =========================================================
   CHEAPEST STATION
   ========================================================= */

GasGoData.getCheapestStation = function (
  stations,
  fuel = "regular"
) {

  if (
    !Array.isArray(stations) ||
    stations.length === 0
  ) {

    return null;

  }


  return (
    GasGoData
      .sortCheapest(
        stations,
        fuel
      )[0]
    ||
    null
  );

};


/* =========================================================
   CLOSEST STATION
   ========================================================= */

GasGoData.getClosestStation = function (
  stations,
  location
) {

  if (
    !Array.isArray(stations) ||
    stations.length === 0 ||
    !location
  ) {

    return null;

  }


  return (
    GasGoData
      .sortClosest(
        stations,
        location
      )[0]
    ||
    null
  );

};


/* =========================================================
   GET BRAND LIST
   ========================================================= */

GasGoData.getBrandList = function (
  stations
) {

  if (
    !Array.isArray(stations)
  ) {

    return [];
  }


  const brands =
    new Set();


  stations.forEach(
    station => {

      if (
        station.brand &&
        station.brand !==
        "Independent"
      ) {

        brands.add(
          station.brand
        );

      }

    }
  );


  return [
    ...brands
  ]
    .sort(
      (a, b) =>
        a.localeCompare(
          b
        )
    );

};


/* =========================================================
   DIRECTIONS URL

   No location permission is required to create directions
   to the selected destination.

   On iPhone this can open Apple Maps.
   ========================================================= */

GasGoData.getAppleMapsURL = function (
  station
) {

  if (!station) {
    return "";
  }


  const destination =
    Number(station.lat) +
    "," +
    Number(station.lon);


  return (
    "https://maps.apple.com/?daddr=" +
    encodeURIComponent(
      destination
    ) +
    "&dirflg=d"
  );

};


/* =========================================================
   GOOGLE MAPS DIRECTIONS URL
   ========================================================= */

GasGoData.getGoogleMapsURL = function (
  station
) {

  if (!station) {
    return "";
  }


  const destination =
    Number(station.lat) +
    "," +
    Number(station.lon);


  return (
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(
      destination
    )
  );

};


/* =========================================================
   DEBUG / VERSION
   ========================================================= */

GasGoData.VERSION =
  "5.0.0";


console.log(
  "GasGo station engine loaded:",
  GasGoData.VERSION
);
