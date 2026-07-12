const storageKey = "eastern-europe-guide-v1";

const tabs = document.querySelectorAll(".guide-tabs .tab");
const sections = document.querySelectorAll(".guide-section");
const planFields = document.querySelectorAll(".plan-field");
const buttons = document.querySelectorAll("[data-action]");
const converterInputs = document.querySelectorAll(".guide-convert-input");
const safeTime = (value) => {
  try {
    return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (error) {
    return "";
  }
};

const getStore = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch (error) {
    console.warn("Could not read guide plan cache.", error);
    return {};
  }
};

const setStore = (value) => {
  localStorage.setItem(storageKey, JSON.stringify(value));
};

const cityFields = (city) => document.querySelectorAll(`[data-city="${city}"].plan-field`);

const planSnapshot = (city) => {
  const snapshot = {};
  cityFields(city).forEach((field) => {
    snapshot[field.dataset.field] = field.value.trim();
  });
  return snapshot;
};
const applySnapshot = (city, snapshot) => {
  cityFields(city).forEach((field) => {
    field.value = snapshot?.[field.dataset.field] || "";
    if (field.type === "date") {
      syncHotelDateEmptyState(field);
    }
  });
  syncHotelDateBounds(city);
};

const formatEuro = (value) => {
  return `€${value.toFixed(2)}`;
};

const convertToEuro = (city) => {
  const input = document.getElementById(`convert-${city}`);
  const output = document.getElementById(`converted-${city}`);
  const rate = cityData[city]?.toEuroRate;

  if (!input || !output || !rate) {
    if (output) output.textContent = "€—";
    return;
  }

  const raw = input.value;
  const numericValue = Number.parseFloat(raw);
  if (!raw || Number.isNaN(numericValue) || numericValue <= 0) {
    output.innerHTML = "<strong>€—</strong>";
    return;
  }

  const euroValue = numericValue / rate;
  output.innerHTML = `<strong>${formatEuro(euroValue)}</strong>`;
};

const setPlanStatus = (city, message, ok = false) => {
  const status = document.getElementById(`status-${city}`);
  if (!status) return;
  status.textContent = message;
  status.classList.toggle("ok", ok);
};

const savePlan = (city) => {
  const data = getStore();
  const snapshot = planSnapshot(city);
  const hasData = Object.values(snapshot).some((value) => value.length > 0);
  if (!hasData) {
    setPlanStatus(city, "No details to save.");
    return;
  }

  data[city] = {
    ...snapshot,
    savedAt: new Date().toISOString()
  };
  setStore(data);
    setPlanStatus(city, `Saved at ${safeTime(data[city].savedAt)}.`, true);
};

const loadPlan = (city) => {
  const data = getStore();
  const saved = data[city];
  if (!saved) {
    setPlanStatus(city, "No saved draft found.");
    return;
  }

  applySnapshot(city, saved);
  const when = saved.savedAt ? new Date(saved.savedAt).toLocaleDateString() : "";
  setPlanStatus(city, when ? `Loaded plan saved on ${when}.` : "Loaded saved draft.");
};

const clearPlan = (city) => {
  const data = getStore();
  delete data[city];
  setStore(data);
  cityFields(city).forEach((field) => {
    field.value = "";
    if (field.type === "date") syncHotelDateEmptyState(field);
  });
  syncHotelDateBounds(city);
  const converter = document.getElementById(`convert-${city}`);
  const converted = document.getElementById(`converted-${city}`);
  if (converter) converter.value = "";
  if (converted) converted.textContent = "€—";
  setPlanStatus(city, "Cleared.");
};

const hydrateAll = () => {
  const data = getStore();
  Object.keys(cityData).forEach((city) => {
    if (data[city]) {
      applySnapshot(city, data[city]);
      const savedAt = data[city].savedAt ? new Date(data[city].savedAt).toLocaleDateString() : "";
      setPlanStatus(city, savedAt ? `Draft restored: ${savedAt}.` : "Draft restored.", true);
      updateHotelMap(city);
    }
  });
};

