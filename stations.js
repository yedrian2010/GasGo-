/* =========================================================
   GASGO — STATIONS.JS
   Station / pricing / distance engine
   Version 5.1
   ========================================================= */

"use strict";

window.GasGoData = window.GasGoData || {};

const GasGoData = window.GasGoData;


/* =========================================================
   PUERTO RICO MAP SETTINGS
   ========================================================= */

GasGoData.PR_CENTER = {
  lat: 18.2208,
  lon: -66.5901,
  zoom: 9
};


/*
  Bounding box used only for station discovery.

  south, west, north, east
*/

GasGoData.PR_BBOX = {
  south: 17.80,
  west: -67.40,
  north: 18.60,
  east: -65.20
};


/* =========================================================
   BRAND REFERENCE PRICES

   IMPORTANT:
   These are prototype/reference values.
   They are NOT live station-specific prices.
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
   OVERPASS SERVERS

   We try several public endpoints because public Overpass
   servers can occasionally be busy or temporarily fail.
   ========================================================= */

GasGoData.OVERPASS_ENDPOINTS = [

  "https://overpass-api.de/api/interpreter",

  "https://overpass.kumi.systems/api/interpreter",

  "https://overpass.nchc.org.tw/api/interpreter"

];


/* =========================================================
   DEMO FALLBACK

   Used ONLY when station services fail completely.

   These are clearly marked as GasGo demo locations.
   ========================================================= */

GasGoData.FALLBACK_STATIONS = [

  {
    id: "demo-san-juan",
    name: "GasGo Demo • San Juan",
    brand: "Puma",
    municipality: "San Juan",
    lat: 18.447,
    lon: -66.073
  },

  {
    id: "demo-hato-rey",
    name: "GasGo Demo • Hato Rey",
    brand: "Shell",
    municipality: "San Juan",
    lat: 18.421,
    lon: -66.058
  },

  {
    id: "demo-carolina",
    name: "GasGo Demo • Carolina",
    brand: "Total",
    municipality: "Carolina",
    lat: 18.401,
    lon: -65.957
  },

  {
    id: "demo-trujillo",
    name: "GasGo Demo • Trujillo Alto",
    brand: "Gulf",
    municipality: "Trujillo Alto",
    lat: 18.357,
    lon: -66.007
  },

  {
    id: "demo-bayamon",
    name: "GasGo Demo • Bayamón",
    brand: "Puma",
    municipality: "Bayamón",
    lat: 18.398,
    lon: -66.155
  },

  {
    id: "demo-guaynabo",
    name: "GasGo Demo • Guaynabo",
    brand: "Texaco",
    municipality: "Guaynabo",
    lat: 18.366,
    lon: -66.111
  },

  {
    id: "demo-catano",
    name: "GasGo Demo • Cataño",
    brand: "Total",
    municipality: "Cataño",
    lat: 18.440,
    lon: -66.118
  },

  {
    id: "demo-toa-baja",
    name: "GasGo Demo • Toa Baja",
    brand: "Shell",
    municipality: "Toa Baja",
    lat: 18.443,
    lon: -66.259
  },

  {
    id: "demo-dorado",
    name: "GasGo Demo • Dorado",
    brand: "Mobil",
    municipality: "Dorado",
    lat: 18.459,
    lon: -66.267
  },

  {
    id: "demo-vega-baja",
    name: "GasGo Demo • Vega Baja",
    brand: "Gulf",
    municipality: "Vega Baja",
    lat: 18.446,
    lon: -66.387
  },

  {
    id: "demo-manati",
    name: "GasGo Demo • Manatí",
    brand: "Puma",
    municipality: "Manatí",
    lat: 18.427,
    lon: -66.493
  },

  {
    id: "demo-arecibo",
    name: "GasGo Demo • Arecibo",
    brand: "Shell",
    municipality: "Arecibo",
    lat: 18.472,
    lon: -66.716
  },

  {
    id: "demo-aguadilla",
    name: "GasGo Demo • Aguadilla",
    brand: "Total",
    municipality: "Aguadilla",
    lat: 18.428,
    lon: -67.154
  },

  {
    id: "demo-mayaguez",
    name: "GasGo Demo • Mayagüez",
    brand: "Puma",
    municipality: "Mayagüez",
    lat: 18.202,
    lon: -67.139
  },

  {
    id: "demo-san-german",
    name: "GasGo Demo • San Germán",
    brand: "Gulf",
    municipality: "San Germán",
    lat: 18.082,
    lon: -67.045
  },

  {
    id: "demo-cabo-rojo",
    name: "GasGo Demo • Cabo Rojo",
    brand: "Texaco",
    municipality: "Cabo Rojo",
    lat: 18.086,
    lon: -67.145
  },

  {
    id: "demo-ponce",
    name: "GasGo Demo • Ponce",
    brand: "Shell",
    municipality: "Ponce",
    lat: 18.012,
    lon: -66.614
  },

  {
    id: "demo-juana-diaz",
    name: "GasGo Demo • Juana Díaz",
    brand: "Puma",
    municipality: "Juana Díaz",
    lat: 18.053,
    lon: -66.507
  },

  {
    id: "demo-coamo",
    name: "GasGo Demo • Coamo",
    brand: "Total",
    municipality: "Coamo",
    lat: 18.080,
    lon: -66.358
  },

  {
    id: "demo-cayey",
    name: "GasGo Demo • Cayey",
    brand: "Gulf",
    municipality: "Cayey",
    lat: 18.112,
    lon: -66.166
  },

  {
    id: "demo-caguas",
    name: "GasGo Demo • Caguas",
    brand: "Puma",
    municipality: "Caguas",
    lat: 18.234,
    lon: -66.048
  },

  {
    id: "demo-humacao",
    name: "GasGo Demo • Humacao",
    brand: "Shell",
    municipality: "Humacao",
    lat: 18.150,
    lon: -65.827
  },

  {
    id: "demo-fajardo",
    name: "GasGo Demo • Fajardo",
    brand: "Total",
    municipality: "Fajardo",
    lat: 18.325,
    lon: -65.652
  },

  {
    id: "demo-yabucoa",
    name: "GasGo Demo • Yabucoa",
    brand: "Texaco",
    municipality: "Yabucoa",
    lat: 18.050,
    lon: -65.879
  }

];


