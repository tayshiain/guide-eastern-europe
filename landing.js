const tripStorageKey = "sevader-trip-v1";
const emptySurvey = () => ({
  interests: [],
  companions: "",
  travelMonth: "",
  tripDays: "",
  budget: "",
});

const normalizeSurvey = (survey) => ({
  interests: Array.isArray(survey?.interests) ? survey.interests.filter(Boolean) : [],
  companions: survey?.companions || "",
  travelMonth: survey?.travelMonth || "",
  tripDays: survey?.tripDays != null && survey.tripDays !== "" ? String(survey.tripDays) : "",
  budget: survey?.budget || "",
});

let activeTrip = {
  cities: [],
  origin: "",
  originCountry: "",
  survey: emptySurvey(),
};
let selectedCities = [];
let originMeta = { label: "", country: "" };
let originSuggestTimer = null;

const landingView = document.getElementById("landing-view");
const guideView = document.getElementById("guide-view");
const topbarTrip = document.getElementById("topbar-trip");
const landingStart = document.getElementById("landing-start");
const landingHint = document.getElementById("landing-hint");
const tripOriginInput = document.getElementById("trip-origin");
const tripMonthSelect = document.getElementById("trip-month");
const tripDaysInput = document.getElementById("trip-days");
const originSuggestList = document.getElementById("origin-suggest");
const surveyChips = document.querySelectorAll(".survey-chip[data-survey]");
const changeCitiesBtn = document.getElementById("change-cities");
const landingCityCards = document.querySelectorAll(".landing-city-card");

const getTripStore = () => {
  try {
    return JSON.parse(localStorage.getItem(tripStorageKey)) || null;
  } catch (error) {
    console.warn("Could not read trip settings.", error);
    return null;
  }
};

const setTripStore = (trip) => {
  localStorage.setItem(tripStorageKey, JSON.stringify(trip));
};

const showView = (view) => {
  if (landingView) landingView.classList.toggle("hidden", view !== "landing");
  if (guideView) guideView.classList.toggle("hidden", view !== "guide");
};

const updateLandingSelectionUI = () => {
  landingCityCards.forEach((card) => {
    const city = card.dataset.city;
    const on = selectedCities.includes(city);
    card.classList.toggle("selected", on);
    card.setAttribute("aria-pressed", on ? "true" : "false");
  });
  if (landingStart) landingStart.disabled = selectedCities.length === 0;
  if (landingHint) {
    landingHint.textContent =
      selectedCities.length === 0
        ? "Select at least one city"
        : `${selectedCities.length} ${selectedCities.length === 1 ? "city" : "cities"} selected`;
  }
};

const readSurveyFromForm = () => {
  const interests = [];
  surveyChips.forEach((chip) => {
    if (chip.dataset.survey !== "interest" || !chip.classList.contains("selected")) return;
    interests.push(chip.dataset.value);
  });

  let companions = "";
  let budget = "";
  surveyChips.forEach((chip) => {
    if (!chip.classList.contains("selected")) return;
    if (chip.dataset.survey === "companions") companions = chip.dataset.value;
    if (chip.dataset.survey === "budget") budget = chip.dataset.value;
  });

  const tripDaysRaw = tripDaysInput?.value.trim() || "";
  const tripDays = tripDaysRaw && Number.isFinite(Number(tripDaysRaw)) ? String(Number(tripDaysRaw)) : "";

  return normalizeSurvey({
    interests,
    companions,
    travelMonth: tripMonthSelect?.value || "",
    tripDays,
    budget,
  });
};

const applySurveyToForm = (survey) => {
  const data = normalizeSurvey(survey);
  surveyChips.forEach((chip) => {
    const type = chip.dataset.survey;
    const value = chip.dataset.value;
    let on = false;
    if (type === "interest") on = data.interests.includes(value);
    else if (type === "companions") on = data.companions === value;
    else if (type === "budget") on = data.budget === value;
    chip.classList.toggle("selected", on);
    chip.setAttribute("aria-pressed", on ? "true" : "false");
  });
  if (tripMonthSelect) tripMonthSelect.value = data.travelMonth;
  if (tripDaysInput) tripDaysInput.value = data.tripDays;
};

const formatOriginLabel = (props) => {
  const name = props.name || props.city || "";
  const country = props.country || "";
  return country ? `${name}, ${country}` : name;
};

const clearOriginSuggestions = () => {
  if (originSuggestList) originSuggestList.innerHTML = "";
};

const applyOriginSelection = (label, country) => {
  originMeta = { label, country };
  if (tripOriginInput) tripOriginInput.value = label;
  clearOriginSuggestions();
};