const switchCity = (city) => {
  if (!activeTrip.cities.includes(city)) return;

  tabs.forEach((tab) => {
    const isActive = tab.dataset.city === city;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  sections.forEach((section) => {
    const isActive = section.dataset.city === city;
    section.classList.toggle("active", isActive);
    section.setAttribute("aria-hidden", isActive ? "false" : "true");
  });
};

const setupTabs = () => {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchCity(tab.dataset.city));
  });
};

const setupActions = () => {
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const city = button.dataset.city;

      if (action === "save") {
        savePlan(city);
        updateHotelMap(city);
      }
      if (action === "load") {
        loadPlan(city);
        updateHotelMap(city);
      }
      if (action === "clear") {
        clearPlan(city);
        updateHotelMap(city);
      }
    });
  });

  planFields.forEach((field) => {
    field.addEventListener("input", () => {
      const city = field.dataset.city;
      savePlan(city);
      if (field.dataset.field === "hotelName" || field.dataset.field === "hotelAddress") {
        updateHotelMap(city);
      }
    });
  });

  converterInputs.forEach((input) => {
    input.addEventListener("input", () => {
      convertToEuro(input.dataset.city);
    });
  });
};

const renderContent = () => {
  Object.entries(cityData).forEach(([city, cityInfo]) => {
    document.getElementById(`currency-${city}`).textContent = cityInfo.currency;
    const rateNode = document.getElementById(`rate-${city}`);
    const convertedNode = document.getElementById(`converted-${city}`);
    if (rateNode) {
      rateNode.textContent = `1 EUR ≈ ${cityInfo.toEuroRate} ${cityInfo.currencyCode} (live rates vary)`;
    }
    if (convertedNode) {
      convertedNode.innerHTML = "<strong>€—</strong>";
    }
    const climateNode = document.getElementById(`climateNote-${city}`);
    if (climateNode && cityInfo.climateNotes) {
      climateNode.innerHTML = `🌦️ ${cityInfo.climateNotes}`;
    }
    const list = document.getElementById(`sights-${city}`);
    cityInfo.sights.forEach(([place, price]) => {
      const row = document.createElement("tr");
      const placeCell = document.createElement("td");
      const priceCell = document.createElement("td");
      placeCell.textContent = place;
      priceCell.textContent = price;
      row.appendChild(placeCell);
      row.appendChild(priceCell);
      list.appendChild(row);
    });
  });
};