/* =========================================================
   HTML ESCAPE
   ========================================================= */

GasGoData.escapeHTML = function (value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

};


/* =========================================================
   NUMBER HELPERS
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


GasGoData.roundPrice = function (value) {

  return Math.round(
    Number(value) * 100
  ) / 100;

};


/* =========================================================
   HASH

   Used to generate deterministic demo price variation.
   The same station receives the same demo variation.
   ========================================================= */

GasGoData.hashString = function (text) {

  const string =
    String(text || "");

  let hash = 0;


  for (
    let i = 0;
    i < string.length;
    i++
  ) {

    hash =
      (
        (
          hash << 5
        ) -
        hash
      ) +
      string.charCodeAt(i);


    hash |= 0;

  }


  return Math.abs(hash);

};


/* =========================================================
   BRAND DETECTION
   ========================================================= */

GasGoData.detectBrand = function (tags = {}) {

  const combined = [

    tags.brand,

    tags.name,

    tags.operator,

    tags["brand:wikidata"],

    tags["operator:wikidata"]

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
    combined.includes("phillips 66") ||
    combined.includes("phillips66")
  ) {

    return "Phillips 66";

  }


  if (
    combined.includes("ecomaxx") ||
    combined.includes("eco maxx")
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
    combined.includes("ultra top")
  ) {

    return "Ultra Top Fuel";

  }


  if (
    combined.includes("bita")
  ) {

    return "Bita's";

  }


  if (
    /\b76\b/.test(combined)
  ) {

    return "76";

  }


  if (
    tags.brand &&
    String(tags.brand).trim()
  ) {

    return String(
      tags.brand
    ).trim();

  }


  return "Independent";

};


/* =========================================================
   MUNICIPALITY / ADDRESS DETECTION
   ========================================================= */

GasGoData.detectMunicipality = function (
  tags = {}
) {

  return (

    tags["addr:city"] ||

    tags["addr:municipality"] ||

    tags["addr:place"] ||

    tags["is_in:city"] ||

    tags["is_in"] ||

    ""

  );

};


/* =========================================================
   STATION NAME
   ========================================================= */

GasGoData.getStationName = function (
  tags,
  brand
) {

  if (
    tags &&
    tags.name
  ) {

    return String(
      tags.name
    ).trim();

  }


  if (
    brand &&
    brand !== "Independent"
  ) {

    return brand +
      " Fuel Station";

  }


  return "Fuel Station";

};