const fetchOriginSuggestions = async (query) => {
  if (!originSuggestList) return;

  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10&lang=en`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const features = (data.features || []).filter((feature) => {
      const props = feature.properties || {};
      const placeType = props.osm_value || props.type || "";
      return ["city", "town", "village", "locality", "administrative"].includes(placeType);
    });

    originSuggestList.innerHTML = "";
    if (!features.length) return;

    features.slice(0, 6).forEach((feature) => {
      const props = feature.properties || {};
      const label = formatOriginLabel(props);
      if (!label) return;
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = `<span class="hotel-suggest-name">${label}</span>`;
      button.addEventListener("click", () =>
        applyOriginSelection(label, props.country || "")
      );
      li.appendChild(button);
      originSuggestList.appendChild(li);
    });
  } catch (error) {
    originSuggestList.innerHTML = "";
  }
};

const applyTripToGuide = () => {
  const cities = activeTrip.cities.filter((city) => allCities.includes(city));
  if (!cities.length) return;

  tabs.forEach((tab) => {
    const visible = cities.includes(tab.dataset.city);
    tab.classList.toggle("is-hidden", !visible);
  });

  sections.forEach((section) => {
    const visible = cities.includes(section.dataset.city);
    section.classList.toggle("is-hidden", !visible);
  });

  if (topbarTrip) {
    topbarTrip.textContent = cities.map((city) => cityCatalog[city].tabLabel).join(" · ");
  }
};

const persistTrip = () => {
  setTripStore({
    cities: activeTrip.cities,
    origin: activeTrip.origin,
    originCountry: activeTrip.originCountry || "",
    survey: normalizeSurvey(activeTrip.survey),
  });
};

const enterGuide = () => {
  const originLabel = originMeta.label || tripOriginInput?.value.trim() || "";
  activeTrip = {
    cities: selectedCities.filter((city) => allCities.includes(city)),
    origin: originLabel,
    originCountry: originMeta.country || "",
    survey: readSurveyFromForm(),
  };
  if (!activeTrip.cities.length) return;
  persistTrip();
  showView("guide");
  applyTripToGuide();
  switchCityWithWeather(activeTrip.cities[0]);
};

const setupLanding = () => {
  landingCityCards.forEach((card) => {
    card.addEventListener("click", () => {
      const city = card.dataset.city;
      if (selectedCities.includes(city)) {
        selectedCities = selectedCities.filter((item) => item !== city);
      } else {
        selectedCities = [...selectedCities, city];
      }
      updateLandingSelectionUI();
    });
  });

  landingStart?.addEventListener("click", enterGuide);

  changeCitiesBtn?.addEventListener("click", () => {
    selectedCities = [...activeTrip.cities];
    originMeta = {
      label: activeTrip.origin || "",
      country: activeTrip.originCountry || "",
    };
    if (tripOriginInput) tripOriginInput.value = activeTrip.origin || "";
    applySurveyToForm(activeTrip.survey);
    updateLandingSelectionUI();
    showView("landing");
  });

  surveyChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const type = chip.dataset.survey;
      if (type === "interest") {
        chip.classList.toggle("selected");
        chip.setAttribute("aria-pressed", chip.classList.contains("selected") ? "true" : "false");
        return;
      }
      document.querySelectorAll(`.survey-chip[data-survey="${type}"]`).forEach((option) => {
        const on = option === chip;
        option.classList.toggle("selected", on);
        option.setAttribute("aria-pressed", on ? "true" : "false");
      });
    });
  });

  tripOriginInput?.addEventListener("input", () => {
    const query = tripOriginInput.value.trim();
    originMeta = { label: query, country: "" };
    clearTimeout(originSuggestTimer);

    if (query.length < 2) {
      clearOriginSuggestions();
      return;
    }

    originSuggestTimer = setTimeout(() => fetchOriginSuggestions(query), 280);
  });

  tripOriginInput?.addEventListener("blur", () => {
    setTimeout(() => clearOriginSuggestions(), 180);
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".survey-origin-wrap")) return;
    clearOriginSuggestions();
  });

  document.getElementById("trip-survey")?.addEventListener("submit", (event) => {
    event.preventDefault();
  });
};

const initTrip = () => {
  const saved = getTripStore();
  const forceSetup = new URLSearchParams(location.search).get("setup") === "1";

  if (saved?.cities?.length && !forceSetup) {
    activeTrip = {
      cities: saved.cities.filter((city) => allCities.includes(city)),
      origin: saved.origin || "",
      originCountry: saved.originCountry || "",
      survey: normalizeSurvey(saved.survey),
    };
    if (!activeTrip.cities.length) {
      selectedCities = [];
      originMeta = { label: activeTrip.origin, country: activeTrip.originCountry };
      if (tripOriginInput && activeTrip.origin) tripOriginInput.value = activeTrip.origin;
      applySurveyToForm(activeTrip.survey);
      updateLandingSelectionUI();
      showView("landing");
      return;
    }
    selectedCities = [...activeTrip.cities];
    originMeta = { label: activeTrip.origin, country: activeTrip.originCountry };
    showView("guide");
    applyTripToGuide();
    switchCityWithWeather(activeTrip.cities[0]);
    return;
  }

  selectedCities = saved?.cities?.length
    ? saved.cities.filter((city) => allCities.includes(city))
    : [];
  if (tripOriginInput && saved?.origin) tripOriginInput.value = saved.origin;
  originMeta = { label: saved?.origin || "", country: saved?.originCountry || "" };
  applySurveyToForm(saved?.survey);
  updateLandingSelectionUI();
  showView("landing");
};