const renderCurrencyExtras = () => {
  Object.entries(cityData).forEach(([city, cityInfo]) => {
    const extra = document.getElementById(`currencyExtra-${city}`);
    if (!extra) return;

    const paymentNote = cityInfo.cardPayment
      ? `<div class="currency-payment-note">💳 ${cityInfo.cardPayment}</div>`
      : "";

    if (cityInfo.currencyCode === "EUR") {
      extra.innerHTML = `
        ${paymentNote}
        <div class="currency-fx">
          <div class="currency-fx-title">📈 Exchange trend</div>
          <p class="currency-fx-note">🇪🇺 Vienna uses the Euro — no exchange needed if you're travelling from the Eurozone.</p>
        </div>
      `;
      return;
    }

    extra.innerHTML = `
      ${paymentNote}
      <div class="currency-fx">
        <div class="currency-fx-title">📈 30-day trend vs €</div>
        <div class="currency-fx-body" id="fxBody-${city}">
          <p class="currency-fx-loading">Loading exchange trend…</p>
        </div>
      </div>
    `;

    fetchFxSeries(cityInfo.currencyCode)
      .then((series) => {
        const body = document.getElementById(`fxBody-${city}`);
        if (!body || !series?.rates?.length) throw new Error("No FX data");

        const points = buildSparklinePoints(series.rates);
        const { last, changePct, up } = summarizeFxTrend(series.rates);
        const arrow = up ? "📈" : "📉";
        const trendClass = up ? "up" : "down";
        const magnitude = Math.abs(changePct).toFixed(1);
        const changeText = up
          ? `buys ${magnitude}% more than 30 days ago`
          : `buys ${magnitude}% less than 30 days ago`;

        body.innerHTML = `
          <svg class="currency-fx-chart" viewBox="0 0 220 54" preserveAspectRatio="none" aria-hidden="true">
            <polyline points="${points}" fill="none" stroke-width="2" />
          </svg>
          <p class="currency-fx-summary">
            1 € = <strong>${last.toFixed(2)} ${cityInfo.currencyCode}</strong> today ·
            <span class="currency-fx-change ${trendClass}">${arrow} Your € ${changeText}</span>
          </p>
        `;
      })
      .catch(() => {
        const body = document.getElementById(`fxBody-${city}`);
        if (body) {
          body.innerHTML = `<p class="currency-fx-note">Exchange trend unavailable right now.</p>`;
        }
      });
  });
};
const mapsSearchUrl = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const renderTransportHubs = () => {
  const optionRow = (label, primary, meta) => {
    const metaHtml = meta
      ? `<span class="transport-option-meta">${meta}</span>`
      : "";
    return `
      <div class="transport-option">
        <span class="transport-option-label">${label}</span>
        <span class="transport-option-detail">${primary}</span>
        ${metaHtml}
      </div>`;
  };

  Object.entries(cityData).forEach(([city, cityInfo]) => {
    const container = document.getElementById(`transport-${city}`);
    const transport = cityInfo.transport;
    if (!container || !transport) return;

    const hubBlock = (typeLabel, hub) => {
      const block = document.createElement("div");
      block.className = "transport-hub";
      const transitMeta = hub.transit
        ? `${hub.transit.duration} · ${hub.transit.cost}`
        : "";
      const taxiMeta = hub.taxi
        ? `${hub.taxi.duration} · ${hub.taxi.cost}`
        : "";
      const optionsHtml =
        hub.transit || hub.taxi
          ? `<div class="transport-hub-options">
              ${hub.transit ? optionRow("🚌 Public transport", hub.transit.option, transitMeta) : ""}
              ${hub.taxi ? optionRow("🚕 Taxi", "Metered / fixed fare", taxiMeta) : ""}
            </div>`
          : "";
      block.innerHTML = `
        <div class="transport-hub-type">${typeLabel}</div>
        <p class="transport-hub-name">${hub.name}</p>
        <a class="sight-pick-maps" href="${mapsSearchUrl(hub.mapsQuery)}" target="_blank" rel="noopener noreferrer">Google Maps</a>
        ${optionsHtml}
      `;
      return block;
    };

    const kicker = document.createElement("div");
    kicker.className = "guide-kicker";
    kicker.textContent = "Arrival & connections";
    container.appendChild(kicker);
    container.appendChild(hubBlock("✈️ Main airport", transport.airport));
    container.appendChild(hubBlock("🚆 Main train station", transport.station));

    if (cityInfo.transportTips?.length) {
      const tipsBlock = document.createElement("div");
      tipsBlock.className = "transport-tips";
      tipsBlock.innerHTML = `
        <div class="transport-tips-title">🧭 Transport tips</div>
        <ul class="transport-tips-list">
          ${cityInfo.transportTips.map((tip) => `<li>${tip}</li>`).join("")}
        </ul>
      `;
      container.appendChild(tipsBlock);
    }
  });
};
// Fetch weather for the active city on load, and on every tab switch
const originalSwitchCity = switchCity;
const switchCityWithWeather = (city) => {
  originalSwitchCity(city);
  fetchWeather(city);
};

// Patch tab listeners to use new switch
const setupTabsWithWeather = () => {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchCityWithWeather(tab.dataset.city));
  });
};

renderContent();
renderTransportHubs();
renderCurrencyExtras();
setupHotelDates();
setupHotelAutocomplete();
setupLanding();
hydrateAll();
Object.keys(cityData).forEach(updateHotelMap);
setupActions();
setupTabsWithWeather();
initTrip();
