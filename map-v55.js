"use strict";

/* =========================================================
   GASGO MAP ENHANCEMENT
   Version 5.6.2

   Requires:
   - Leaflet
   - stations.js
   - app.js V5.4+

   GasGo Map V5.6.2
   - No API key required
   - OpenStreetMap base map
   - Dark visual treatment
   - Price-colored fuel markers
   - Fuel popup with Regular / Premium / Diesel
   - EV markers
   - User location
   - GasGo legend
   - Fixed marker popup persistence
   ========================================================= */

(function () {

  if (!window.GasGoApp) {
    console.error("GasGo Map V5.6.2: app.js must load first.");
    return;
  }

  if (!window.GasGoData) {
    console.error("GasGo Map V5.6.2: stations.js must load first.");
    return;
  }

  if (typeof L === "undefined") {
    console.error("GasGo Map V5.6.2: Leaflet is missing.");
    return;
  }

  const App = window.GasGoApp;
  const Data = window.GasGoData;

  App.MAP_VERSION = "5.6.2";


  /* =======================================================
     COLORS
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
     MAP TILES
     ======================================================= */

  const MAP_TILE_URL =
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png";


  const MAP_TILE_ATTRIBUTION =
    '&copy; OpenStreetMap contributors';


  /* =======================================================
     HELPERS
     ======================================================= */

  function validNumber(value) {

    const number = Number(value);

    return Number.isFinite(number);

  }


  function getAllFuelPrices(station) {

    if (
      !station ||
      station.type !== "fuel"
    ) {
      return null;
    }


    let prices =
      station.prices;


    if (
      !prices &&
      typeof Data.getStationPrices === "function"
    ) {

      try {

        prices =
          Data.getStationPrices(
            station
          );

      } catch (error) {

        console.warn(
          "GasGo: couldn't read station prices.",
          error
        );

        return null;

      }

    }


    return prices || null;

  }


  function getFuelPrice(station) {

    const prices =
      getAllFuelPrices(
        station
      );


    if (!prices) {
      return null;
    }


    const price =
      Number(
        prices[
          App.state.selectedFuel
        ]
      );


    return Number.isFinite(price)
      ? price
      : null;

  }


  function formatFuelPrice(value) {

    const price =
      Number(value);


    if (!Number.isFinite(price)) {
      return "—";
    }


    return (
      "$" +
      price.toFixed(2) +
      "/L"
    );

  }


  /* =======================================================
     FUEL POPUP
     ======================================================= */

  function fuelPopupHTML(station) {

    const prices =
      getAllFuelPrices(
        station
      ) || {};


    const name =
      App.escape(
        station.name ||
        "Fuel Station"
      );


    const brand =
      App.escape(
        station.brand ||
        "Fuel Station"
      );


    const regular =
      formatFuelPrice(
        prices.regular
      );


    const premium =
      formatFuelPrice(
        prices.premium
      );


    const diesel =
      formatFuelPrice(
        prices.diesel
      );


    return `

      <div class="gasgo-fuel-popup">

        <div class="gasgo-popup-name">
          ⛽ ${name}
        </div>

        <div class="gasgo-popup-brand">
          ${brand}
        </div>


        <div class="gasgo-popup-prices">

          <div class="gasgo-popup-price-row">

            <span>
              Regular
            </span>

            <strong>
              ${regular}
            </strong>

          </div>


          <div class="gasgo-popup-price-row">

            <span>
              Premium
            </span>

            <strong>
              ${premium}
            </strong>

          </div>


          <div class="gasgo-popup-price-row">

            <span>
              Diesel
            </span>

            <strong>
              ${diesel}
            </strong>

          </div>

        </div>


        <div class="gasgo-popup-note">
          Prototype estimated prices
        </div>

      </div>

    `;

  }


  /* =======================================================
     PRICE STATISTICS
     ======================================================= */

  function getPriceStatistics() {

    const stations =
      Array.isArray(
        App.state.filteredStations
      )
        ? App.state.filteredStations
        : [];


    const prices =
      stations
        .filter(
          station =>
            station.type === "fuel"
        )
        .map(
          getFuelPrice
        )
        .filter(
          validNumber
        );


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


    const margin =
      0.02;


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

    if (
      station.type === "ev"
    ) {

      return "ev";

    }


    const price =
      getFuelPrice(
        station
      );


    if (
      !validNumber(price) ||
      !validNumber(
        statistics.average
      )
    ) {

      return "unknown";

    }


    if (
      price <=
      statistics.cheapLimit
    ) {

      return "cheap";

    }


    if (
      price >=
      statistics.expensiveLimit
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
     LEGEND
     ======================================================= */

  function addLegend() {

    if (
      !App.state.map ||
      App.state.map
        ._gasgoLegendAdded
    ) {

      return;

    }


    const legend =
      L.control({
        position:
          "bottomright"
      });


    legend.onAdd =
      function () {

        const div =
          L.DomUtil.create(
            "div",
            "gasgo-map-legend"
          );


        div.innerHTML = `

          <div
            class="gasgo-legend-title"
          >
            GasGo
          </div>


          <div
            class="gasgo-legend-row"
          >

            <span
              class="gasgo-legend-dot"
              style="background:${COLORS.cheap}"
            ></span>

            Lower price

          </div>


          <div
            class="gasgo-legend-row"
          >

            <span
              class="gasgo-legend-dot"
              style="background:${COLORS.average}"
            ></span>

            Average

          </div>


          <div
            class="gasgo-legend-row"
          >

            <span
              class="gasgo-legend-dot"
              style="background:${COLORS.expensive}"
            ></span>

            Higher price

          </div>


          <div
            class="gasgo-legend-row"
          >

            <span
              class="gasgo-legend-dot"
              style="background:${COLORS.ev}"
            ></span>

            EV charger

          </div>

        `;


        L.DomEvent
          .disableClickPropagation(
            div
          );


        return div;

      };


    legend.addTo(
      App.state.map
    );


    App.state.map
      ._gasgoLegendAdded =
      true;

  }


  /* =======================================================
     INITIALIZE MAP
     ======================================================= */

  App.initializeMap =
    function () {

      if (
        App.state.mapInitialized
      ) {

        if (
          App.state.map
        ) {

          setTimeout(
            function () {

              App.state.map
                .invalidateSize(
                  true
                );

            },
            80
          );

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

              zoomControl:
                true,

              preferCanvas:
                true,

              attributionControl:
                true

            }
          )
            .setView(

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
            MAP_TILE_URL,
            {

              maxZoom: 19,

              minZoom: 3,

              attribution:
                MAP_TILE_ATTRIBUTION,

              className:
                "gasgo-dark-map-tiles"

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
          function (event) {

            console.warn(
              "GasGo map tile error:",
              event
            );

            hideMapLoader();

          }
        );


        setTimeout(
          hideMapLoader,
          1800
        );


        App.state
          .mapInitialized =
          true;


        addLegend();


        setTimeout(
          function () {

            if (
              App.state.map
            ) {

              App.state.map
                .invalidateSize(
                  true
                );

            }

          },
          120
        );


        if (
          App.state
            .stationsLoaded
        ) {

          App.renderMapStations();

        } else if (
          !App.state
            .stationsLoading
        ) {

          App.loadStations();

        }


        console.log(
          "GasGo Map V5.6.2 initialized 🌙"
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
     MARKERS
     ======================================================= */

  App.renderMapStations =
    function () {

      if (
        !App.state.map ||
        !App.state.markerLayer
      ) {

        if (
          typeof App
            .renderStationList ===
            "function"
        ) {

          App.renderStationList();

        }

        return;

      }


      App.state.markerLayer
        .clearLayers();


      if (
        App.state.markers &&
        typeof App.state.markers
          .clear === "function"
      ) {

        App.state.markers
          .clear();

      } else {

        App.state.markers =
          new Map();

      }


      const statistics =
        getPriceStatistics();


      const stations =
        Array.isArray(
          App.state
            .filteredStations
        )
          ? App.state
              .filteredStations
          : [];


      stations.forEach(
        function (station) {

          if (
            !validNumber(
              station.lat
            ) ||
            !validNumber(
              station.lon
            )
          ) {

            return;

          }


          const selected =
            String(
              App.state
                .selectedStation
                ?.id
            ) ===
            String(
              station.id
            );


          const color =
            getMarkerColor(
              station,
              statistics
            );


          const marker =
            L.circleMarker(

              [
                Number(
                  station.lat
                ),

                Number(
                  station.lon
                )
              ],

              {

                radius:
                  selected
                    ? 11
                    : station.type ===
                        "ev"
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

                opacity:
                  1,

                fillColor:
                  color,

                fillOpacity:
                  selected
                    ? 1
                    : 0.92,

                bubblingMouseEvents:
                  false

              }

            );


          const price =
            getFuelPrice(
              station
            );


          let tooltipText;


          if (
            station.type ===
            "ev"
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
              validNumber(
                price
              )
            ) {

              tooltipText +=
                " • $" +
                Number(
                  price
                ).toFixed(2) +
                "/L";

            }

          }


          marker.bindTooltip(
            tooltipText,
            {

              direction:
                "top",

              offset:
                [0, -8],

              opacity:
                0.96

            }
          );


          /* =============================================
             POPUP
             ============================================= */

          if (
            station.type ===
            "fuel"
          ) {

            marker.bindPopup(

              fuelPopupHTML(
                station
              ),

              {

                maxWidth:
                  300,

                minWidth:
                  205,

                className:
                  "gasgo-dark-popup",

                autoPan:
                  true,

                closeButton:
                  true,

                autoClose:
                  true,

                closeOnClick:
                  true

              }

            );

          } else if (
            typeof App
              .stationPopupHTML ===
              "function"
          ) {

            marker.bindPopup(

              App.stationPopupHTML(
                station
              ),

              {

                maxWidth:
                  300,

                minWidth:
                  205,

                className:
                  "gasgo-dark-popup",

                autoPan:
                  true,

                closeButton:
                  true

              }

            );

          }


          /* =============================================
             MARKER CLICK — V5.6.2 FIX

             Do NOT call App.selectStation() here.

             selectStation() redraws every marker.
             That destroyed the marker being clicked and
             caused the popup to disappear.

             We select the station directly, update the
             sheet below, visually select this marker,
             and explicitly open this same popup.
             ============================================= */

          marker.on(
            "click",
            function () {

              App.state.selectedStation =
                station;


              if (
                typeof App
                  .renderStationSheet ===
                  "function"
              ) {

                App.renderStationSheet();

              }


              /*
                Reset visual style of other markers without
                rebuilding the Leaflet layer.
              */

              App.state.markers.forEach(
                function (
                  otherMarker,
                  otherId
                ) {

                  if (
                    !otherMarker ||
                    typeof otherMarker
                      .setStyle !==
                      "function"
                  ) {

                    return;

                  }


                  const otherStation =
                    stations.find(
                      item =>
                        String(
                          item.id
                        ) ===
                        String(
                          otherId
                        )
                    );


                  if (!otherStation) {
                    return;
                  }


                  const otherColor =
                    getMarkerColor(
                      otherStation,
                      statistics
                    );


                  otherMarker.setStyle({

                    radius:
                      otherStation.type ===
                        "ev"
                        ? 8
                        : 7,

                    color:
                      COLORS.outline,

                    weight:
                      2,

                    fillColor:
                      otherColor,

                    fillOpacity:
                      0.92

                  });

                }
              );


              /*
                Highlight selected marker.
              */

              marker.setStyle({

                radius:
                  11,

                color:
                  COLORS.selected,

                weight:
                  4,

                fillColor:
                  color,

                fillOpacity:
                  1

              });


              /*
                Bring selected marker to the front.
              */

              if (
                typeof marker
                  .bringToFront ===
                  "function"
              ) {

                marker.bringToFront();

              }


              /*
                Open the popup after the click finishes.
                The marker is NOT destroyed anymore.
              */

              window.setTimeout(
                function () {

                  if (
                    station.type ===
                    "fuel"
                  ) {

                    marker.setPopupContent(
                      fuelPopupHTML(
                        station
                      )
                    );

                  } else if (
                    typeof App
                      .stationPopupHTML ===
                      "function"
                  ) {

                    marker.setPopupContent(
                      App.stationPopupHTML(
                        station
                      )
                    );

                  }


                  marker.openPopup();

                },
                0
              );

            }
          );


          marker.addTo(
            App.state.markerLayer
          );


          App.state.markers.set(
            String(
              station.id
            ),
            marker
          );

        }
      );


      if (
        typeof App
          .renderStationList ===
          "function"
      ) {

        App.renderStationList();

      }


      updateLegendPriceInfo(
        statistics
      );

    };


  /* =======================================================
     LEGEND PRICE INFO
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
        App.state
          .selectedFuel ||
        "regular"
      );


    info.innerHTML = `

      ${
        fuelName
          .charAt(0)
          .toUpperCase() +
        fuelName.slice(1)
      }

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
     SMART STOP SCORING
     ======================================================= */

  function scoreFuelStation(
    station,
    averagePrice
  ) {

    const price =
      getFuelPrice(
        station
      );


    if (
      !validNumber(price)
    ) {

      return Infinity;

    }


    if (
      !App.state
        .userLocation
    ) {

      return price;

    }


    const distance =
      Data.distanceMiles(

        App.state
          .userLocation.lat,

        App.state
          .userLocation.lon,

        station.lat,

        station.lon

      );


    const priceDifference =
      validNumber(
        averagePrice
      )
        ? price -
          averagePrice
        : 0;


    const priceScore =
      priceDifference *
      100;


    const distanceScore =
      Number.isFinite(
        Number(distance)
      )
        ? Number(distance) *
          0.75
        : 999;


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
          station.type ===
          "fuel"
      );


    if (
      !fuelStations.length
    ) {

      return null;

    }


    const prices =
      fuelStations
        .map(
          getFuelPrice
        )
        .filter(
          validNumber
        );


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
        function (a, b) {

          return (
            scoreFuelStation(
              a,
              average
            ) -
            scoreFuelStation(
              b,
              average
            )
          );

        }
      )[0] || null;

  }


  function getBestEVSmartStop(
    stations
  ) {

    const chargers =
      stations.filter(
        station =>
          station.type ===
          "ev"
      );


    if (
      !chargers.length
    ) {

      return null;

    }


    if (
      !App.state
        .userLocation
    ) {

      return chargers[0];

    }


    return [
      ...chargers
    ]
      .sort(
        function (a, b) {

          const distanceA =
            Data.distanceMiles(

              App.state
                .userLocation.lat,

              App.state
                .userLocation.lon,

              a.lat,

              a.lon

            );


          const distanceB =
            Data.distanceMiles(

              App.state
                .userLocation.lat,

              App.state
                .userLocation.lon,

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
     SMART STOP
     ======================================================= */

  App.updateSmartStop =
    function () {

      const card =
        document.getElementById(
          "smartStopCard"
        );


      if (!card) {
        return;
      }


      if (
        !App.state.stations
          .length
      ) {

        card.innerHTML = `

          <div
            class="smart-stop-title"
          >
            Finding your Smart Stop…
          </div>

          <div
            class="smart-stop-subtitle"
          >
            Comparing mapped energy options.
          </div>

        `;

        return;

      }


      const mode =
        typeof App
          .getVehicleEnergyMode ===
          "function"
          ? App
              .getVehicleEnergyMode()
          : "fuel";


      let station =
        null;


      if (
        mode === "ev"
      ) {

        station =
          getBestEVSmartStop(
            App.state.stations
          );

      } else if (
        mode === "both"
      ) {

        const fuel =
          getBestFuelSmartStop(
            App.state.stations
          );


        const ev =
          getBestEVSmartStop(
            App.state.stations
          );


        if (
          App.state
            .userLocation &&
          fuel &&
          ev
        ) {

          const fuelDistance =
            Data.distanceMiles(

              App.state
                .userLocation.lat,

              App.state
                .userLocation.lon,

              fuel.lat,

              fuel.lon

            );


          const evDistance =
            Data.distanceMiles(

              App.state
                .userLocation.lat,

              App.state
                .userLocation.lon,

              ev.lat,

              ev.lon

            );


          station =
            evDistance <
            fuelDistance
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

          <div
            class="smart-stop-title"
          >
            Smart Stop unavailable
          </div>

          <div
            class="smart-stop-subtitle"
          >
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
        App.state
          .userLocation
      ) {

        const distance =
          Data.distanceMiles(

            App.state
              .userLocation.lat,

            App.state
              .userLocation.lon,

            station.lat,

            station.lon

          );


        distanceText =
          Data.formatDistance(
            distance
          );

      }


      if (
        station.type ===
        "ev"
      ) {

        const ev =
          station.ev || {};


        card.innerHTML = `

          <div
            class="smart-stop-header"
          >

            <div>

              <div
                class="eyebrow"
              >
                GASGO SMART STOP
              </div>

              <div
                class="smart-stop-title"
              >
                ⚡ ${App.escape(
                  station.name
                )}
              </div>

              <div
                class="smart-stop-subtitle"
              >
                ${App.escape(
                  station.brand ||
                  "EV Charging"
                )}
              </div>

            </div>


            <div
              class="smart-stop-price"
            >
              ⚡

              <small>
                EV
              </small>

            </div>

          </div>


          <div
            class="smart-stop-grid"
          >

            <div
              class="smart-stat"
            >

              <span>
                Distance
              </span>

              <strong>
                ${distanceText}
              </strong>

            </div>


            <div
              class="smart-stat"
            >

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


            <div
              class="smart-stat"
            >

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


          <div
            class="muted mt-8"
          >
            Recommended from mapped charger information.
            Live availability is not assumed.
          </div>


          <div
            class="button-row mt-12"
          >

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


      const price =
        getFuelPrice(
          station
        );


      card.innerHTML = `

        <div
          class="smart-stop-header"
        >

          <div>

            <div
              class="eyebrow"
            >
              GASGO SMART STOP
            </div>

            <div
              class="smart-stop-title"
            >
              ${App.escape(
                station.name
              )}
            </div>

            <div
              class="smart-stop-subtitle"
            >
              ${App.escape(
                station.brand ||
                "Fuel Station"
              )}
            </div>

          </div>


          <div
            class="smart-stop-price"
          >

            ${
              validNumber(price)
                ? "$" +
                  Number(
                    price
                  ).toFixed(2)
                : "—"
            }

            <small>
              /L
            </small>

          </div>

        </div>


        <div
          class="smart-stop-grid"
        >

          <div
            class="smart-stat"
          >

            <span>
              Distance
            </span>

            <strong>
              ${distanceText}
            </strong>

          </div>


          <div
            class="smart-stat"
          >

            <span>
              Est. range
            </span>

            <strong>
              ${Math.round(
                App.getVehicleRange()
              )} mi
            </strong>

          </div>


          <div
            class="smart-stat"
          >

            <span>
              Fuel
            </span>

            <strong>
              ${App.escape(
                App.state
                  .selectedFuel
              )}
            </strong>

          </div>

        </div>


        <div
          class="muted mt-8"
        >
          Smart Stop balances prototype fuel price and
          approximate distance when location is available.
        </div>


        <div
          class="button-row mt-12"
        >

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
     MAP STYLES
     ======================================================= */

  function installMapStyles() {

    const oldStyle =
      document.getElementById(
        "gasgo-map-v55-styles"
      );


    if (oldStyle) {

      oldStyle.remove();

    }


    const existing =
      document.getElementById(
        "gasgo-map-v56-styles"
      );


    if (existing) {

      existing.remove();

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "gasgo-map-v56-styles";


    style.textContent = `

      /* ================================================
         GASGO MAP V5.6.2
         ================================================ */

      #map {

        background:
          #101312 !important;

      }


      .leaflet-container {

        background:
          #101312 !important;

        font-family:
          inherit;

      }


      .gasgo-dark-map-tiles {

        filter:
          invert(1)
          hue-rotate(180deg)
          brightness(.72)
          contrast(.90)
          saturate(.70);

      }


      /* ZOOM CONTROLS */

      .leaflet-control-zoom {

        border:
          1px solid
          rgba(255,255,255,.10)
          !important;

        border-radius:
          12px !important;

        overflow:
          hidden;

        box-shadow:
          0 8px 24px
          rgba(0,0,0,.35)
          !important;

      }


      .leaflet-control-zoom a {

        background:
          rgba(15,20,18,.96)
          !important;

        color:
          #ffffff
          !important;

        border-color:
          rgba(255,255,255,.08)
          !important;

      }


      .leaflet-control-zoom a:hover {

        background:
          #18201d
          !important;

        color:
          #00C853
          !important;

      }


      /* ATTRIBUTION */

      .leaflet-control-attribution {

        background:
          rgba(8,11,10,.82)
          !important;

        color:
          #9da7a2
          !important;

        backdrop-filter:
          blur(8px);

        border-radius:
          8px 0 0 0;

      }


      .leaflet-control-attribution a {

        color:
          #d5ddd9
          !important;

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
      .leaflet-popup-content {

        margin:
          15px 16px;

      }


      .gasgo-dark-popup
      .leaflet-popup-tip {

        background:
          #101513;

      }


      .gasgo-dark-popup
      .leaflet-popup-close-button {

        color:
          #ffffff
          !important;

      }


      /* GASGO FUEL POPUP */

      .gasgo-fuel-popup {

        min-width:
          185px;

      }


      .gasgo-popup-name {

        padding-right:
          18px;

        color:
          #ffffff;

        font-size:
          15px;

        font-weight:
          900;

        line-height:
          1.25;

      }


      .gasgo-popup-brand {

        margin-top:
          3px;

        margin-bottom:
          11px;

        color:
          #8f9a95;

        font-size:
          11px;

        font-weight:
          600;

      }


      .gasgo-popup-prices {

        border-top:
          1px solid
          rgba(255,255,255,.08);

      }


      .gasgo-popup-price-row {

        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          22px;

        padding:
          8px 0;

        border-bottom:
          1px solid
          rgba(255,255,255,.08);

      }


      .gasgo-popup-price-row span {

        color:
          #a7b0ac;

        font-size:
          12px;

        font-weight:
          600;

      }


      .gasgo-popup-price-row strong {

        color:
          #ffffff;

        font-size:
          14px;

        font-weight:
          900;

        white-space:
          nowrap;

      }


      .gasgo-popup-note {

        margin-top:
          9px;

        color:
          #77817c;

        font-size:
          9px;

        line-height:
          1.3;

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


      /* LEGEND */

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


        .gasgo-fuel-popup {

          min-width:
            175px;

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


    App.state.map =
      null;

    App.state.markerLayer =
      null;

    App.state.userMarker =
      null;

    App.state.markers =
      new Map();

    App.state.mapInitialized =
      false;

  }


  console.log(
    "GasGo Map V5.6.2 loaded ⛽⚡🗺️"
  );

})();