/* =========================================================
   GET COORDINATES
   ========================================================= */

GasGoData.getElementCoordinates = function (
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
   DEMO PRICE GENERATION
   ========================================================= */

GasGoData.getStationPrices = function (
  station
) {

  const base =
    GasGoData.BRAND_PRICES[
      station.brand
    ] ||
    GasGoData.BRAND_PRICES
      .Independent;


  const hash =
    GasGoData.hashString(
      [
        station.id,
        station.name,
        station.lat,
        station.lon
      ].join("|")
    );


  /*
    Four deterministic price offsets.

    Keeps the prototype visually varied while making it
    clear these are not live prices.
  */

  const variations = [
    -0.02,
    -0.01,
    0,
    0.01
  ];


  const regularVariation =
    variations[
      hash %
      variations.length
    ];


  const premiumVariation =
    variations[
      Math.floor(
        hash / 7
      ) %
      variations.length
    ];


  const dieselVariation =
    variations[
      Math.floor(
        hash / 13
      ) %
      variations.length
    ];


  return {

    regular:
      GasGoData.roundPrice(
        GasGoData.clamp(
          base.regular +
          regularVariation,
          1.14,
          1.18
        )
      ),

    premium:
      GasGoData.roundPrice(
        GasGoData.clamp(
          base.premium +
          premiumVariation,
          1.28,
          1.36
        )
      ),

    diesel:
      GasGoData.roundPrice(
        GasGoData.clamp(
          base.diesel +
          dieselVariation,
          1.41,
          1.45
        )
      )

  };

};


/* =========================================================
   NORMALIZE OSM ELEMENT
   ========================================================= */

GasGoData.normalizeElement = function (
  element
) {

  if (!element) {
    return null;
  }


  const coordinates =
    GasGoData.getElementCoordinates(
      element
    );


  if (!coordinates) {
    return null;
  }


  const tags =
    element.tags || {};


  const brand =
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

    name:
      GasGoData.getStationName(
        tags,
        brand
      ),

    brand,

    municipality:
      GasGoData.detectMunicipality(
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


  station.prices =
    GasGoData.getStationPrices(
      station
    );


  return station;

};


/* =========================================================
   NORMALIZE FALLBACK
   ========================================================= */

GasGoData.normalizeFallback = function (
  station
) {

  const result = {

    ...station,

    source:
      "GasGo demo location",

    demo:
      true,

    tags: {}

  };


  result.prices =
    GasGoData.getStationPrices(
      result
    );


  return result;

};


/* =========================================================
   GET FALLBACK
   ========================================================= */

GasGoData.getFallbackStations = function () {

  return GasGoData
    .FALLBACK_STATIONS
    .map(
      GasGoData.normalizeFallback
    );

};


/* =========================================================
   OVERPASS QUERY

   Includes:
   - nodes
   - ways
   - relations

   No artificial station limit.
   ========================================================= */

GasGoData.buildOverpassQuery = function () {

  const box = [

    GasGoData.PR_BBOX.south,

    GasGoData.PR_BBOX.west,

    GasGoData.PR_BBOX.north,

    GasGoData.PR_BBOX.east

  ].join(",");


  return `

[out:json][timeout:45];

(

  node
    ["amenity"="fuel"]
    (${box});

  way
    ["amenity"="fuel"]
    (${box});

  relation
    ["amenity"="fuel"]
    (${box});

);

out center tags;

  `.trim();

};


/* =========================================================
   FETCH WITH TIMEOUT
   ========================================================= */

GasGoData.fetchWithTimeout = async function (
  endpoint,
  query,
  timeout = 15000
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

    /*
      POST is used instead of stuffing the Overpass query
      into the URL.
    */

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

          method: "POST",

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


    if (
      !response.ok
    ) {

      throw new Error(
        "Overpass HTTP " +
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
        "Invalid Overpass response"
      );

    }


    return data;

  }

  finally {

    clearTimeout(
      timer
    );

  }

};


/* =========================================================
   REMOVE DUPLICATE LOCATIONS
   ========================================================= */

GasGoData.removeDuplicates = function (
  stations
) {

  const seen =
    new Set();


  const result = [];


  stations.forEach(
    station => {

      /*
        First use OSM object ID.

        Coordinate/name key is included as an additional
        protection against duplicated objects.
      */

      const lat =
        Number(
          station.lat
        ).toFixed(5);


      const lon =
        Number(
          station.lon
        ).toFixed(5);


      const key =
        (
          station.name +
          "|" +
          lat +
          "|" +
          lon
        )
          .toLowerCase();


      if (
        seen.has(key)
      ) {

        return;

      }


      seen.add(key);

      result.push(
        station
      );

    }
  );


  return result;

};


/* =========================================================
   FETCH ALL MAPPED STATIONS
   ========================================================= */

GasGoData.fetchStations = async function () {

  const query =
    GasGoData.buildOverpassQuery();


  let bestResult = [];

  let successfulServer = null;

  let lastError = null;


  /*
    Try each server.

    We keep the result with the largest number of usable
    stations rather than immediately trusting a tiny result.
  */

  for (
    const endpoint of
    GasGoData.OVERPASS_ENDPOINTS
  ) {

    try {

      console.log(
        "GasGo: querying",
        endpoint
      );


      const data =
        await GasGoData
          .fetchWithTimeout(
            endpoint,
            query,
            15000
          );


      const stations =
        GasGoData
          .removeDuplicates(
            data.elements
              .map(
                GasGoData.normalizeElement
              )
              .filter(Boolean)
          );


      console.log(
        "GasGo:",
        stations.length,
        "stations from",
        endpoint
      );


      if (
        stations.length >
        bestResult.length
      ) {

        bestResult =
          stations;

        successfulServer =
          endpoint;

      }


      /*
        If a server already returns a large station set,
        don't make the user wait for every other server.

        This is NOT a display limit.
      */

      if (
        stations.length >= 700
      ) {

        break;

      }

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


  /*
    Any meaningful OSM result is better than fake stations.
  */

  if (
    bestResult.length >= 25
  ) {

    return {

      stations:
        bestResult,

      source:
        "OpenStreetMap",

      endpoint:
        successfulServer,

      fallback:
        false,

      count:
        bestResult.length

    };

  }


  /*
    If a server returned a smaller real result, preserve it
    rather than silently pretending demo stations are real.
  */

  if (
    bestResult.length > 0
  ) {

    return {

      stations:
        bestResult,

      source:
        "OpenStreetMap",

      endpoint:
        successfulServer,

      fallback:
        false,

      count:
        bestResult.length,

      partial:
        true

    };

  }


  console.warn(
    "GasGo: all Overpass services failed.",
    lastError
  );


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

    count:
      fallback.length

  };

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

  const values = [
    lat1,
    lon1,
    lat2,
    lon2
  ].map(Number);


  if (
    values.some(
      value =>
        !Number.isFinite(value)
    )
  ) {

    return null;

  }


  const [
    aLat,
    aLon,
    bLat,
    bLon
  ] = values;


  const earthRadiusMiles =
    3958.7613;


  const toRadians =
    degrees =>
      degrees *
      Math.PI /
      180;


  const dLat =
    toRadians(
      bLat -
      aLat
    );


  const dLon =
    toRadians(
      bLon -
      aLon
    );


  const first =
    Math.sin(
      dLat / 2
    ) ** 2;


  const second =
    Math.cos(
      toRadians(aLat)
    ) *
    Math.cos(
      toRadians(bLat)
    ) *
    Math.sin(
      dLon / 2
    ) ** 2;


  const h =
    first +
    second;


  const angle =
    2 *
    Math.atan2(
      Math.sqrt(h),
      Math.sqrt(
        1 - h
      )
    );


  return (
    earthRadiusMiles *
    angle
  );

};


/* =========================================================
   FORMAT DISTANCE
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
   VEHICLE ESTIMATED RANGE
   ========================================================= */

GasGoData.getEstimatedVehicleRange = function (
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
    !Number.isFinite(fullRange) ||
    !Number.isFinite(level)
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

GasGoData.canIMakeIt = function (
  station,
  userLocation,
  vehicle
) {

  if (!station) {

    return {

      status: "unknown",

      message:
        "Select a station first.",

      distance: null,

      range:
        GasGoData
          .getEstimatedVehicleRange(
            vehicle
          ),

      remaining: null

    };

  }


  const range =
    GasGoData
      .getEstimatedVehicleRange(
        vehicle
      );


  if (
    !vehicle ||
    range <= 0
  ) {

    return {

      status: "unknown",

      message:
        "Add your vehicle information to estimate remaining range.",

      distance: null,

      range,

      remaining: null

    };

  }


  if (
    !userLocation
  ) {

    return {

      status: "unknown",

      message:
        "Share your location to compare your estimated range with this station.",

      distance: null,

      range,

      remaining: null

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
    !Number.isFinite(distance)
  ) {

    return {

      status: "unknown",

      message:
        "Distance could not be calculated.",

      distance: null,

      range,

      remaining: null

    };

  }


  const remaining =
    range -
    distance;


  /*
    Safety margin:

    SAFE:
    at least 25% more estimated range than straight-line
    distance.

    WARNING:
    enough estimated range, but margin is smaller.

    DANGER:
    estimated range is below the straight-line distance.

    This is still only a prototype estimate.
  */

  if (
    range >=
    distance * 1.25
  ) {

    return {

      status: "safe",

      message:
        "This station appears to be comfortably within your estimated range.",

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

      status: "warning",

      message:
        "This station may be within range, but your safety margin is low.",

      distance,

      range,

      remaining

    };

  }


  return {

    status: "danger",

    message:
      "Your estimated range is below the approximate distance to this station.",

    distance,

    range,

    remaining

  };

};


/* =========================================================
   SEARCH
   ========================================================= */

GasGoData.searchStations = function (
  stations,
  query
) {

  const text =
    String(
      query || ""
    )
      .trim()
      .toLowerCase();


  if (!text) {

    return [
      ...stations
    ];

  }


  return stations.filter(
    station => {

      const haystack = [

        station.name,

        station.brand,

        station.municipality,

        station.tags?.["addr:street"],

        station.tags?.["addr:city"],

        station.tags?.operator

      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();


      return haystack.includes(
        text
      );

    }
  );

};


/* =========================================================
   BRAND FILTER
   ========================================================= */

GasGoData.filterByBrand = function (
  stations,
  brand
) {

  if (
    !brand ||
    brand === "all"
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
        station.brand
      )
        .toLowerCase() ===
      target
  );

};


/* =========================================================
   CHEAPEST
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
          Number(
            a.prices?.[fuel]
          );


        const bPrice =
          Number(
            b.prices?.[fuel]
          );


        return (
          aPrice -
          bPrice
        );

      }
    );

};


/* =========================================================
   CLOSEST
   ========================================================= */

GasGoData.sortClosest = function (
  stations,
  origin
) {

  if (!origin) {

    return [
      ...stations
    ];

  }


  return [
    ...stations
  ]
    .sort(
      (a, b) => {

        const distanceA =
          GasGoData.distanceMiles(
            origin.lat,
            origin.lon,
            a.lat,
            a.lon
          );


        const distanceB =
          GasGoData.distanceMiles(
            origin.lat,
            origin.lon,
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
   AVERAGE PRICE
   ========================================================= */

GasGoData.averagePrice = function (
  stations,
  fuel = "regular"
) {

  const prices =
    stations
      .map(
        station =>
          Number(
            station.prices?.[fuel]
          )
      )
      .filter(
        Number.isFinite
      );


  if (
    prices.length === 0
  ) {

    return null;

  }


  return (
    prices.reduce(
      (sum, price) =>
        sum + price,
      0
    ) /
    prices.length
  );

};


/* =========================================================
   BEST VALUE

   Prototype scoring only.

   If location is unavailable:
   price drives the score.

   If location is available:
   both price and approximate distance matter.
   ========================================================= */

GasGoData.getBestValueScore = function (
  station,
  origin,
  fuel = "regular"
) {

  const price =
    Number(
      station.prices?.[fuel]
    );


  if (
    !Number.isFinite(price)
  ) {

    return Infinity;

  }


  /*
    Price component.

    Lower price = lower score = better.
  */

  let score =
    price * 100;


  if (origin) {

    const distance =
      GasGoData.distanceMiles(
        origin.lat,
        origin.lon,
        station.lat,
        station.lon
      );


    if (
      Number.isFinite(distance)
    ) {

      /*
        Small distance penalty so GasGo doesn't recommend
        driving far away merely to save one cent per liter.
      */

      score +=
        distance * 1.6;

    }

  }


  return score;

};


/* =========================================================
   SORT BEST VALUE
   ========================================================= */

GasGoData.sortBestValue = function (
  stations,
  origin,
  fuel = "regular"
) {

  return [
    ...stations
  ]
    .sort(
      (a, b) => {

        return (
          GasGoData.getBestValueScore(
            a,
            origin,
            fuel
          ) -
          GasGoData.getBestValueScore(
            b,
            origin,
            fuel
          )
        );

      }
    );

};


/* =========================================================
   SMART STOP
   ========================================================= */

GasGoData.getSmartStop = function (
  stations,
  origin,
  vehicle,
  fuel = "regular"
) {

  if (
    !Array.isArray(stations) ||
    stations.length === 0
  ) {

    return null;

  }


  let candidates =
    GasGoData.sortBestValue(
      stations,
      origin,
      fuel
    );


  /*
    With location available, don't recommend a station on
    the other side of Puerto Rico just because of price.
  */

  if (origin) {

    const nearby =
      candidates.filter(
        station => {

          const distance =
            GasGoData.distanceMiles(
              origin.lat,
              origin.lon,
              station.lat,
              station.lon
            );


          return (
            Number.isFinite(distance) &&
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


  const station =
    candidates[0];


  if (!station) {

    return null;

  }


  let distance = null;

  let safety = "unknown";


  if (origin) {

    distance =
      GasGoData.distanceMiles(
        origin.lat,
        origin.lon,
        station.lat,
        station.lon
      );


    const rangeResult =
      GasGoData.canIMakeIt(
        station,
        origin,
        vehicle
      );


    safety =
      rangeResult.status;

  }


  return {

    station,

    distance,

    safety

  };

};


/* =========================================================
   FIND SAFER STATION
   ========================================================= */

GasGoData.findSaferStation = function (
  stations,
  origin,
  vehicle,
  fuel = "regular"
) {

  if (
    !origin ||
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
    range <= 0
  ) {

    return null;

  }


  const candidates =
    stations
      .map(
        station => {

          const distance =
            GasGoData.distanceMiles(
              origin.lat,
              origin.lon,
              station.lat,
              station.lon
            );


          return {

            station,

            distance,

            price:
              Number(
                station.prices?.[fuel]
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


  candidates.sort(
    (a, b) => {

      /*
        Distance is the priority when finding a safer
        alternative.
      */

      if (
        Math.abs(
          a.distance -
          b.distance
        ) > 0.5
      ) {

        return (
          a.distance -
          b.distance
        );

      }


      return (
        a.price -
        b.price
      );

    }
  );


  return (
    candidates[0]?.station ||
    null
  );

};


/* =========================================================
   PRICE LEVEL
   ========================================================= */

GasGoData.getPriceLevel = function (
  price
) {

  const value =
    Number(price);


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


  return "normal";

};


/* =========================================================
   ESTIMATED SAVINGS
   ========================================================= */

GasGoData.estimateSavings = function (
  stationPrice,
  comparisonPrice,
  liters = 40
) {

  const selected =
    Number(
      stationPrice
    );


  const comparison =
    Number(
      comparisonPrice
    );


  const volume =
    Number(
      liters
    );


  if (
    !Number.isFinite(selected) ||
    !Number.isFinite(comparison) ||
    !Number.isFinite(volume)
  ) {

    return 0;

  }


  return Math.max(
    0,
    (
      comparison -
      selected
    ) *
    volume
  );

};


/* =========================================================
   GOOGLE MAPS DIRECTIONS
   ========================================================= */

GasGoData.getGoogleMapsURL = function (
  station
) {

  if (!station) {
    return "";
  }


  const destination =
    encodeURIComponent(
      station.lat +
      "," +
      station.lon
    );


  return (
    "https://www.google.com/maps/dir/?api=1&destination=" +
    destination
  );

};


/* =========================================================
   APPLE MAPS DIRECTIONS
   ========================================================= */

GasGoData.getAppleMapsURL = function (
  station
) {

  if (!station) {
    return "";
  }


  const destination =
    encodeURIComponent(
      station.lat +
      "," +
      station.lon
    );


  return (
    "https://maps.apple.com/?daddr=" +
    destination +
    "&dirflg=d"
  );

};


/* =========================================================
   DEBUG INFO
   ========================================================= */

GasGoData.debug = function () {

  console.log(
    "GasGo station engine ready."
  );


  console.log(
    "Overpass endpoints:",
    GasGoData
      .OVERPASS_ENDPOINTS
      .length
  );


  console.log(
    "Fallback stations:",
    GasGoData
      .FALLBACK_STATIONS
      .length
  );

};


/* =========================================================
   READY
   ========================================================= */

console.log(
  "GasGo stations.js v5.1 loaded"
);
