"use strict";

/* =========================================================
   GASGO MAP ENHANCEMENT
   Version 5.5.0

   Requires:
   - Leaflet
   - stations.js
   - app.js V5.4+

   This file intentionally overrides ONLY map-related
   GasGoApp behavior.
   ========================================================= */

(function () {

  if (!window.GasGoApp) {
    console.error("GasGo Map V5.5: app.js must load first.");
    return;
  }

  if (!window.GasGoData) {
    console.error("GasGo Map V5.5: stations.js must load first.");
    return;
  }

  if (typeof L === "undefined") {
    console.error("GasGo Map V5.5: Leaflet is missing.");
    return;
  }

  const App = window.GasGoApp;
  const Data = window.GasGoData;

  App.MAP_VERSION = "5.5.0";


  /* =======================================================
     MAP COLORS
     ======================================================= */

  const COLORS = {

    cheap: "#00C853",

    average: "#FFD54F",

    expensive: "#FF5252",

    ev: "#29B6F6",

    selected: "#FFFFFF",

    outline: "#0F1111",

    unknown: "#9E9E9E"

  };


  /* =======================================================
     DARK MAP TILES
     ======================================================= */

  const DARK_TILE_URL =
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";


  const DARK_TILE_ATTRIBUTION =
    '&copy; OpenStreetMap contributors &copy; CARTO';


  /* =======================================================
     HELPERS
     ======================================================= */

  function validNumber(value) {

    const number = Number(value);

    return Number.isFinite(number);

  }


  function getFuelPrice(station) {

    if (!station || station.type !== "fuel") {
      return null;
    }


    let prices = station.prices;


    if (
      !prices &&
      typeof Data.getStationPrices === "function"
    ) {

      try {

        prices =
          Data.getStationPrices(station);

      } catch (error) {

        console.warn(
          "GasGo: couldn't read station price.",
          error
        );

      }

    }


    if (!prices) {
      return null;
    }


    const price =
      Number(
        prices[App.state.selectedFuel]
      );


    return Number.isFinite(price)
      ? price
      : null;

  }


  /* =======================================================
     PRICE STATISTICS

     We calculate relative price levels from the fuel
     stations currently visible through the filters.

     This means changing Regular / Premium / Diesel
     automatically changes the marker classification.
     ======================================================= */

  function getPriceStatistics() {

    const prices =
      App.state.filteredStations
        .filter(
          station =>
            station.type === "fuel"
        )
        .map(getFuelPrice)
        .filter(validNumber);


    if (!prices.length) {

      return {
        average: null,
        cheapLimit: null,
        expensiveLimit: null
      };

    }


    const average =
      prices.reduce(
        (sum, price) =>
          sum + price,
        0
      ) /
      prices.length;


    /*
      Two cents per liter around the current average.

      Example:
      Average = $1.16/L

      Green  <= $1.14
      Yellow = $1.14–$1.18
      Red    >= $1.18
    */

    const margin = 0.02;


    return {

      average,

      cheapLimit:
        average - margin,

      expensiveLimit:
        average + margin

    };

  }


  function getPriceLevel(
    station,
    statistics
  ) {

    if (station.type === "ev") {
      return "ev";
    }


    const price =
      getFuelPrice(station);


    if (
      !validNumber(price) ||
      !validNumber(statistics.average)
    ) {

      return "unknown";

    }


    if (
      price <= statistics.cheapLimit
    ) {

      return "cheap";

    }


    if (
      price >= statistics.expensiveLimit
    ) {

      return "expensive";

    }


    return "average";

  }


  function getMarkerColor(
    station,
    statistics
  ) {

    const level =
      getPriceLevel(
        station,
        statistics
      );


    return (
      COLORS[level] ||
      COLORS.unknown
    );

  }


  /* =======================================================
     MAP LOADER
     ======================================================= */

  function hideMapLoader() {

    const loader =
      document.getElementById(
        "mapLoader"
      );


    if (loader) {

      loader.style.display =
        "none";

    }

  }


  /* =======================================================
     PRICE LEGEND
     ======================================================= */

  function addLegend() {

    if (
      !App.state.map ||
      App.state.map._gasgoLegendAdded
    ) {
      return;
    }


    const legend =
      L.control({
        position: "bottomright"
      });


    legend.onAdd = function () {

      const div =
        L.DomUtil.create(
          "div",
          "gasgo-map-legend"
        );


      div.innerHTML = `

        <div class="gasgo-legend-title">
          GasGo
        </div>

        <div class="gasgo-legend-row">
          <span
            class="gasgo-legend-dot"
            style="background:${COLORS.cheap}"
          ></span>
          Lower price
        </div>

        <div class="gasgo-legend-row">
          <span
            class="gasgo-legend-dot"
            style="background:${COLORS.average}"
          ></span>
          Average
        </div>

        <div class="gasgo-legend-row">
          <span
            class="gasgo-legend-dot"
            style="background:${COLORS.expensive}"
          ></span>
          Higher price
        </div>

        <div class="gasgo-legend-row">
          <span
            class="gasgo-legend-dot"
            style="background:${COLORS.ev}"
          ></span>
          EV charger
        </div>

      `;


      L.DomEvent.disableClickPropagation(
        div
      );


      return div;

    };


    legend.addTo(
      App.state.map
    );


    App.state.map._gasgoLegendAdded =
      true;

  }


  /* =======================================================
     INITIALIZE DARK MAP

     Overrides App.initializeMap from V5.4.
     ======================================================= */

  App.initializeMap = function () {

    if (App.state.mapInitialized) {

      if (App.state.map) {

        setTimeout(() => {

          App.state.map.invalidateSize(
            true
          );

        }, 80);

      }

      return;

    }


    const mapElement =
      document.getElementById(
        "map"
      );


    if (!mapElement) {
      return;
    }


    const center =
      Data.PR_CENTER || {
        lat: 18.2208,
        lon: -66.5901,
        zoom: 9
      };


    try {

      App.state.map =
        L.map(
          "map",
          {

            zoomControl: true,

            preferCanvas: true,

            attributionControl: true

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
          DARK_TILE_URL,
          {

            maxZoom: 20,

            subdomains:
              "abcd",

            attribution:
              DARK_TILE_ATTRIBUTION

          }
        );


      tiles.addTo(
        App.state.map
      );


      tiles.once(
        "load",
        hideMapLoader
      );


      tiles.on(
        "tileerror",
        function () {

          /*
            Do not leave the loading overlay stuck
            if one or more map tiles fail.
          */

          hideMapLoader();

        }
      );


      /*
        Safari/iPhone safety:
        Never allow the loader to stay indefinitely.
      */

      setTimeout(
        hideMapLoader,
        1800
      );


      App.state.mapInitialized =
        true;


      addLegend();


      setTimeout(() => {

        if (App.state.map) {

          App.state.map.invalidateSize(
            true
          );

        }

      }, 120);


      if (
        App.state.stationsLoaded
      ) {

        App.renderMapStations();

      } else if (
        !App.state.stationsLoading
      ) {

        App.loadStations();

      }


      console.log(
        "GasGo dark map initialized 🌙"
      );

    } catch (error) {

      console.error(
        "GasGo map initialization error:",
        error
      );


      hideMapLoader();


      if (
        typeof App.toast ===
        "function"
      ) {

        App.toast(
          "The map couldn't load correctly.",
          "error"
        );

      }

    }

  };


  /* =======================================================
     MAP MARKERS

     Fuel:
     green  = lower price
     yellow = average
     red    = higher price

     EV:
     blue

     Selected:
     larger + white outline
     ======================================================= */

  App.renderMapStations = function () {

    /*
      The station list must continue working even before
      the Leaflet map has been initialized.
    */

    if (
      !App.state.map ||
      !App.state.markerLayer
    ) {

      if (
        typeof App.renderStationList ===
        "function"
      ) {

        App.renderStationList();

      }

      return;

    }


    App.state.markerLayer
      .clearLayers();


    App.state.markers.clear();


    const statistics =
      getPriceStatistics();


    /*
      Performance protection.

      Puerto Rico can contain hundreds of mapped
      locations. Leaflet Canvas handles circle markers
      much better than hundreds of permanent HTML icons.
    */

    App.state.filteredStations
      .forEach(station => {


        if (
          !validNumber(station.lat) ||
          !validNumber(station.lon)
        ) {
          return;
        }


        const selected =
          String(
            App.state.selectedStation?.id
          ) ===
          String(station.id);


        const color =
          getMarkerColor(
            station,
            statistics
          );


        const marker =
          L.circleMarker(

            [
              Number(station.lat),
              Number(station.lon)
            ],

            {

              radius:
                selected
                  ? 11
                  : station.type === "ev"
                    ? 8
                    : 7,

              color:
                selected
                  ? COLORS.selected
                  : COLORS.outline,

              weight:
                selected
                  ? 4
                  : 2,

              opacity: 1,

              fillColor:
                color,

              fillOpacity:
                selected
                  ? 1
                  : 0.92,

              bubblingMouseEvents:
                true

            }

          );


        /*
          Tooltip appears only when interacting with
          the marker. We DO NOT create hundreds of
          permanent emoji tooltips anymore.
        */

        const price =
          getFuelPrice(station);


        let tooltipText;


        if (
          station.type === "ev"
        ) {

          tooltipText =
            "⚡ " +
            (
              station.name ||
              "EV Charger"
            );

        } else {

          tooltipText =
            "⛽ " +
            (
              station.name ||
              "Fuel Station"
            );


          if (
            validNumber(price)
          ) {

            tooltipText +=
              " • $" +
              Number(price).toFixed(2) +
              "/L";

          }

        }


        marker.bindTooltip(
          tooltipText,
          {

            direction: "top",

            offset: [0, -8],

            opacity: 0.96

          }
        );


        if (
          typeof App.stationPopupHTML ===
          "function"
        ) {

          marker.bindPopup(
            App.stationPopupHTML(
              station
            ),
            {

              maxWidth: 300,

              className:
                "gasgo-dark-popup"

            }
          );

        }


        marker.on(
          "click",
          function () {

            if (
              typeof App.selectStation ===
              "function"
            ) {

              App.selectStation(
                station,
                false
              );

            }

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


    if (
      typeof App.renderStationList ===
      "function"
    ) {

      App.renderStationList();

    }


    updateLegendPriceInfo(
      statistics
    );

  };


  /* =======================================================
     DYNAMIC LEGEND PRICE INFORMATION
     ======================================================= */

  function updateLegendPriceInfo(
    statistics
  ) {

    const legend =
      document.querySelector(
        ".gasgo-map-legend"
      );


    if (!legend) {
      return;
    }


    const oldInfo =
      legend.querySelector(
        ".gasgo-legend-average"
      );


    if (oldInfo) {
      oldInfo.remove();
    }


    if (
      !validNumber(
        statistics.average
      )
    ) {
      return;
    }


    const info =
      document.createElement(
        "div"
      );


    info.className =
      "gasgo-legend-average";


    const fuelName =
      String(
        App.state.selectedFuel ||
        "regular"
      );


    info.innerHTML = `

      ${fuelName.charAt(0).toUpperCase() +
        fuelName.slice(1)}

      avg.

      <strong>
        $${statistics.average.toFixed(2)}/L
      </strong>

    `;


    legend.appendChild(
      info
    );

  }


  /* =======================================================
     BETTER SMART STOP SCORING

     For fuel:
       - price matters
       - distance matters when location is available

     For EV:
       - distance is prioritized
       - no fake price/availability data

     ======================================================= */

  function scoreFuelStation(
    station,
    averagePrice
  ) {

    const price =
      getFuelPrice(station);


    if (!validNumber(price)) {
      return Infinity;
    }


    /*
      No location:
      price alone is used.
    */

    if (
      !App.state.userLocation
    ) {

      return price;

    }


    const distance =
      Data.distanceMiles(

        App.state.userLocation.lat,

        App.state.userLocation.lon,

        station.lat,

        station.lon

      );


    /*
      Relative price difference.

      Cheaper stations reduce score.
      More distant stations increase score.

      This intentionally avoids pretending that
      the score is an exact financial calculation.
    */

    const priceDifference =
      validNumber(averagePrice)
        ? price - averagePrice
        : 0;


    const priceScore =
      priceDifference * 100;


    const distanceScore =
      distance * 0.75;


    return (
      priceScore +
      distanceScore
    );

  }


  function getBestFuelSmartStop(
    stations
  ) {

    const fuelStations =
      stations.filter(
        station =>
          station.type === "fuel"
      );


    if (!fuelStations.length) {
      return null;
    }


    const prices =
      fuelStations
        .map(getFuelPrice)
        .filter(validNumber);


    const average =
      prices.length
        ? prices.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
          prices.length
        : null;


    return [
      ...fuelStations
    ]
      .sort(
        (a, b) =>
          scoreFuelStation(
            a,
            average
          ) -
          scoreFuelStation(
            b,
            average
          )
      )[0] || null;

  }


  function getBestEVSmartStop(
    stations
  ) {

    const chargers =
      stations.filter(
        station =>
          station.type === "ev"
      );


    if (!chargers.length) {
      return null;
    }


    if (
      !App.state.userLocation
    ) {

      return chargers[0];

    }


    return [
      ...chargers
    ]
      .sort(
        (a, b) => {

          const distanceA =
            Data.distanceMiles(

              App.state.userLocation.lat,

              App.state.userLocation.lon,

              a.lat,

              a.lon

            );


          const distanceB =
            Data.distanceMiles(

              App.state.userLocation.lat,

              App.state.userLocation.lon,

              b.lat,

              b.lon

            );


          return (
            distanceA -
            distanceB
          );

        }
      )[0] || null;

  }


  /* =======================================================
     SMART STOP V5.5
     ======================================================= */

  App.updateSmartStop = function () {

    const card =
      document.getElementById(
        "smartStopCard"
      );


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
          Comparing mapped energy options.
        </div>

      `;

      return;

    }


    const mode =
      typeof App.getVehicleEnergyMode ===
      "function"
        ? App.getVehicleEnergyMode()
        : "fuel";


    let station = null;


    if (mode === "ev") {

      station =
        getBestEVSmartStop(
          App.state.stations
        );

    } else if (
      mode === "both"
    ) {

      /*
        PHEV:
        The closest relevant energy stop is preferred
        when location exists.

        We don't invent an equivalence between EV
        charging price and gasoline price.
      */

      const fuel =
        getBestFuelSmartStop(
          App.state.stations
        );


      const ev =
        getBestEVSmartStop(
          App.state.stations
        );


      if (
        App.state.userLocation &&
        fuel &&
        ev
      ) {

        const fuelDistance =
          Data.distanceMiles(

            App.state.userLocation.lat,

            App.state.userLocation.lon,

            fuel.lat,

            fuel.lon

          );


        const evDistance =
          Data.distanceMiles(

            App.state.userLocation.lat,

            App.state.userLocation.lon,

            ev.lat,

            ev.lon

          );


        station =
          evDistance < fuelDistance
            ? ev
            : fuel;

      } else {

        station =
          fuel ||
          ev;

      }

    } else {

      station =
        getBestFuelSmartStop(
          App.state.stations
        );

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
        Data.distanceMiles(

          App.state.userLocation.lat,

          App.state.userLocation.lon,

          station.lat,

          station.lon

        );


      distanceText =
        Data.formatDistance(
          distance
        );

    }


    /* EV SMART STOP */

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
            <small>
              EV
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
              Est. range
            </span>

            <strong>
              ${Math.round(
                App.getVehicleRange()
              )} mi
            </strong>

          </div>

        </div>


        <div class="muted mt-8">
          Recommended from mapped charger information.
          Live availability is not assumed.
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


    /* FUEL SMART STOP */

    const price =
      getFuelPrice(
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
              station.brand ||
              "Fuel Station"
            )}
          </div>

        </div>


        <div class="smart-stop-price">

          ${
            validNumber(price)
              ? "$" +
                Number(price)
                  .toFixed(2)
              : "—"
          }

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
            ${App.escape(
              App.state.selectedFuel
            )}
          </strong>

        </div>

      </div>


      <div class="muted mt-8">
        Smart Stop balances prototype fuel price and
        approximate distance when location is available.
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


  /* =======================================================
     ADD MAP CSS WITHOUT TOUCHING STYLE.CSS
     ======================================================= */

  function installMapStyles() {

    if (
      document.getElementById(
        "gasgo-map-v55-styles"
      )
    ) {
      return;
    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "gasgo-map-v55-styles";


    style.textContent = `

      /* ================================================
         GASGO DARK MAP V5.5
         ================================================ */

      #map {
        background:
          #0b0e0d !important;
      }


      .leaflet-container {
        background:
          #0b0e0d !important;

        font-family:
          inherit;
      }


      .leaflet-control-zoom a {
        background:
          #111614 !important;

        color:
          #ffffff !important;

        border-color:
          rgba(255,255,255,.08) !important;
      }


      .leaflet-control-zoom a:hover {
        background:
          #18201d !important;

        color:
          #00C853 !important;
      }


      .leaflet-control-attribution {
        background:
          rgba(8,11,10,.82) !important;

        color:
          #9da7a2 !important;

        backdrop-filter:
          blur(8px);
      }


      .leaflet-control-attribution a {
        color:
          #c9d1cd !important;
      }


      /* POPUPS */

      .gasgo-dark-popup
      .leaflet-popup-content-wrapper {

        background:
          #101513;

        color:
          #ffffff;

        border:
          1px solid
          rgba(255,255,255,.08);

        border-radius:
          16px;

        box-shadow:
          0 12px 40px
          rgba(0,0,0,.45);

      }


      .gasgo-dark-popup
      .leaflet-popup-tip {

        background:
          #101513;

      }


      .gasgo-dark-popup
      .leaflet-popup-close-button {

        color:
          #ffffff !important;

      }


      /* TOOLTIP */

      .leaflet-tooltip {

        background:
          #101513;

        color:
          #ffffff;

        border:
          1px solid
          rgba(255,255,255,.12);

        border-radius:
          10px;

        box-shadow:
          0 6px 20px
          rgba(0,0,0,.35);

        font-weight:
          700;

      }


      .leaflet-tooltip-top:before {

        border-top-color:
          #101513;

      }


      /* GASGO LEGEND */

      .gasgo-map-legend {

        min-width:
          132px;

        padding:
          10px 12px;

        background:
          rgba(12,16,14,.94);

        color:
          #ffffff;

        border:
          1px solid
          rgba(255,255,255,.10);

        border-radius:
          14px;

        box-shadow:
          0 8px 28px
          rgba(0,0,0,.38);

        backdrop-filter:
          blur(12px);

        font-size:
          11px;

        line-height:
          1.35;

      }


      .gasgo-legend-title {

        margin-bottom:
          7px;

        color:
          #00C853;

        font-size:
          12px;

        font-weight:
          900;

        letter-spacing:
          .04em;

      }


      .gasgo-legend-row {

        display:
          flex;

        align-items:
          center;

        gap:
          7px;

        margin:
          5px 0;

        white-space:
          nowrap;

      }


      .gasgo-legend-dot {

        width:
          9px;

        height:
          9px;

        flex:
          0 0 9px;

        border:
          1px solid
          rgba(255,255,255,.75);

        border-radius:
          50%;

        box-shadow:
          0 0 0 1px
          rgba(0,0,0,.25);

      }


      .gasgo-legend-average {

        margin-top:
          8px;

        padding-top:
          7px;

        border-top:
          1px solid
          rgba(255,255,255,.08);

        color:
          #9da7a2;

        font-size:
          10px;

      }


      .gasgo-legend-average strong {

        color:
          #ffffff;

      }


      /* USER LOCATION */

      .user-location-marker {

        width:
          16px;

        height:
          16px;

        background:
          #ffffff;

        border:
          4px solid
          #2D8CFF;

        border-radius:
          50%;

        box-shadow:
          0 0 0 5px
          rgba(45,140,255,.20),
          0 3px 12px
          rgba(0,0,0,.45);

      }


      @media
      (max-width: 430px) {

        .gasgo-map-legend {

          min-width:
            118px;

          padding:
            8px 10px;

          font-size:
            10px;

        }

      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =======================================================
     INSTALL
     ======================================================= */

  installMapStyles();


  /*
    If the map was somehow initialized before this file
    executed, rebuild it so the new dark tile layer is used.

    Normally this does not happen because GasGo initializes
    the map only when Stations is opened.
  */

  if (
    App.state.mapInitialized &&
    App.state.map
  ) {

    try {

      App.state.map.remove();

    } catch (error) {

      console.warn(
        "GasGo map reset:",
        error
      );

    }


    App.state.map = null;

    App.state.markerLayer = null;

    App.state.userMarker = null;

    App.state.markers =
      new Map();

    App.state.mapInitialized =
      false;

  }


  console.log(
    "GasGo Map V5.5 loaded 🌙🟢🟡🔴🔵"
  );

})();
