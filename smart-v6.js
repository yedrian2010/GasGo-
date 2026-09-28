"use strict";

/* =========================================================
   GASGO SMART SYSTEM
   Version 6.0.0

   Adds:
   - Reactive Home range status
   - Can I Make It? V6
   - Safer Stop recommendations
   - Fuel / EV / PHEV support
   - Conservative range margin
   - No guaranteed-range claims

   Requires:
   stations.js
   app.js V5.4+
   map-v55.js V5.5+
   ========================================================= */

(function () {

  if (!window.GasGoApp || !window.GasGoData) {
    console.error(
      "GasGo Smart V6: GasGoApp and GasGoData are required."
    );
    return;
  }

  const App = window.GasGoApp;
  const Data = window.GasGoData;

  App.SMART_VERSION = "6.0.0";


  /* =======================================================
     CONFIGURATION
     ======================================================= */

  const CONFIG = {

    /*
      We reserve 25% of the vehicle's estimated range
      as a safety margin.

      This is a GasGo prototype rule — not a guarantee
      that a vehicle will achieve that range.
    */

    safetyReserve: 0.25,

    /*
      Home status thresholds based on current
      fuel/battery percentage.
    */

    comfortableLevel: 35,

    lowLevel: 20,

    criticalLevel: 10,

    /*
      Maximum distance considered useful when looking
      for an emergency/safer alternative.
    */

    maxSaferDistanceMiles: 50

  };


  /* =======================================================
     HELPERS
     ======================================================= */

  function number(value) {

    const n = Number(value);

    return Number.isFinite(n)
      ? n
      : null;

  }


  function escapeHTML(value) {

    if (
      typeof App.escape === "function"
    ) {

      return App.escape(value);

    }

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  function formatMiles(value) {

    const miles =
      number(value);

    if (miles === null) {
      return "—";
    }

    if (miles < 10) {

      return (
        miles.toFixed(1) +
        " mi"
      );

    }

    return (
      Math.round(miles) +
      " mi"
    );

  }


  function getVehicle() {

    return (
      App.state.vehicle ||
      null
    );

  }


  function getVehicleLevel() {

    const vehicle =
      getVehicle();

    if (!vehicle) {
      return 0;
    }

    return Math.max(
      0,
      Math.min(
        100,
        Number(vehicle.level) || 0
      )
    );

  }


  function getEstimatedRange() {

    if (
      typeof App.getVehicleRange ===
      "function"
    ) {

      const range =
        Number(
          App.getVehicleRange()
        );

      if (
        Number.isFinite(range)
      ) {

        return Math.max(
          0,
          range
        );

      }

    }


    const vehicle =
      getVehicle();

    if (!vehicle) {
      return 0;
    }


    const fullRange =
      Number(
        vehicle.fullRange
      ) || 0;

    const level =
      getVehicleLevel();


    return Math.max(
      0,
      fullRange *
      level /
      100
    );

  }


  function getEnergyMode() {

    if (
      typeof App.getVehicleEnergyMode ===
      "function"
    ) {

      return (
        App.getVehicleEnergyMode() ||
        "fuel"
      );

    }

    return "fuel";

  }


  function getEnergyWord() {

    const vehicle =
      getVehicle();

    if (
      vehicle &&
      vehicle.powertrain ===
      "Electric"
    ) {

      return "battery";

    }

    return "fuel";

  }


  function getDistanceToStation(
    station
  ) {

    if (
      !station ||
      !App.state.userLocation
    ) {

      return null;

    }


    if (
      typeof Data.distanceMiles !==
      "function"
    ) {

      return null;

    }


    const distance =
      Data.distanceMiles(

        App.state.userLocation.lat,

        App.state.userLocation.lon,

        station.lat,

        station.lon

      );


    return number(distance);

  }


  function stationCompatible(
    station
  ) {

    if (!station) {
      return false;
    }


    const mode =
      getEnergyMode();


    if (mode === "ev") {

      return (
        station.type === "ev"
      );

    }


    if (mode === "fuel") {

      return (
        station.type === "fuel"
      );

    }


    /*
      Plug-in hybrid:
      fuel and EV are both considered.
    */

    return (
      station.type === "fuel" ||
      station.type === "ev"
    );

  }


  /* =======================================================
     RANGE ANALYSIS
     ======================================================= */

  function analyzeRange(
    station
  ) {

    const estimatedRange =
      getEstimatedRange();


    const distance =
      getDistanceToStation(
        station
      );


    if (
      distance === null
    ) {

      return {

        status: "location",

        estimatedRange,

        distance: null,

        remaining: null,

        safetyRange:
          estimatedRange *
          (
            1 -
            CONFIG.safetyReserve
          )

      };

    }


    const remaining =
      estimatedRange -
      distance;


    const safetyRange =
      estimatedRange *
      (
        1 -
        CONFIG.safetyReserve
      );


    let status;


    /*
      GREEN

      Destination is inside the conservative
      75% range envelope.
    */

    if (
      distance <=
      safetyRange
    ) {

      status = "safe";

    }


    /*
      YELLOW

      Destination is technically inside the
      estimated range, but outside GasGo's
      conservative margin.
    */

    else if (
      distance <=
      estimatedRange
    ) {

      status = "warning";

    }


    /*
      RED

      Approximate distance exceeds estimated
      remaining range.
    */

    else {

      status = "danger";

    }


    return {

      status,

      estimatedRange,

      distance,

      remaining,

      safetyRange

    };

  }


  App.analyzeRange =
    analyzeRange;


  /* =======================================================
     COMPATIBLE STATIONS
     ======================================================= */

  function getCompatibleStations() {

    return (
      App.state.stations || []
    ).filter(
      stationCompatible
    );

  }


  /* =======================================================
     CLOSEST COMPATIBLE STATION
     ======================================================= */

  function getClosestCompatibleStation() {

    if (
      !App.state.userLocation
    ) {

      return null;

    }


    const stations =
      getCompatibleStations();


    let best = null;

    let bestDistance =
      Infinity;


    stations.forEach(
      station => {

        const distance =
          getDistanceToStation(
            station
          );


        if (
          distance === null
        ) {
          return;
        }


        if (
          distance <
          bestDistance
        ) {

          best =
            station;

          bestDistance =
            distance;

        }

      }
    );


    return best;

  }


  /* =======================================================
     FIND SAFER STATION
     ======================================================= */

  function findSaferStation(
    selectedStation
  ) {

    if (
      !App.state.userLocation
    ) {

      return null;

    }


    const currentAnalysis =
      selectedStation
        ? analyzeRange(
            selectedStation
          )
        : null;


    const stations =
      getCompatibleStations();


    const candidates = [];


    stations.forEach(
      station => {

        if (
          selectedStation &&
          String(station.id) ===
          String(
            selectedStation.id
          )
        ) {
          return;
        }


        const analysis =
          analyzeRange(
            station
          );


        if (
          analysis.distance ===
          null
        ) {
          return;
        }


        if (
          analysis.distance >
          CONFIG.maxSaferDistanceMiles
        ) {
          return;
        }


        /*
          Prefer stops inside the conservative
          safety range.
        */

        const priority =
          analysis.status === "safe"
            ? 0
            : analysis.status === "warning"
              ? 1
              : 2;


        candidates.push({

          station,

          analysis,

          priority

        });

      }
    );


    candidates.sort(
      (a, b) => {

        if (
          a.priority !==
          b.priority
        ) {

          return (
            a.priority -
            b.priority
          );

        }


        return (
          a.analysis.distance -
          b.analysis.distance
        );

      }
    );


    if (
      !candidates.length
    ) {

      return null;

    }


    const best =
      candidates[0];


    /*
      If the selected station is already the safer
      or closer option, don't pretend another one
      is better.
    */

    if (
      currentAnalysis &&
      currentAnalysis.status ===
        "safe" &&
      best.analysis.distance >=
        currentAnalysis.distance
    ) {

      return null;

    }


    return best;

  }


  App.getSaferStation =
    findSaferStation;


  /* =======================================================
     HOME RANGE STATUS
     ======================================================= */

  function getHomeStatus() {

    const level =
      getVehicleLevel();

    const range =
      getEstimatedRange();


    if (
      level <=
      CONFIG.criticalLevel
    ) {

      return {

        status: "critical",

        icon: "🔴",

        title:
          "Critical " +
          getEnergyWord() +
          " level",

        message:
          "Find a nearby stop soon.",

        range

      };

    }


    if (
      level <=
      CONFIG.lowLevel
    ) {

      return {

        status: "low",

        icon: "🟠",

        title:
          "Low " +
          getEnergyWord(),

        message:
          "GasGo recommends planning your next stop.",

        range

      };

    }


    if (
      level <=
      CONFIG.comfortableLevel
    ) {

      return {

        status: "watch",

        icon: "🟡",

        title:
          "Plan ahead",

        message:
          "You may want to plan your next stop.",

        range

      };

    }


    return {

      status: "good",

      icon: "🟢",

      title:
        "You're good to go",

      message:
        "No immediate stop recommended.",

      range

    };

  }


  /* =======================================================
     HOME SMART RANGE CARD
     ======================================================= */

  function ensureHomeRangeStatus() {

    let card =
      document.getElementById(
        "gasgoHomeRangeStatus"
      );


    if (card) {
      return card;
    }


    /*
      We insert the card directly after the main
      range hero. If the hero class changes later,
      we fall back to the Smart Stop card.
    */

    const rangeHero =
      document.querySelector(
        ".range-hero"
      );


    const smartStop =
      document.getElementById(
        "smartStopCard"
      );


    const target =
      rangeHero ||
      smartStop;


    if (!target) {
      return null;
    }


    card =
      document.createElement(
        "div"
      );


    card.id =
      "gasgoHomeRangeStatus";


    card.className =
      "gasgo-range-status";


    if (
      rangeHero &&
      rangeHero.parentNode
    ) {

      rangeHero.insertAdjacentElement(
        "afterend",
        card
      );

    } else if (
      smartStop &&
      smartStop.parentNode
    ) {

      smartStop.parentNode.insertBefore(
        card,
        smartStop
      );

    }


    return card;

  }


  function renderHomeRangeStatus() {

    const card =
      ensureHomeRangeStatus();


    if (!card) {
      return;
    }


    const status =
      getHomeStatus();


    const closest =
      getClosestCompatibleStation();


    let recommendation = "";


    if (
      App.state.userLocation &&
      closest &&
      (
        status.status === "critical" ||
        status.status === "low"
      )
    ) {

      const distance =
        getDistanceToStation(
          closest
        );


      recommendation = `

        <button
          class="gasgo-range-stop"
          onclick="GasGoApp.openRangeRecommendedStop()"
        >

          <span>

            <small>
              NEARBY OPTION
            </small>

            <strong>
              ${escapeHTML(
                closest.name
              )}
            </strong>

          </span>


          <b>
            ${formatMiles(
              distance
            )}
            →
          </b>

        </button>

      `;


      App.state.rangeRecommendedStop =
        closest;

    } else {

      App.state.rangeRecommendedStop =
        null;

    }


    card.dataset.status =
      status.status;


    card.innerHTML = `

      <div class="gasgo-range-status-main">

        <div class="gasgo-range-status-icon">
          ${status.icon}
        </div>


        <div class="gasgo-range-status-copy">

          <strong>
            ${escapeHTML(
              status.title
            )}
          </strong>

          <span>
            ${escapeHTML(
              status.message
            )}
          </span>

        </div>


        <div class="gasgo-range-status-range">

          <strong>
            ${Math.round(
              status.range
            )}
          </strong>

          <span>
            MI EST.
          </span>

        </div>

      </div>


      ${recommendation}

    `;

  }


  App.openRangeRecommendedStop =
  function () {

    const station =
      App.state
        .rangeRecommendedStop;


    if (!station) {
      return;
    }


    App.showScreen(
      "stations"
    );


    setTimeout(
      function () {

        App.selectStation(
          station,
          true
        );

      },
      180
    );

  };


  /* =======================================================
     CAN I MAKE IT? V6
     ======================================================= */

  App.renderCanIMakeIt =
  function () {

    const element =
      document.getElementById(
        "rangeResult"
      );


    if (!element) {
      return;
    }


    const station =
      App.state.selectedStation;


    if (!station) {

      element.className =
        "range-result";

      element.innerHTML = `

        <div class="range-result-title">
          Can I Make It?
        </div>

        Select a location to compare it with your
        estimated remaining range.

      `;

      return;

    }


    const estimatedRange =
      getEstimatedRange();


    /*
      LOCATION OFF
    */

    if (
      !App.state.userLocation
    ) {

      element.className =
        "range-result";


      element.innerHTML = `

        <div class="gasgo-range-head">

          <div>

            <div class="range-result-title">
              📍 Location needed
            </div>

            <div class="gasgo-range-sub">
              Can I Make It?
            </div>

          </div>


          <div class="gasgo-range-number">

            ${Math.round(
              estimatedRange
            )}

            <small>
              MI EST.
            </small>

          </div>

        </div>


        <div class="gasgo-range-message">

          Share your location to compare this stop
          with your estimated remaining range.

        </div>


        <button
          class="gasgo-range-location-button"
          onclick="GasGoApp.requestLocation()"
        >
          USE MY LOCATION
        </button>


        <div class="gasgo-range-disclaimer">

          Range is estimated and may change with
          traffic, driving style, terrain, weather,
          vehicle condition and other factors.

        </div>

      `;

      return;

    }


    const analysis =
      analyzeRange(
        station
      );


    let icon;
    let title;
    let message;


    if (
      analysis.status === "safe"
    ) {

      icon =
        "🟢";

      title =
        "Estimated range looks sufficient";

      message =
        "This stop is inside GasGo's conservative range margin.";

    } else if (
      analysis.status ===
      "warning"
    ) {

      icon =
        "🟡";

      title =
        "Low range margin";

      message =
        "This stop is within the estimated range, but the safety margin is small.";

    } else {

      icon =
        "🔴";

      title =
        "Choose a closer option";

      message =
        "The approximate distance is greater than your estimated remaining range.";

    }


    const remaining =
      Math.max(
        0,
        analysis.remaining
      );


    const safer =
      findSaferStation(
        station
      );


    App.state.saferStation =
      safer
        ? safer.station
        : null;


    let saferHTML = "";


    if (safer) {

      saferHTML = `

        <button
          class="gasgo-safer-stop"
          onclick="GasGoApp.openSaferStation()"
        >

          <div>

            <small>
              SAFER OPTION
            </small>

            <strong>
              ${escapeHTML(
                safer.station.name
              )}
            </strong>

            <span>
              ${formatMiles(
                safer.analysis.distance
              )}
              approx.
            </span>

          </div>


          <b>
            →
          </b>

        </button>

      `;

    }


    element.className =
      "range-result " +
      analysis.status;


    element.innerHTML = `

      <div class="gasgo-range-head">

        <div>

          <div class="range-result-title">

            ${icon}
            ${escapeHTML(
              title
            )}

          </div>

          <div class="gasgo-range-sub">
            CAN I MAKE IT?
          </div>

        </div>


        <div class="gasgo-range-number">

          ${Math.round(
            estimatedRange
          )}

          <small>
            MI EST.
          </small>

        </div>

      </div>


      <div class="gasgo-range-message">
        ${escapeHTML(
          message
        )}
      </div>


      <div class="gasgo-range-stats">

        <div>

          <span>
            STOP
          </span>

          <strong>
            ${formatMiles(
              analysis.distance
            )}
          </strong>

        </div>


        <div>

          <span>
            RANGE
          </span>

          <strong>
            ${formatMiles(
              estimatedRange
            )}
          </strong>

        </div>


        <div>

          <span>
            AFTER ARRIVAL
          </span>

          <strong>
            ${
              analysis.remaining >= 0
                ? formatMiles(
                    remaining
                  )
                : "LOW"
            }
          </strong>

        </div>

      </div>


      ${saferHTML}


      <div class="gasgo-range-disclaimer">

        Prototype estimate only. Distance is currently
        approximate straight-line distance, not road-route
        distance. Remaining range is not guaranteed.

      </div>

    `;

  };


  /* =======================================================
     OPEN SAFER STATION
     ======================================================= */

  App.openSaferStation =
  function () {

    const station =
      App.state.saferStation;


    if (!station) {

      if (
        typeof App.toast ===
        "function"
      ) {

        App.toast(
          "No safer mapped option is available.",
          "error"
        );

      }

      return;

    }


    App.selectStation(
      station,
      true
    );


    if (
      typeof App.toast ===
      "function"
    ) {

      App.toast(
        "Closer option selected.",
        "success"
      );

    }

  };


  /*
    Replace the original safer-option button behavior
    with Smart V6.
  */

  App.findSaferOption =
  function () {

    if (
      !App.state.userLocation
    ) {

      if (
        typeof App.toast ===
        "function"
      ) {

        App.toast(
          "Share your location first.",
          "error"
        );

      }


      if (
        typeof App.requestLocation ===
        "function"
      ) {

        App.requestLocation();

      }

      return;

    }


    const result =
      findSaferStation(
        App.state.selectedStation
      );


    if (!result) {

      if (
        typeof App.toast ===
        "function"
      ) {

        App.toast(
          "Your selected stop is already one of the safer nearby options.",
          "success"
        );

      }

      return;

    }


    App.state.saferStation =
      result.station;


    App.openSaferStation();

  };


  /* =======================================================
     REACTIVE REFRESH
     ======================================================= */

  function refreshSmartSystem() {

    renderHomeRangeStatus();


    if (
      App.state.selectedStation
    ) {

      App.renderCanIMakeIt();

    }

  }


  App.refreshSmartSystem =
    refreshSmartSystem;


  /* =======================================================
     HOOK INTO EXISTING APP FUNCTIONS
     ======================================================= */

  const originalRefreshVehicleUI =
    App.refreshVehicleUI;


  App.refreshVehicleUI =
  function () {

    if (
      typeof originalRefreshVehicleUI ===
      "function"
    ) {

      originalRefreshVehicleUI
        .apply(
          App,
          arguments
        );

    }


    refreshSmartSystem();

  };


  const originalApplyFilters =
    App.applyStationFilters;


  App.applyStationFilters =
  function () {

    if (
      typeof originalApplyFilters ===
      "function"
    ) {

      originalApplyFilters
        .apply(
          App,
          arguments
        );

    }


    refreshSmartSystem();

  };


  /*
    Location is especially important for Smart V6.
    We don't replace geolocation itself. Instead we
    detect the moment App.state.userLocation becomes
    available and refresh the intelligence layer.
  */

  let lastLocationKey = "";


  setInterval(
    function () {

      if (
        !App.state.userLocation
      ) {

        if (
          lastLocationKey !== ""
        ) {

          lastLocationKey = "";

          refreshSmartSystem();

        }

        return;

      }


      const key =
        Number(
          App.state.userLocation.lat
        ).toFixed(4) +
        "," +
        Number(
          App.state.userLocation.lon
        ).toFixed(4);


      if (
        key !==
        lastLocationKey
      ) {

        lastLocationKey =
          key;

        refreshSmartSystem();

      }

    },
    1000
  );


  /* =======================================================
     STYLES
     ======================================================= */

  function installStyles() {

    if (
      document.getElementById(
        "gasgo-smart-v6-styles"
      )
    ) {
      return;
    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "gasgo-smart-v6-styles";


    style.textContent = `

      /* ================================================
         GASGO SMART V6
         ================================================ */

      .gasgo-range-status {

        margin:
          12px 0;

        padding:
          14px;

        background:
          #111513;

        border:
          1px solid
          rgba(255,255,255,.07);

        border-radius:
          18px;

        box-shadow:
          0 8px 24px
          rgba(0,0,0,.14);

      }


      .gasgo-range-status[data-status="good"] {

        border-color:
          rgba(0,200,83,.25);

      }


      .gasgo-range-status[data-status="watch"] {

        border-color:
          rgba(255,213,79,.28);

      }


      .gasgo-range-status[data-status="low"] {

        border-color:
          rgba(255,152,0,.32);

      }


      .gasgo-range-status[data-status="critical"] {

        border-color:
          rgba(255,82,82,.38);

      }


      .gasgo-range-status-main {

        display:
          grid;

        grid-template-columns:
          auto 1fr auto;

        gap:
          11px;

        align-items:
          center;

      }


      .gasgo-range-status-icon {

        display:
          grid;

        width:
          36px;

        height:
          36px;

        place-items:
          center;

        background:
          rgba(255,255,255,.045);

        border:
          1px solid
          rgba(255,255,255,.06);

        border-radius:
          12px;

        font-size:
          15px;

      }


      .gasgo-range-status-copy {

        min-width:
          0;

      }


      .gasgo-range-status-copy strong {

        display:
          block;

        margin-bottom:
          3px;

        color:
          #ffffff;

        font-size:
          13px;

        line-height:
          1.2;

      }


      .gasgo-range-status-copy span {

        display:
          block;

        color:
          #8e9994;

        font-size:
          11px;

        line-height:
          1.35;

      }


      .gasgo-range-status-range {

        text-align:
          right;

      }


      .gasgo-range-status-range strong {

        display:
          block;

        color:
          #ffffff;

        font-size:
          22px;

        font-weight:
          900;

        line-height:
          1;

      }


      .gasgo-range-status-range span {

        display:
          block;

        margin-top:
          3px;

        color:
          #00C853;

        font-size:
          8px;

        font-weight:
          900;

        letter-spacing:
          .08em;

      }


      .gasgo-range-stop {

        display:
          flex;

        width:
          100%;

        margin-top:
          12px;

        padding:
          11px 12px;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          12px;

        appearance:
          none;

        background:
          rgba(255,255,255,.04);

        border:
          1px solid
          rgba(255,255,255,.07);

        border-radius:
          13px;

        color:
          #ffffff;

        text-align:
          left;

        cursor:
          pointer;

      }


      .gasgo-range-stop span {

        display:
          block;

      }


      .gasgo-range-stop small {

        display:
          block;

        margin-bottom:
          3px;

        color:
          #00C853;

        font-size:
          8px;

        font-weight:
          900;

        letter-spacing:
          .08em;

      }


      .gasgo-range-stop strong {

        display:
          block;

        font-size:
          12px;

      }


      .gasgo-range-stop b {

        color:
          #ffffff;

        font-size:
          11px;

        white-space:
          nowrap;

      }


      /* ================================================
         CAN I MAKE IT V6
         ================================================ */

      .gasgo-range-head {

        display:
          flex;

        align-items:
          flex-start;

        justify-content:
          space-between;

        gap:
          14px;

      }


      .gasgo-range-sub {

        margin-top:
          4px;

        color:
          #7f8a85;

        font-size:
          8px;

        font-weight:
          900;

        letter-spacing:
          .1em;

      }


      .gasgo-range-number {

        flex:
          0 0 auto;

        color:
          #ffffff;

        font-size:
          25px;

        font-weight:
          950;

        line-height:
          .95;

        text-align:
          right;

      }


      .gasgo-range-number small {

        display:
          block;

        margin-top:
          5px;

        color:
          #00C853;

        font-size:
          8px;

        font-weight:
          900;

        letter-spacing:
          .08em;

      }


      .gasgo-range-message {

        margin-top:
          12px;

        color:
          #a7b0ac;

        font-size:
          11px;

        line-height:
          1.5;

      }


      .gasgo-range-stats {

        display:
          grid;

        grid-template-columns:
          repeat(3,1fr);

        gap:
          7px;

        margin-top:
          13px;

      }


      .gasgo-range-stats > div {

        min-width:
          0;

        padding:
          10px 8px;

        background:
          rgba(255,255,255,.035);

        border:
          1px solid
          rgba(255,255,255,.055);

        border-radius:
          12px;

      }


      .gasgo-range-stats span {

        display:
          block;

        margin-bottom:
          5px;

        color:
          #6f7b76;

        font-size:
          7px;

        font-weight:
          900;

        letter-spacing:
          .07em;

      }


      .gasgo-range-stats strong {

        display:
          block;

        overflow:
          hidden;

        color:
          #ffffff;

        font-size:
          12px;

        font-weight:
          850;

        text-overflow:
          ellipsis;

        white-space:
          nowrap;

      }


      .gasgo-safer-stop {

        display:
          flex;

        width:
          100%;

        margin-top:
          12px;

        padding:
          11px 12px;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          10px;

        appearance:
          none;

        background:
          rgba(0,200,83,.08);

        border:
          1px solid
          rgba(0,200,83,.18);

        border-radius:
          13px;

        color:
          #ffffff;

        text-align:
          left;

        cursor:
          pointer;

      }


      .gasgo-safer-stop div {

        min-width:
          0;

      }


      .gasgo-safer-stop small {

        display:
          block;

        margin-bottom:
          3px;

        color:
          #00C853;

        font-size:
          8px;

        font-weight:
          900;

        letter-spacing:
          .08em;

      }


      .gasgo-safer-stop strong {

        display:
          block;

        overflow:
          hidden;

        font-size:
          12px;

        text-overflow:
          ellipsis;

        white-space:
          nowrap;

      }


      .gasgo-safer-stop span {

        display:
          block;

        margin-top:
          2px;

        color:
          #8f9995;

        font-size:
          10px;

      }


      .gasgo-safer-stop b {

        color:
          #00C853;

        font-size:
          18px;

      }


      .gasgo-range-disclaimer {

        margin-top:
          12px;

        padding-top:
          10px;

        border-top:
          1px solid
          rgba(255,255,255,.055);

        color:
          #67716d;

        font-size:
          8px;

        line-height:
          1.45;

      }


      .gasgo-range-location-button {

        width:
          100%;

        margin-top:
          12px;

        padding:
          11px;

        appearance:
          none;

        background:
          #00C853;

        border:
          0;

        border-radius:
          12px;

        color:
          #07100b;

        font-family:
          inherit;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .04em;

        cursor:
          pointer;

      }


      .range-result.safe {

        border-color:
          rgba(0,200,83,.22);

      }


      .range-result.warning {

        border-color:
          rgba(255,213,79,.25);

      }


      .range-result.danger {

        border-color:
          rgba(255,82,82,.30);

      }


      @media
      (max-width:360px) {

        .gasgo-range-stats {

          grid-template-columns:
            1fr;

        }

      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =======================================================
     INITIALIZE
     ======================================================= */

  installStyles();


  /*
    app.js has already initialized by the time this
    script is loaded because smart-v6.js is placed after it.
  */

  setTimeout(
    function () {

      refreshSmartSystem();

    },
    150
  );


  console.log(
    "GasGo Smart V6 loaded 🧠🚗⚡"
  );

})();
